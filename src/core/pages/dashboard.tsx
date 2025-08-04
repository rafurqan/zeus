import { Card, CardContent } from "@/core/components/ui/card"
import { Button } from "@/core/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components/ui/table"
import { DollarSign, Users, BarChart, AlertCircle, ArrowUpRight, ArrowRight } from "lucide-react"
import BaseLayout from "@/core/components/baseLayout";
import { useDashboard } from "@/feature/dashboard/hooks/useDashboard";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  const {
    data: dashboardData,
    loading: studentLoading,
    getDashboard
  } = useDashboard();

  useEffect(() => {
    getDashboard();
  }, [getDashboard]);

  function formatRupiah(value: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  }

  return (
    <BaseLayout>
      <div className="flex min-h-screen">
        <div className="flex-1 w-full ">
          <main className="p-4">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-1"
                    onClick={() => navigate("/students/student")}
                  >
                    <span>Manage Students</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              {studentLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6 animate-pulse space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/4"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card Isi */}
                  {/* Total Revenue */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                          <h3 className="text-2xl font-bold mt-1">{formatRupiah(dashboardData?.total_invoice_month ?? 0)}</h3>
                          <div className="flex items-center text-green-500 text-xs mt-1">
                            {/* <ArrowUpRight className="h-3 w-3 mr-1" /> */}
                            {/* <span>+12.5% from last month</span> */}
                          </div>
                        </div>
                        <div className="bg-gray-100 p-2 rounded-full">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Total Students */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Students</p>
                          <h3 className="text-2xl font-bold mt-1">{dashboardData?.total_students_year ?? 0}</h3>
                          <div className="flex items-center text-green-500 text-xs mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            <span>{dashboardData?.total_students_month ?? 0} new this month</span>
                          </div>
                        </div>
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Users className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Collection Rate */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Collection Rate</p>
                          <h3 className="text-2xl font-bold mt-1">{dashboardData?.collection_rate_percent ?? 0}%</h3>
                        </div>
                        <div className="bg-gray-100 p-2 rounded-full">
                          <BarChart className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                        <div className="bg-black h-2 rounded-full" style={{ width: `${dashboardData?.collection_rate_percent ?? 0}%` }}></div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pending Payments */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Pending Payments</p>
                          <h3 className="text-2xl font-bold mt-1">{formatRupiah(dashboardData?.pending_payment ?? 0)}</h3>
                          <p className="text-xs text-gray-500 mt-1">32 active invoices</p>
                        </div>
                        <div className="bg-gray-100 p-2 rounded-full">
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Recent Transactions */}
              {!studentLoading && (
                <div className="grid grid-cols-1">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">Recent Transactions</h3>
                          <p className="text-sm text-gray-500">Latest financial activities in the system</p>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Student</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {/* Data dummy */}
                            <TableRow>
                              <TableCell className="font-medium">John Doe</TableCell>
                              <TableCell>Payment</TableCell>
                              <TableCell>Rp 1.500.000</TableCell>
                              <TableCell>15 Oktober 2023</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Completed
                                </span>
                              </TableCell>
                            </TableRow>
                            {/* ... more rows ... */}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button
                          variant="ghost"
                          className="text-sm flex items-center gap-1"
                          onClick={() => navigate("/payment/paymentData")}
                        >
                          <span>View All Transactions</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </BaseLayout>
  );
}
