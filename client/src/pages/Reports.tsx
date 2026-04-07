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
