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
        setLocation("/owner-login");
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
