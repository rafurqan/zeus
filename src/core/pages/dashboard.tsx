import { Card, CardContent } from "@/core/components/ui/card"
import { Button } from "@/core/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components/ui/table"
import { DollarSign, Users, BarChart, AlertCircle, ArrowUpRight, ArrowRight } from "lucide-react"
import BaseLayout from "@/core/components/baseLayout";

const DashboardPage = () => {

  return (
    <BaseLayout>
      <div className="flex min-h-screen">
        <div className="flex-1 w-full ">
          <main className="p-4 ">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-1">
                    <span>Manage Students</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white">
                    <span>Finance Overview</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Revenue */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <h3 className="text-2xl font-bold mt-1">Rp 45.750.000</h3>
                        <div className="flex items-center text-green-500 text-xs mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          <span>+12.5% from last month</span>
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
                        <h3 className="text-2xl font-bold mt-1">87</h3>
                        <div className="flex items-center text-green-500 text-xs mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          <span>5 new this month</span>
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
                        <h3 className="text-2xl font-bold mt-1">78.5%</h3>
                      </div>
                      <div className="bg-gray-100 p-2 rounded-full">
                        <BarChart className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                      <div className="bg-black h-2 rounded-full" style={{ width: "78.5%" }}></div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pending Payments */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Pending Payments</p>
                        <h3 className="text-2xl font-bold mt-1">Rp 12.500.000</h3>
                        <p className="text-xs text-gray-500 mt-1">32 active invoices</p>
                      </div>
                      <div className="bg-gray-100 p-2 rounded-full">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Alert */}
              <div className="bg-red-50 border borbukader-red-200 rounded-md p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Attention Required</h4>
                    <p className="text-sm text-red-600 mt-1">
                      There are overdue invoices totaling Rp 3.500.000 that require immediate attention.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
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
                          <TableRow>
                            <TableCell className="font-medium">Jane Smith</TableCell>
                            <TableCell>Invoice</TableCell>
                            <TableCell>Rp 1.500.000</TableCell>
                            <TableCell>14 Oktober 2023</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Michael Johnson</TableCell>
                            <TableCell>Payment</TableCell>
                            <TableCell>Rp 2.000.000</TableCell>
                            <TableCell>12 Oktober 2023</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Completed
                              </span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Sarah Williams</TableCell>
                            <TableCell>Invoice</TableCell>
                            <TableCell>Rp 1.800.000</TableCell>
                            <TableCell>10 Oktober 2023</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Overdue
                              </span>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="ghost" className="text-sm flex items-center gap-1">
                        <span>View All Transactions</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                      <p className="text-sm text-gray-500 mb-4">Common tasks and actions</p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start text-left h-auto py-3 px-4">
                          <div className="flex items-center">
                            <div className="mr-3 bg-gray-100 p-2 rounded-md">
                              <DollarSign className="h-5 w-5 text-gray-600" />
                            </div>
                            <span>Create New Invoice</span>
                          </div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-left h-auto py-3 px-4">
                          <div className="flex items-center">
                            <div className="mr-3 bg-gray-100 p-2 rounded-md">
                              <DollarSign className="h-5 w-5 text-gray-600" />
                            </div>
                            <span>Record Payment</span>
                          </div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-left h-auto py-3 px-4">
                          <div className="flex items-center">
                            <div className="mr-3 bg-gray-100 p-2 rounded-md">
                              <Users className="h-5 w-5 text-gray-600" />
                            </div>
                            <span>Add New Student</span>
                          </div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-left h-auto py-3 px-4">
                          <div className="flex items-center">
                            <div className="mr-3 bg-gray-100 p-2 rounded-md">
                              <BarChart className="h-5 w-5 text-gray-600" />
                            </div>
                            <span>Generate Reports</span>
                          </div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-left h-auto py-3 px-4">
                          <div className="flex items-center">
                            <div className="mr-3 bg-gray-100 p-2 rounded-md">
                              <Users className="h-5 w-5 text-gray-600" />
                            </div>
                            <span>Attendance Management</span>
                          </div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-left h-auto py-3 px-4">
                          <div className="flex items-center">
                            <div className="mr-3 bg-gray-100 p-2 rounded-md">
                              <Users className="h-5 w-5 text-gray-600" />
                            </div>
                            <span>Academic Records</span>
                          </div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-left h-auto py-3 px-4">
                          <div className="flex items-center">
                            <div className="mr-3 bg-gray-100 p-2 rounded-md">
                              <Users className="h-5 w-5 text-gray-600" />
                            </div>
                            <span>School Calendar</span>
                          </div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-left h-auto py-3 px-4">
                          <div className="flex items-center">
                            <div className="mr-3 bg-gray-100 p-2 rounded-md">
                              <Users className="h-5 w-5 text-gray-600" />
                            </div>
                            <span>Registration Links</span>
                          </div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-left h-auto py-3 px-4">
                          <div className="flex items-center">
                            <div className="mr-3 bg-gray-100 p-2 rounded-md">
                              <Users className="h-5 w-5 text-gray-600" />
                            </div>
                            <span>Master Data</span>
                          </div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Upcoming Payments */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Upcoming Payments</h3>
                      <p className="text-sm text-gray-500 mb-4">Payments due in the next 7 days</p>

                      <div className="border rounded-md p-4 mb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Jane Smith</h4>
                            <p className="text-sm text-gray-500">INV-2023-042</p>
                            <p className="text-sm font-medium mt-1">Rp 1.500.000</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              7 days left
                            </span>
                            <p className="text-xs text-gray-500 mt-1">Due: 25 Oktober 2023</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Student Distribution */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Student Distribution</h3>
                  <p className="text-sm text-gray-500 mb-4">Breakdown of students by program</p>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
                          <span className="text-sm">Elementary School</span>
                        </div>
                        <span className="text-sm">35 students (40.2%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-black h-2 rounded-full" style={{ width: "40.2%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
                          <span className="text-sm">Junior High School</span>
                        </div>
                        <span className="text-sm">28 students (32.2%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-black h-2 rounded-full" style={{ width: "32.2%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
                          <span className="text-sm">Senior High School</span>
                        </div>
                        <span className="text-sm">24 students (27.6%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-black h-2 rounded-full" style={{ width: "27.6%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </BaseLayout>

  )
};

export default DashboardPage;
