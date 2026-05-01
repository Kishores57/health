# Health Hub Portal - Web Pages Code

This file contains the complete source code for all the web pages in the Health Hub Portal project.

---

## 1. About Us Page
**Path:** `client/src/pages/AboutUs.tsx`

```tsx
import { motion } from "framer-motion";
import { Award, HeartPulse, Microscope, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-blue-50/50 dark:bg-slate-900/50" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-slate-900 dark:text-white">
              About <span className="text-primary">Sanjivani</span> Clinical Laboratory
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              We are committed to delivering highly accurate diagnostic services with state-of-the-art technology, unparalleled expertise, and a patient-first approach.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats/Image Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000"
                  alt="Modern Laboratory"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary/10 rounded-full blur-3xl z-[-1]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold font-heading mb-4 text-slate-900 dark:text-white">
                  A Legacy of Trust and Precision
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                  Since our inception, Sanjivani Clinical Laboratory has been at the forefront of healthcare diagnostics. We believe that an accurate diagnosis is the first and most crucial step towards effective medical treatment. Our laboratories are fully automated and equipped with the latest advancements in pathology to ensure no compromise on quality.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card className="p-6 border-0 shadow-lg bg-blue-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all">
                  <HeartPulse className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">1M+</h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Tests Conducted</p>
                </Card>
                <Card className="p-6 border-0 shadow-lg bg-green-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all">
                  <Users className="h-10 w-10 text-green-600 mb-4" />
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">10k+</h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Happy Patients</p>
                </Card>
                <Card className="p-6 border-0 shadow-lg bg-purple-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all">
                  <Award className="h-10 w-10 text-purple-600 mb-4" />
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">ISO</h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">9001 Certified</p>
                </Card>
                <Card className="p-6 border-0 shadow-lg bg-amber-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all">
                  <Microscope className="h-10 w-10 text-amber-600 mb-4" />
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">24/7</h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Support & Care</p>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision/Mission */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Guided by compassion and precision, we aim to bridge the gap between people and accessible healthcare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -10 }} className="p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-primary shadow-sm hover:scale-110 transition-transform">
                <Microscope className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Precision</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Utilizing cutting-edge technologies and automated workflows to deliver zero-defect diagnostic reports you can count on.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-6 text-green-600 shadow-sm hover:scale-110 transition-transform">
                <HeartPulse className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Compassion</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Treating every sample as a human life. We ensure a comfortable, hygienic, and pain-free experience for everyone.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600 shadow-sm hover:scale-110 transition-transform">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Accessibility</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Making advanced health diagnostics affordable and accessible to the entire community without compromising on excellence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## 2. Admin Dashboard
**Path:** `client/src/pages/AdminDashboard.tsx`

```tsx
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useBookings, useUpdateBookingStatus, useUploadReport, useDeleteBooking } from "@/hooks/use-lab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, FileText, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const updateStatus = useUpdateBookingStatus();
  const uploadReport = useUploadReport();
  const deleteBooking = useDeleteBooking();

  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Protected route check — only owner can access
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setLocation("/auth");
      } else if (user.role !== "owner") {
        setLocation("/");
      }
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || bookingsLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const handleStatusChange = (id: number, status: string) => {
    // @ts-ignore - status string matching
    updateStatus.mutate({ id, status });
  };

  const handleUploadReport = () => {
    if (selectedBooking && selectedFile) {
      uploadReport.mutate({ bookingId: selectedBooking, file: selectedFile }, {
        onSuccess: () => {
          setIsUploadOpen(false);
          setSelectedFile(null);
          setSelectedBooking(null);
        }
      });
    }
  };

  const handleDeleteBooking = (id: number) => {
    if (confirm("Are you sure you want to permanently delete this completed record?")) {
      deleteBooking.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-500">Pending</Badge>;
    }
  };

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold font-heading text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Manage bookings and reports</p>
          </div>
          <div className="bg-background px-4 py-2 rounded-lg shadow-sm border border-border text-sm">
            <span className="text-slate-500">Total Bookings:</span>
            <span className="ml-2 font-bold text-slate-900">{bookings?.length || 0}</span>
          </div>
        </div>

        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-background border-b">
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Test Details</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Report</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings?.map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium">#{booking.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{booking.patientName}</p>
                        <p className="text-xs text-slate-500">{booking.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {booking.tests && booking.tests.length > 0 ? booking.tests.map(t => t.name).join(", ") : "Laboratory Test"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{booking.bookingDate}</p>
                        <p className="text-xs text-slate-500">{booking.timeSlot}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(booking.status)}
                    </TableCell>
                    <TableCell>
                      {/* @ts-ignore - report check */}
                      {booking.report ? (
                        <div className="flex items-center text-green-600 text-xs font-medium">
                          <FileText className="h-3 w-3 mr-1" />
                          Uploaded
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Select 
                          defaultValue={booking.status} 
                          onValueChange={(val) => handleStatusChange(booking.id, val)}
                          disabled={updateStatus.isPending}
                        >
                          <SelectTrigger className="w-[110px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>

                        <Dialog open={isUploadOpen && selectedBooking === booking.id} onOpenChange={(open) => {
                          setIsUploadOpen(open);
                          if (open) setSelectedBooking(booking.id);
                          else setSelectedBooking(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0" title="Upload Report">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          
                          {booking.status === 'completed' && (
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="h-8 w-8 p-0 ml-1" 
                              title="Delete Booking"
                              onClick={() => handleDeleteBooking(booking.id)}
                              disabled={deleteBooking.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Upload Medical Report</DialogTitle>
                              <DialogDescription>
                                Add a report URL for Booking #{booking.id} - {booking.patientName}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <Label htmlFor="file">Report File (PDF)</Label>
                              <Input 
                                id="file" 
                                type="file"
                                accept=".pdf"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    setSelectedFile(e.target.files[0]);
                                  }
                                }}
                                className="mt-2"
                              />
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                              <Button onClick={handleUploadReport} disabled={uploadReport.isPending}>
                                {uploadReport.isPending ? "Uploading..." : "Save Report"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## 3. Book Test Page
**Path:** `client/src/pages/BookTest.tsx`

```tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTests, useCreateBooking } from "@/hooks/use-lab";
import { insertBookingSchema } from "@shared/schema";
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
```

---

## 4. Home Page
**Path:** `client/src/pages/Home.tsx`

```tsx
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Activity, Clock, ShieldCheck, Microscope, CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useTests } from "@/hooks/use-lab";

export default function Home() {
  const { data: tests, isLoading } = useTests();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden pt-32 pb-40 lg:pt-48 lg:pb-56 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=2400')" }}
      >
        <div className="absolute inset-0 bg-slate-950/70" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold tracking-wide uppercase border border-blue-500/30">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Trusted by 10,000+ Patients
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white leading-[1.1]">
                Advanced Diagnostics, <br />
                <span className="text-blue-400">Compassionate Care</span>
              </h1>

              <p className="text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto">
                Experience fast, accurate, and reliable blood testing services from the comfort of your home or at our state-of-the-art laboratory centers.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/book">
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.3 }}
                    className="relative inline-block"
                  >
                    {/* Pulsing glow ring behind the button */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-primary"
                      animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0, 0.35] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Second outer ring */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-blue-400"
                      animate={{ scale: [1, 1.28, 1], opacity: [0.2, 0, 0.2] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    />

                    <motion.button
                      onClick={() => { window.location.href = "/book"; }}
                      className="relative h-16 px-12 text-xl font-bold rounded-2xl text-white overflow-hidden flex items-center gap-3 z-10"
                      style={{
                        background: "linear-gradient(135deg, hsl(var(--primary)) 0%, #3b82f6 60%, #06b6d4 100%)",
                        boxShadow: "0 8px 32px -4px rgba(59,130,246,0.5), 0 2px 8px rgba(0,0,0,0.12)",
                      }}
                      whileHover={{
                        scale: 1.08,
                        y: -4,
                        boxShadow: "0 20px 50px -8px rgba(59,130,246,0.65), 0 4px 16px rgba(0,0,0,0.15)",
                        transition: { type: "spring", stiffness: 300, damping: 16 },
                      }}
                      whileTap={{ scale: 0.95, y: 0 }}
                    >
                      {/* Shimmer sweep */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                        initial={{ x: "-120%" }}
                        animate={{ x: "220%" }}
                        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                      />

                      <span className="relative z-10">Book a Test</span>

                      {/* Arrow that shoots right on hover */}
                      <motion.div
                        className="relative z-10"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowRight className="h-6 w-6" />
                      </motion.div>
                    </motion.button>
                  </motion.div>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-10 mt-8 border-t border-white/20 mx-auto max-w-2xl">
                <div>
                  <h3 className="text-3xl font-bold text-white">24h</h3>
                  <p className="text-sm text-blue-200 mt-1">Fast Reports</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">100+</h3>
                  <p className="text-sm text-blue-200 mt-1">Expert Doctors</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">50k+</h3>
                  <p className="text-sm text-blue-200 mt-1">Happy Patients</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services/Tests Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">Our Popular Tests</h2>
            <p className="text-slate-600">
              We offer a comprehensive range of diagnostic tests. Choose from individual tests or complete health packages.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={{ show: { transition: { staggerChildren: 0.18 } } }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {tests?.slice(0, 3).map((test, i) => (
                <motion.div
                  key={test.id}
                  variants={{
                    hidden: { opacity: 0, y: 60, scale: 0.88, rotate: -3 },
                    show:   { opacity: 1, y: 0,  scale: 1,    rotate: 0,
                              transition: { type: "spring", stiffness: 120, damping: 14 } },
                  }}
                  whileHover={{
                    y: -18,
                    scale: 1.06,
                    rotate: i % 2 === 0 ? 1.5 : -1.5,
                    boxShadow: "0 32px 60px -12px rgba(59,130,246,0.35)",
                    transition: { type: "spring", stiffness: 260, damping: 16 },
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="cursor-pointer"
                >
                  <Card className="group border-slate-100 dark:border-slate-700/60 overflow-hidden flex flex-col h-full [background:linear-gradient(135deg,#fff_80%,#eff6ff_100%)] dark:[background:linear-gradient(135deg,hsl(224_25%_13%)_80%,hsl(220_30%_15%)_100%)]">
                    {/* Animated accent bar */}
                    <motion.div
                      className="h-2 bg-gradient-to-r from-primary via-blue-400 to-cyan-400"
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 1, transition: { duration: 0.6, delay: i * 0.18 + 0.3 } }}
                      viewport={{ once: true }}
                    />
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <motion.div
                          className="p-3 bg-blue-50 rounded-xl"
                          whileHover={{ rotate: [0, -15, 15, -10, 10, 0], transition: { duration: 0.5 } }}
                        >
                          <Microscope className="h-6 w-6 text-primary" />
                        </motion.div>
                        <motion.span
                          className="font-bold text-lg text-primary"
                          whileHover={{ scale: 1.15, transition: { type: "spring", stiffness: 300 } }}
                        >
                          ₹{(test.price / 100).toFixed(2)}
                        </motion.span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors duration-200">
                        {test.name}
                      </h3>
                      <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                        {test.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-700/50 pt-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {test.turnaroundTime}
                        </span>
                        <span className="bg-blue-50 px-2 py-1 rounded-lg text-primary font-medium">
                          {test.sampleType}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-12">
            <Link href="/book">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                View All Tests
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-background p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Easy Booking</h3>
              <p className="text-slate-600">
                Book your appointment online in just a few clicks. Choose your preferred time and location.
              </p>
            </div>
            <div className="bg-background p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Accurate Results</h3>
              <p className="text-slate-600">
                Our fully automated labs ensure 100% accuracy in your test reports with double verification.
              </p>
            </div>
            <div className="bg-background p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Reports</h3>
              <p className="text-slate-600">
                Access your medical history and reports securely online anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-6">
            Prioritize Your Health Today
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
            Don't wait for symptoms. Regular checkups can help detect issues early.
            Book a test now and take the first step towards a healthier life.
          </p>
          <Link href="/book">
            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-semibold shadow-xl">
              Book Appointment
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
```

---

## 5. Login Page
**Path:** `client/src/pages/Login.tsx`

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Loader2, ShieldCheck } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
    const { user } = useAuth();
    const [, setLocation] = useLocation();
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const loginMutation = useMutation({
        mutationFn: async (data: FormValues) => {
            const res = await apiRequest("POST", "/api/login", data);
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Login failed");
            }
            return await res.json();
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["/api/auth/user"], data);
            setLocation("/owner");
        },
        onError: (error: Error) => {
            toast({
                title: "Login Failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    // If already logged in, redirect to owner dashboard
    if (user) {
        setLocation("/owner");
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Owner Login</CardTitle>
                    <CardDescription className="text-center">
                        Restricted access — authorized personnel only
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                                {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
```

---

## 6. Owner Dashboard
**Path:** `client/src/pages/OwnerDashboard.tsx`

```tsx
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  useTests,
  useBookings,
  useCreateTest,
  useUpdateTest,
  useUpdateBookingStatus,
  useUploadReport,
  useDeleteBooking,
} from "@/hooks/use-lab";
import { useLocation } from "wouter";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2, DollarSign, Users, Target, Plus, Pencil,
  Upload, FileText, Trash2, ChevronDown, ClipboardList, Eye,
} from "lucide-react";
import type { Test, BookingResponse } from "@shared/schema";

export default function OwnerDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Data hooks
  const { data: tests, isLoading: testsLoading } = useTests();
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const createTest = useCreateTest();
  const updateTest = useUpdateTest();
  const updateStatus = useUpdateBookingStatus();
  const uploadReport = useUploadReport();
  const deleteBooking = useDeleteBooking();

  // Test modal state
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Partial<Test> | null>(null);

  // Bookings panel state
  const [showBookings, setShowBookings] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [patientDetailsBooking, setPatientDetailsBooking] = useState<BookingResponse | null>(null);
  const bookingsSectionRef = useRef<HTMLDivElement>(null);

  // Protected route & role check — owner only
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setLocation("/auth");
      } else if (user.role !== "owner") {
        setLocation("/");
      }
    }
  }, [user, authLoading, setLocation]);

  // Scroll to bookings panel when it opens
  useEffect(() => {
    if (showBookings && bookingsSectionRef.current) {
      setTimeout(() => {
        bookingsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [showBookings]);

  if (authLoading || testsLoading || bookingsLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "owner") return null;

  // ── Metrics ───────────────────────────────────────────────────────────────
  const summary = bookings?.reduce(
    (acc, b) => {
      acc.totalBookings++;
      if (b.status === "completed") {
        const revenue = (b.tests || []).reduce((sum, t) => sum + t.price / 100, 0);
        acc.revenue += revenue;
      }
      acc.uniquePatients.add(b.phone);
      return acc;
    },
    { totalBookings: 0, revenue: 0, uniquePatients: new Set<string>() }
  ) || { totalBookings: 0, revenue: 0, uniquePatients: new Set<string>() };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const handleTotalBookingsClick = () => {
    setShowBookings(true);
  };

  const handleStatusChange = (id: number, status: string) => {
    // @ts-ignore
    updateStatus.mutate({ id, status });
  };

  const handleUploadReport = () => {
    if (selectedBooking && selectedFile) {
      uploadReport.mutate(
        { bookingId: selectedBooking, file: selectedFile },
        {
          onSuccess: () => {
            setIsUploadOpen(false);
            setSelectedFile(null);
            setSelectedBooking(null);
          },
        }
      );
    }
  };

  const handleDeleteBooking = (id: number) => {
    if (confirm("Permanently delete this completed booking record?")) {
      deleteBooking.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-500">Pending</Badge>;
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-background min-h-screen py-8">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Lab Owner Dashboard</h1>
            <p className="text-slate-500">Business overview, bookings & test management</p>
          </div>
        </div>

        {/* ── Metric Cards ─────────────────────────────────────────────────── */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {/* Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue (Completed)</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{summary.revenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          {/* Unique Patients */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unique Patients</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.uniquePatients.size}</div>
            </CardContent>
          </Card>

          {/* Total Bookings — clickable */}
          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/40 ${
              showBookings ? "border-primary ring-2 ring-primary/20" : ""
            }`}
            onClick={handleTotalBookingsClick}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalBookings}</div>
              <p className="text-xs text-primary mt-1 flex items-center gap-1">
                <ClipboardList className="h-3 w-3" />
                Click to manage bookings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ── Bookings Management Panel ─────────────────────────────────────── */}
        {showBookings && (
          <div ref={bookingsSectionRef}>
            <Card className="border-none shadow-lg mb-8">
              <CardHeader className="bg-background border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    All Bookings
                  </CardTitle>
                  <CardDescription>
                    Manage status, upload reports, and remove completed bookings.
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBookings(false)}
                  className="text-slate-500 hover:text-slate-900"
                >
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Collapse
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {!bookings || bookings.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>No bookings yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="w-[90px]">ID</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Test</TableHead>
                          <TableHead>Date & Slot</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Report</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking) => (
                          <TableRow key={booking.id} className="hover:bg-slate-50/50">
                            {/* ID */}
                            <TableCell className="font-medium text-slate-700">
                              #{booking.id}
                            </TableCell>

                            {/* Patient */}
                            <TableCell>
                              <div>
                                <p className="font-medium text-slate-900">{booking.patientName}</p>
                                <p className="text-xs text-slate-500">{booking.phone}</p>
                              </div>
                            </TableCell>

                            {/* Test */}
                            <TableCell>
                              <Badge variant="secondary" className="font-normal text-xs">
                                {booking.tests && booking.tests.length > 0
                                  ? booking.tests.map((t) => t.name).join(", ")
                                  : "Lab Test"}
                              </Badge>
                            </TableCell>

                            {/* Date & Slot */}
                            <TableCell>
                              <div className="text-sm">
                                <p>{booking.bookingDate}</p>
                                <p className="text-xs text-slate-500">{booking.timeSlot}</p>
                              </div>
                            </TableCell>

                            {/* Status badge */}
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>

                            {/* Report indicator */}
                            <TableCell>
                              {/* @ts-ignore */}
                              {booking.report || booking.reportUrl ? (
                                <div className="flex items-center text-green-600 text-xs font-medium">
                                  <FileText className="h-3 w-3 mr-1" />
                                  Uploaded
                                </div>
                              ) : (
                                <span className="text-slate-400 text-xs">—</span>
                              )}
                            </TableCell>

                            {/* Actions */}
                            <TableCell className="text-right">
                              <div className="flex justify-end items-center gap-2 flex-wrap">
                                {/* View Details */}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0"
                                  title="View Patient Details"
                                  onClick={() => setPatientDetailsBooking(booking as BookingResponse)}
                                >
                                  <Eye className="h-4 w-4 text-slate-500" />
                                </Button>

                                {/* Status Selector */}
                                <Select
                                  defaultValue={booking.status}
                                  onValueChange={(val) => handleStatusChange(booking.id, val)}
                                  disabled={updateStatus.isPending}
                                >
                                  <SelectTrigger className="w-[110px] h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>

                                {/* Upload Report */}
                                <Dialog
                                  open={isUploadOpen && selectedBooking === booking.id}
                                  onOpenChange={(open) => {
                                    setIsUploadOpen(open);
                                    if (open) setSelectedBooking(booking.id);
                                    else { setSelectedBooking(null); setSelectedFile(null); }
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 w-8 p-0"
                                      title="Upload Report"
                                    >
                                      <Upload className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Upload Medical Report</DialogTitle>
                                      <DialogDescription>
                                        Attach a PDF report for Booking #{booking.id} —{" "}
                                        {booking.patientName}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <Label htmlFor={`file-${booking.id}`}>
                                        Report File (PDF)
                                      </Label>
                                      <Input
                                        id={`file-${booking.id}`}
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files.length > 0) {
                                            setSelectedFile(e.target.files[0]);
                                          }
                                        }}
                                        className="mt-2"
                                      />
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => setIsUploadOpen(false)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={handleUploadReport}
                                        disabled={uploadReport.isPending || !selectedFile}
                                      >
                                        {uploadReport.isPending ? (
                                          <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading…
                                          </>
                                        ) : (
                                          "Save Report"
                                        )}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>

                                {/* Delete — only for completed bookings */}
                                {booking.status === "completed" && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-8 w-8 p-0"
                                    title="Delete Booking"
                                    onClick={() => handleDeleteBooking(booking.id)}
                                    disabled={deleteBooking.isPending}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Patient Details Modal ────────────────────────────────────────── */}
        <Dialog open={!!patientDetailsBooking} onOpenChange={(open) => !open && setPatientDetailsBooking(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Patient Details</DialogTitle>
              <DialogDescription>
                Detailed information for Booking #{patientDetailsBooking?.id}
              </DialogDescription>
            </DialogHeader>
            {patientDetailsBooking && (
              <div className="grid gap-3 py-4 text-sm">
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium text-slate-500">Name:</span>
                  <span className="col-span-2">{patientDetailsBooking.patientName}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium text-slate-500">Age:</span>
                  <span className="col-span-2">{patientDetailsBooking.age} years</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium text-slate-500">Phone:</span>
                  <span className="col-span-2">{patientDetailsBooking.phone}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium text-slate-500">Email:</span>
                  <span className="col-span-2">{patientDetailsBooking.email}</span>
                </div>
                <div className="grid grid-cols-3 items-start gap-4">
                  <span className="font-medium text-slate-500">Address:</span>
                  <span className="col-span-2">{patientDetailsBooking.address}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium text-slate-500">Date & Slot:</span>
                  <span className="col-span-2">{patientDetailsBooking.bookingDate} at {patientDetailsBooking.timeSlot}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium text-slate-500">Collection:</span>
                  <span className="col-span-2">
                    {patientDetailsBooking.homeCollection ? (
                      <span className="text-blue-600 font-medium font-semibold flex items-center gap-1">
                        🏡 Home Collection
                      </span>
                    ) : (
                      <span className="text-slate-600 font-medium">🏥 Lab Visit</span>
                    )}
                  </span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setPatientDetailsBooking(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── Tests Management ──────────────────────────────────────────────── */}
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-background border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle>Lab Tests Management</CardTitle>
              <CardDescription>Manage available tests and their pricing.</CardDescription>
            </div>
            <Button
              onClick={() => {
                setEditingTest({
                  name: "",
                  description: "",
                  price: 0,
                  sampleType: "Blood",
                  turnaroundTime: "",
                  category: "",
                  fastingRequired: false,
                  fastingDuration: 0,
                  isPostprandial: false,
                  notificationsEnabled: true,
                });
                setIsTestModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Test
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sample Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests?.map((test) => (
                  <TableRow key={test.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium">{test.name}</TableCell>
                    <TableCell>{test.category}</TableCell>
                    <TableCell>{test.sampleType}</TableCell>
                    <TableCell>₹{(test.price / 100).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingTest(test);
                          setIsTestModalOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 text-slate-500 hover:text-primary" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* ── Test Create / Edit Modal ────────────────────────────────────────── */}
      <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingTest?.id ? "Edit Lab Test" : "Create Lab Test"}
            </DialogTitle>
            <DialogDescription>
              {editingTest?.id
                ? "Update the details and pricing for this test."
                : "Add a new test to the catalog."}
            </DialogDescription>
          </DialogHeader>
          {editingTest && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="t-name">Test Name</Label>
                <Input
                  id="t-name"
                  value={editingTest.name || ""}
                  onChange={(e) => setEditingTest({ ...editingTest, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="t-desc">Description</Label>
                <Input
                  id="t-desc"
                  value={editingTest.description || ""}
                  onChange={(e) => setEditingTest({ ...editingTest, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="t-price">Price (₹)</Label>
                  <Input
                    id="t-price"
                    type="number"
                    value={(editingTest.price || 0) / 100}
                    onChange={(e) =>
                      setEditingTest({
                        ...editingTest,
                        price: Math.round(parseFloat(e.target.value || "0") * 100),
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="t-cat">Category</Label>
                  <Input
                    id="t-cat"
                    value={editingTest.category || ""}
                    onChange={(e) => setEditingTest({ ...editingTest, category: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingTest?.id) {
                  updateTest.mutate(
                    { id: editingTest.id, data: editingTest },
                    { onSuccess: () => setIsTestModalOpen(false) }
                  );
                } else {
                  createTest.mutate(editingTest as Partial<Test>, {
                    onSuccess: () => setIsTestModalOpen(false),
                  });
                }
              }}
              disabled={createTest.isPending || updateTest.isPending}
            >
              {(createTest.isPending || updateTest.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingTest?.id ? "Save Changes" : "Create Test"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

## 7. Register Page
**Path:** `client/src/pages/Register.tsx`

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { Loader2, ShieldCheck } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    password: z.string().min(6, "Password must be at least 6 characters"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z.enum(["admin", "owner"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function Register() {
    const { user } = useAuth();
    const [, setLocation] = useLocation();
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            role: "admin",
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (data: FormValues) => {
            const res = await apiRequest("POST", "/api/register", data);
            return await res.json();
        },
        onSuccess: (user) => {
            queryClient.setQueryData(["/api/auth/user"], user);
            toast({
                title: "Registration Successful",
                description: "Your account has been created.",
            });
            setLocation("/auth");
        },
        onError: (error: Error) => {
            toast({
                title: "Registration Failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    if (user) {
        setLocation(user.role === "owner" ? "/owner" : "/admin");
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 mt-5">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Staff Registration</CardTitle>
                    <CardDescription className="text-center">
                        Create an account to access the dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter email address" type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="First Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Last Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Enter password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="admin">Staff Admin</SelectItem>
                                                    <SelectItem value="owner">Lab Owner</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                                {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Register
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={() => setLocation("/auth")}
                            className="text-primary hover:underline font-medium"
                        >
                            Sign in
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
```

---

## 8. Reports Page
**Path:** `client/src/pages/Reports.tsx`

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FileText, Download, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { getApiUrl } from "@/lib/api-url";
import { useAuth } from "@/hooks/use-auth";

export default function Reports() {
  const [bookingId, setBookingId] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const { user } = useAuth();

  // We are fetching a specific booking by ID to check for reports
  // This simulates a public report check. In a real app, you might verify phone number too.
  const { data: booking, isLoading, error } = useQuery({
    queryKey: [api.bookings.get.path, bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      const url = buildUrl(api.bookings.get.path, { id: bookingId });
      const res = await fetch(getApiUrl(url));
      if (!res.ok) {
        if (res.status === 404) throw new Error("Booking not found");
        throw new Error("Failed to fetch");
      }
      return api.bookings.get.responses[200].parse(await res.json());
    },
    enabled: searchTriggered && !!bookingId,
    retry: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingId) {
      setSearchTriggered(true);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold font-heading text-slate-900 mb-4">Download Reports</h1>
          <p className="text-slate-600">
            Enter your Booking ID to view and download your test results.
          </p>
        </div>

        <Card className="mb-8 shadow-lg border-none">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                placeholder="Enter Booking ID (e.g., 12)"
                value={bookingId}
                onChange={(e) => {
                  setBookingId(e.target.value);
                  setSearchTriggered(false);
                }}
                className="h-12 text-lg"
              />
              <Button type="submit" size="lg" className="h-12 px-8" disabled={isLoading}>
                {isLoading ? "Searching..." : <Search className="h-5 w-5" />}
              </Button>
            </form>
          </CardContent>
        </Card>

        {searchTriggered && error && (
          <Card className="border-red-100 bg-red-50">
            <CardContent className="pt-6 text-center text-red-600">
              <p>No booking found with ID #{bookingId}. Please check and try again.</p>
            </CardContent>
          </Card>
        )}

        {booking && (
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden border-none shadow-xl">
            <div className="h-2 bg-primary" />
            <CardHeader className="bg-slate-50/50 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">
                    {booking.tests && booking.tests.length > 0 ? booking.tests[0].name : "Laboratory Test"}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Patient: {booking.patientName}
                  </CardDescription>
                </div>
                <div className="bg-white px-3 py-1 rounded-full border text-xs font-medium uppercase tracking-wider text-slate-500">
                  {booking.status}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 block">Booking Date</span>
                    <span className="font-medium">{booking.bookingDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Booking ID</span>
                    <span className="font-medium">#{booking.id}</span>
                  </div>
                </div>

                <div className="border-t pt-6 mt-2">
                  {booking.report ? (
                    <div className="flex items-center justify-between bg-green-50 p-4 rounded-xl border border-green-100">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg border border-green-100">
                          <FileText className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-900">Report Available</p>
                          <p className="text-xs text-green-700">Generated on {booking.report.uploadedAt ? new Date(booking.report.uploadedAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                      <a href={booking.report.reportUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </a>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <Lock className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-900 font-medium">Report Pending</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Your report is currently being processed or waiting for upload.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
```

---

## 9. Not Found Page
**Path:** `client/src/pages/not-found.tsx`

```tsx
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```
