import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTests, useBookings, useCreateTest, useUpdateTest } from "@/hooks/use-lab";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, DollarSign, Users, Target, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { Test } from "@shared/schema";

export default function OwnerDashboard() {
    const { user, isLoading: authLoading } = useAuth();
    const [, setLocation] = useLocation();
    const { data: tests, isLoading: testsLoading } = useTests();
    const { data: bookings, isLoading: bookingsLoading } = useBookings();
    const createTest = useCreateTest();
    const updateTest = useUpdateTest();

    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    const [editingTest, setEditingTest] = useState<Partial<Test> | null>(null);

    // Protected route & role check
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                setLocation("/api/login");
            } else if (user.role !== "owner") {
                setLocation("/admin"); // Redirect staff back to admin panel
            }
        }
    }, [user, authLoading, setLocation]);

    if (authLoading || testsLoading || bookingsLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || user.role !== "owner") return null;

    // Calculate Metrics
    const summary = bookings?.reduce(
        (acc, b) => {
            acc.totalBookings++;

            // Calculate revenue (simplified: summing up all completed tests)
            if (b.status === "completed") {
                const revenue = (b.tests || []).reduce((sum, test) => sum + (test.price / 100), 0);
                acc.revenue += revenue;
            }

            // Keep track of unique patients (based on phone number as proxy)
            acc.uniquePatients.add(b.phone);
            return acc;
        },
        { totalBookings: 0, revenue: 0, uniquePatients: new Set<string>() }
    ) || { totalBookings: 0, revenue: 0, uniquePatients: new Set<string>() };

    return (
        <div className="bg-slate-50 min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Lab Owner Dashboard</h1>
                        <p className="text-slate-500">Business overview and test management</p>
                    </div>
                </div>

                {/* Top Metric Cards */}
                <div className="grid gap-4 md:grid-cols-3 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue (Completed)</CardTitle>
                            <DollarSign className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{summary.revenue.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Unique Patients</CardTitle>
                            <Users className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.uniquePatients.size}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                            <Target className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.totalBookings}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tests Management */}
                <Card className="border-none shadow-lg mt-8">
                    <CardHeader className="bg-white border-b flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Lab Tests Management</CardTitle>
                            <CardDescription>Manage available tests and their pricing.</CardDescription>
                        </div>
                        <Button
                            onClick={() => {
                                setEditingTest({ name: "", description: "", price: 0, sampleType: "Blood", turnaroundTime: "", category: "", fastingRequired: false, fastingDuration: 0, isPostprandial: false, notificationsEnabled: true });
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
                                            <Button variant="ghost" size="sm" onClick={() => {
                                                setEditingTest(test);
                                                setIsTestModalOpen(true);
                                            }}>
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

            {/* Test Modal (Create / Edit) */}
            <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingTest?.id ? "Edit Lab Test" : "Create Lab Test"}</DialogTitle>
                        <DialogDescription>
                            {editingTest?.id ? "Update the details and pricing for this test." : "Add a new test to the catalog."}
                        </DialogDescription>
                    </DialogHeader>
                    {editingTest && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Test Name</Label>
                                <Input id="name" value={editingTest.name || ""} onChange={e => setEditingTest({ ...editingTest, name: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="desc">Description</Label>
                                <Input id="desc" value={editingTest.description || ""} onChange={e => setEditingTest({ ...editingTest, description: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Price (₹)</Label>
                                    <Input id="price" type="number"
                                        value={(editingTest.price || 0) / 100}
                                        onChange={e => setEditingTest({ ...editingTest, price: Math.round(parseFloat(e.target.value || "0") * 100) })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="cat">Category</Label>
                                    <Input id="cat" value={editingTest.category || ""} onChange={e => setEditingTest({ ...editingTest, category: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTestModalOpen(false)}>Cancel</Button>
                        <Button onClick={() => {
                            if (editingTest?.id) {
                                updateTest.mutate({ id: editingTest.id, data: editingTest }, { onSuccess: () => setIsTestModalOpen(false) });
                            } else {
                                createTest.mutate(editingTest as Partial<Test>, { onSuccess: () => setIsTestModalOpen(false) });
                            }
                        }}>
                            {editingTest?.id ? "Save Changes" : "Create Test"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
