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

  // Protected route check
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/api/login");
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
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold font-heading text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Manage bookings and reports</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border text-sm">
            <span className="text-slate-500">Total Bookings:</span>
            <span className="ml-2 font-bold text-slate-900">{bookings?.length || 0}</span>
          </div>
        </div>

        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-white border-b">
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
