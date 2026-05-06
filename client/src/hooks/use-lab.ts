import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/api-url";
import { api, buildUrl } from "@shared/routes";
import type { InsertBooking, InsertReport, Booking, Test, Report } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";


// === TESTS HOOKS ===

export function useTests() {
  return useQuery({
    queryKey: [api.tests.list.path],
    queryFn: async () => {
      const res = await fetch(getApiUrl(api.tests.list.path));
      if (!res.ok) throw new Error("Failed to fetch tests");
      return api.tests.list.responses[200].parse(await res.json());
    },
    staleTime: 5 * 60 * 1000,   // consider data fresh for 5 min → no refetch on remount
    gcTime: 10 * 60 * 1000,     // keep in memory for 10 min after last use
  });
}

export function useTest(id: number) {
  return useQuery({
    queryKey: [api.tests.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.tests.get.path, { id });
      const res = await fetch(getApiUrl(url));
      if (!res.ok) throw new Error("Failed to fetch test details");
      return api.tests.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// === BOOKING HOOKS ===

export function useCreateTest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Partial<Test>) => {
      const res = await fetch(getApiUrl(api.tests.create.path), {
        method: api.tests.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create test");
      }
      return api.tests.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tests.list.path] });
      toast({ title: "Test Created", description: "The new lab test was successfully added." });
    },
    onError: (error) => {
      toast({ title: "Error Details", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateTest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Test> }) => {
      const url = buildUrl(api.tests.update.path, { id });
      const res = await fetch(getApiUrl(url), {
        method: api.tests.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update test");
      }
      return api.tests.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tests.list.path] });
      toast({ title: "Test Updated", description: "The lab test details were successfully updated." });
    },
    onError: (error) => {
      toast({ title: "Error Updating Test", description: error.message, variant: "destructive" });
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertBooking) => {
      const res = await fetch(getApiUrl(api.bookings.create.path), {
        method: api.bookings.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create booking");
      }

      return api.bookings.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.bookings.list.path] });
      toast({
        title: "Booking Confirmed",
        description: "Your test has been successfully booked.",
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useBookings() {
  return useQuery({
    queryKey: [api.bookings.list.path],
    queryFn: async () => {
      const res = await fetch(getApiUrl(api.bookings.list.path), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return api.bookings.list.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number, status: "pending" | "confirmed" | "completed" | "cancelled" }) => {
      const url = buildUrl(api.bookings.updateStatus.path, { id });
      const res = await fetch(getApiUrl(url), {
        method: api.bookings.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update status");
      return api.bookings.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.bookings.list.path] });
      toast({
        title: "Status Updated",
        description: "Booking status has been changed successfully.",
      });
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.bookings.delete.path, { id });
      const res = await fetch(getApiUrl(url), {
        method: api.bookings.delete.method,
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete booking");
      }
      return api.bookings.delete.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.bookings.list.path] });
      toast({
        title: "Test Deleted",
        description: "The completed booking test was successfully and securely removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Deletion Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// === REPORT HOOKS ===

export function useUploadReport() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { bookingId: number, file: File, patientEmail?: string, testName?: string, reportUrl?: string }) => {
      // Build native FormData element to handle the multipart form encoding required by Multer
      const formData = new FormData();
      formData.append('report', data.file);
      
      const url = getApiUrl(`/api/bookings/${data.bookingId}/upload`);
      const res = await fetch(getApiUrl(url), {
        method: 'POST',
        // Note: Do NOT set Content-Type manually when using FormData, browser sets it with boundary
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to upload report securely");
      return { ...(await res.json()), _meta: { patientEmail: data.patientEmail, testName: data.testName, reportUrl: data.reportUrl } };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: [api.bookings.list.path] });

      // Email notification is handled server-side via Nodemailer.

      toast({
        title: "Report Uploaded",
        description: "The medical report has been attached to the booking.",
      });
    },
  });
}
