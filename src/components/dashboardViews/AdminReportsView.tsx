import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  Calendar,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle,
  AlertCircle,
  Database,
  Zap,
} from "lucide-react";
import { format } from "date-fns";

interface Booking {
  id: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  tripDate: string;
  bookingDate: string;
}

interface User {
  id: number;
  isSuspended: boolean;
  signupDate: string;
}

interface Testimonial {
  id: number;
  rating: number;
  isVisible: boolean;
}

interface AdminReportsViewProps {
  bookings: Booking[];
  users: User[];
  testimonials: Testimonial[];
}

export function AdminReportsView({
  bookings,
  users,
  testimonials,
}: AdminReportsViewProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for growth trends (in real app, this would be from actual data)
  const growthData = [
    { month: "Jan", users: 45, bookings: 12 },
    { month: "Feb", users: 62, bookings: 18 },
    { month: "Mar", users: 78, bookings: 24 },
    { month: "Apr", users: 95, bookings: 32 },
    { month: "May", users: 128, bookings: 42 },
    { month: "Jun", users: 156, bookings: 52 },
  ];

  // Booking status distribution
  const bookingStatusData = [
    { name: "Confirmed", value: bookings.filter((b) => b.status === "confirmed").length, fill: "#10b981" },
    { name: "Pending", value: bookings.filter((b) => b.status === "pending").length, fill: "#f59e0b" },
    { name: "Completed", value: bookings.filter((b) => b.status === "completed").length, fill: "#3b82f6" },
    { name: "Cancelled", value: bookings.filter((b) => b.status === "cancelled").length, fill: "#ef4444" },
  ];

  // Appointment trends (mock)
  const appointmentTrends = [
    { week: "Week 1", confirmed: 8, pending: 3, cancelled: 1 },
    { week: "Week 2", confirmed: 12, pending: 5, cancelled: 2 },
    { week: "Week 3", confirmed: 15, pending: 4, cancelled: 1 },
    { week: "Week 4", confirmed: 18, pending: 6, cancelled: 3 },
  ];

  // Customer segments
  const customerSegments = [
    { name: "First Time", value: Math.round(users.length * 0.35), fill: "#8b5cf6" },
    { name: "Regular", value: Math.round(users.length * 0.45), fill: "#06b6d4" },
    { name: "Premium", value: Math.round(users.length * 0.20), fill: "#ec4899" },
  ];

  // Rating distribution
  const ratingDistribution = [
    { stars: "5 Stars", count: testimonials.filter((t) => t.rating === 5).length, fill: "#10b981" },
    { stars: "4 Stars", count: testimonials.filter((t) => t.rating === 4).length, fill: "#6366f1" },
    { stars: "3 Stars", count: testimonials.filter((t) => t.rating === 3).length, fill: "#f59e0b" },
    { stars: "2 Stars", count: testimonials.filter((t) => t.rating === 2).length, fill: "#ef4444" },
    { stars: "1 Star", count: testimonials.filter((t) => t.rating === 1).length, fill: "#dc2626" },
  ];

  // Financial data (mock)
  const financialData = [
    { month: "Jan", revenue: 150000, expenses: 45000 },
    { month: "Feb", revenue: 200000, expenses: 52000 },
    { month: "Mar", revenue: 180000, expenses: 48000 },
    { month: "Apr", revenue: 250000, expenses: 60000 },
    { month: "May", revenue: 300000, expenses: 70000 },
    { month: "Jun", revenue: 280000, expenses: 65000 },
  ];

  const pricePerTrip = 50000;
  const totalRevenue = bookings.filter((b) => b.status === "confirmed" || b.status === "completed").length * pricePerTrip;
  const activeUsers = users.filter((u) => !u.isSuspended).length;
  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : "0";

  const handleExportPDF = (type: string) => {
    alert(`Exporting ${type} as PDF...`);
  };

  const handleExportExcel = (type: string) => {
    alert(`Exporting ${type} as Excel...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Reports & Analytics</h3>
          <p className="text-sm text-gray-600 mt-1">
            Comprehensive insights into your healthcare management system
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            This Month
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Refresh
          </Button>
          <Button size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
                <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{bookings.length}</p>
                <p className="text-xs text-green-600 mt-1">↑ 5% from last month</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Revenue (MTD)</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{(totalRevenue / 100000).toFixed(1)}L</p>
                <p className="text-xs text-green-600 mt-1">↑ 8% from last month</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{avgRating}</p>
                <p className="text-xs text-gray-600 mt-1">From {testimonials.length} reviews</p>
              </div>
              <div className="bg-pink-50 p-3 rounded-xl">
                <MessageSquare className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="analytics">Customer Analytics</TabsTrigger>
          <TabsTrigger value="feedback">Feedback & Complaints</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* Growth Trends */}
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Growth Trends
              </CardTitle>
              <CardDescription>User and booking registration trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorUsers)"
                      name="Users"
                    />
                    <Area
                      type="monotone"
                      dataKey="bookings"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorBookings)"
                      name="Bookings"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Current system status and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium">Active Users Online</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{activeUsers} Users</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium">Pending Bookings</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {bookings.filter((b) => b.status === "pending").length} Pending
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium">Database Status</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium">Server Uptime</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">99.9%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* APPOINTMENTS TAB */}
        <TabsContent value="appointments" className="space-y-6">
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Appointment Trends</CardTitle>
              <CardDescription>Weekly booking status distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appointmentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="confirmed" fill="#10b981" name="Confirmed" />
                    <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                    <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Booking Status Distribution</CardTitle>
              <CardDescription>Current distribution of all bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bookingStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {bookingStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {bookingStatusData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <Badge>{item.value}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CUSTOMER ANALYTICS TAB */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
              <CardDescription>User distribution by experience level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerSegments}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {customerSegments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  {customerSegments.map((segment) => (
                    <div key={segment.name} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{segment.name}</span>
                        <Badge>{segment.value} users</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(segment.value / users.length) * 100}%`,
                            backgroundColor: segment.fill,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FEEDBACK & COMPLAINTS TAB */}
        <TabsContent value="feedback" className="space-y-6">
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>User testimonials by rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ratingDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stars" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#06b6d4" name="Testimonials" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {ratingDistribution.map((item) => (
                    <div key={item.stars} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="text-sm font-medium">{item.stars}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${testimonials.length > 0 ? (item.count / testimonials.length) * 100 : 0}%`,
                              backgroundColor: item.fill,
                            }}
                          />
                        </div>
                        <Badge>{item.count}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Feedback Summary</CardTitle>
              <CardDescription>Overall user satisfaction metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    {testimonials.filter((t) => t.rating >= 4).length}
                  </div>
                  <div className="text-xs text-green-700 mt-1">Positive Reviews</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-600">
                    {testimonials.filter((t) => t.rating === 3).length}
                  </div>
                  <div className="text-xs text-yellow-700 mt-1">Neutral Reviews</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-600">
                    {testimonials.filter((t) => t.rating <= 2).length}
                  </div>
                  <div className="text-xs text-red-700 mt-1">Negative Reviews</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{testimonials.length}</div>
                  <div className="text-xs text-blue-700 mt-1">Total Reviews</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FINANCIAL TAB */}
        <TabsContent value="financial" className="space-y-6">
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Monthly financial overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Revenue"
                      dot={{ fill: "#10b981", r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Expenses"
                      dot={{ fill: "#ef4444", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-md rounded-2xl">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    ₹{(financialData.reduce((sum, m) => sum + m.revenue, 0) / 100000).toFixed(1)}L
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md rounded-2xl">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 font-medium">Total Expenses</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    ₹{(financialData.reduce((sum, m) => sum + m.expenses, 0) / 100000).toFixed(1)}L
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md rounded-2xl">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 font-medium">Net Profit</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    ₹
                    {(
                      (financialData.reduce((sum, m) => sum + m.revenue, 0) -
                        financialData.reduce((sum, m) => sum + m.expenses, 0)) /
                      100000
                    ).toFixed(1)}
                    L
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Reports */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Reports
          </CardTitle>
          <CardDescription>Download detailed reports in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="text-sm font-medium text-gray-900">Customer Report</div>
                <Badge variant="secondary">PDF</Badge>
              </div>
              <p className="text-xs text-gray-600 mb-4">Complete customer data and analytics</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleExportPDF("Customer Report")}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="text-sm font-medium text-gray-900">Appointments Report</div>
                <Badge variant="secondary">Excel</Badge>
              </div>
              <p className="text-xs text-gray-600 mb-4">Booking details and statistics</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleExportExcel("Appointments Report")}
              >
                <Download className="w-4 h-4" />
                Download Excel
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="text-sm font-medium text-gray-900">Financial Report</div>
                <Badge variant="secondary">PDF</Badge>
              </div>
              <p className="text-xs text-gray-600 mb-4">Revenue and expense details</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleExportPDF("Financial Report")}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
