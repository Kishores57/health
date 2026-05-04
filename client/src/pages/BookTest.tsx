import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTests, useCreateBooking } from "@/hooks/use-lab";
import { insertBookingSchema } from "@shared/schema";
import { sendBookingConfirmation } from "@/lib/emailjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, Loader2, Beaker } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Extend the schema for form validation including required date
const formSchema = insertBookingSchema.extend({
  bookingDate: z.date({
    required_error: "Please select a date",
  }),
  testIds: z.array(z.number()).min(1, "Please select at least one test"),
  age: z.coerce.number().min(1, "Age is required").max(120),
});

type FormValues = z.infer<typeof formSchema>;

export default function BookTest() {
  const { data: tests, isLoading: isLoadingTests } = useTests();
  const createBooking = useCreateBooking();
  const [step, setStep] = useState(1);
  const [bookingId, setBookingId] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      phone: "",
      email: "",
      testIds: [],
      timeSlot: "",
      address: "",
      homeCollection: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    // Format date as YYYY-MM-DD string as expected by the backend date type
    const formattedData = {
      ...data,
      testIds: data.testIds,
      bookingDate: format(data.bookingDate, "yyyy-MM-dd"),
    };

    // @ts-ignore - casting mismatch between date object and date string
    createBooking.mutate(formattedData, {
      onSuccess: (res) => {
        if (res && res.id) {
          setBookingId(res.id);
        }

        // ── Send booking confirmation via EmailJS (client-side, non-blocking) ──
        if (data.email) {
          // Determine the selected test names
          const selectedTests = tests?.filter(t => data.testIds.includes(t.id)) || [];
          const testName = selectedTests.map(t => t.name).join(", ") || "Medical Test";

          // Fasting: pick the strictest fasting requirement among selected tests
          const fastingTest = selectedTests
            .filter(t => t.fastingRequired)
            .sort((a, b) => (b.fastingDuration || 0) - (a.fastingDuration || 0))[0];

          const fastingInstructions = fastingTest
            ? `Please maintain a strict fasting period of ${fastingTest.fastingDuration} hours before your appointment.`
            : "No fasting is required for your scheduled test.";

          sendBookingConfirmation({
            patient_name: data.patientName,
            email: data.email,
            booking_id: res?.id || "",
            test_name: testName,
            booking_date: format(data.bookingDate, "dd MMM yyyy"),
            time_slot: data.timeSlot,
            fasting_instructions: fastingInstructions,
          });
        }

        setStep(3);
      }
    });
  };

  const nextStep = async () => {
    // Validate fields for current step
    const fieldsToValidate = step === 1
      ? ['testIds', 'bookingDate', 'timeSlot'] as const
      : ['patientName', 'age', 'phone', 'email', 'address'] as const;

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setStep(step + 1);
  };

  // Success view
  if (step === 3) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md text-center p-8 border-none shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 mb-2">Booking Confirmed!</h2>
          <p className="text-slate-600 mb-6">
            We have received your booking request. A confirmation email has been sent to {form.getValues().email}.
          </p>
          {bookingId && (
            <div className="bg-slate-100 rounded-lg p-6 mb-8 border border-slate-200">
              <p className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-semibold">Your Booking ID</p>
              <p className="text-4xl font-bold text-primary">#{bookingId}</p>
              <p className="text-xs text-slate-500 mt-3">Please save this ID to check and download your reports later.</p>
            </div>
          )}
          <Button onClick={() => window.location.href = '/'} className="w-full h-12">
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-heading text-slate-900">Book a Test</h1>
          <p className="text-slate-600 mt-2">Fill in the details below to schedule your appointment.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className={cn("flex items-center gap-2", step >= 1 ? "text-primary" : "text-slate-400")}>
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2", step >= 1 ? "border-primary bg-primary text-white" : "border-slate-300 bg-white")}>1</div>
            <span className="font-medium hidden sm:inline">Test Details</span>
          </div>
          <div className={cn("w-12 h-0.5 mx-4", step >= 2 ? "bg-primary" : "bg-slate-300")} />
          <div className={cn("flex items-center gap-2", step >= 2 ? "text-primary" : "text-slate-400")}>
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2", step >= 2 ? "border-primary bg-primary text-white" : "border-slate-300 bg-white")}>2</div>
            <span className="font-medium hidden sm:inline">Patient Info</span>
          </div>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>{step === 1 ? "Select Test & Time" : "Patient Information"}</CardTitle>
            <CardDescription>
              {step === 1 ? "Choose your preferred test and appointment slot." : "Tell us who this test is for."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="testIds"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Select Test(s)</FormLabel>
                            <FormDescription>
                              You can choose multiple tests. We will calculate the fasting duration for the strictest test.
                            </FormDescription>
                          </div>
                          {isLoadingTests ? (
                            <div className="text-sm text-muted-foreground p-4 text-center">Loading tests...</div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto p-1">
                              {tests?.map((test) => (
                                <FormField
                                  key={test.id}
                                  control={form.control}
                                  name="testIds"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={test.id}
                                        className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-white hover:bg-slate-50 transition-colors"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(test.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...(field.value || []), test.id])
                                                : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== test.id
                                                  )
                                                )
                                            }}
                                          />
                                        </FormControl>
                                        <div className="font-normal flex flex-col items-start gap-1 w-full">
                                          <FormLabel className="font-medium cursor-pointer w-full">
                                            {test.name}
                                          </FormLabel>
                                          <FormDescription className="text-xs">
                                            ₹{(test.price / 100).toFixed(2)}
                                            {test.fastingRequired ? ` • ${test.fastingDuration}h fasting` : " • No fasting"}
                                          </FormDescription>
                                        </div>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="bookingDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Preferred Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "h-12 pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 bg-white" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="timeSlot"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time Slot</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white">
                                {["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"].map((slot) => (
                                  <SelectItem key={slot} value={slot}>
                                    {slot}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="patientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="30" className="h-12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 000-0000" className="h-12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="homeCollection"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white shadow-sm hover:border-primary/50 transition-colors">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base cursor-pointer">
                              Home Sample Collection
                            </FormLabel>
                            <FormDescription className="cursor-pointer">
                              Check this if you want our phlebotomist to collect the sample from your home.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={(checked) => field.onChange(checked === true)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Home Address (for sample collection)</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, Apt 4B" className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                <div className="flex gap-4 pt-4">
                  {step === 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="h-12 px-6"
                    >
                      Back
                    </Button>
                  )}
                  {step === 1 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="h-12 px-8 ml-auto"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={createBooking.isPending}
                      className="h-12 px-8 ml-auto flex-1 md:flex-none"
                    >
                      {createBooking.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        "Confirm Booking"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
