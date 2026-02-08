import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, DollarSign, Users, Calendar, FileText } from "lucide-react";

interface Booking {
  id: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  tripDate: string;
  bookingDate: string;
}

interface AdminRevenueViewProps {
  bookings: Booking[];
  users: { id: number }[];
  testimonials: { id: number }[];
}

export function AdminRevenueView({ bookings, users, testimonials }: AdminRevenueViewProps) {
  // Mock pricing data (in real app, this would come from trip pricing)
  const pricePerTrip = 50000; // ₹50,000 per trip

  // Calculate revenue metrics
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed" || b.status === "completed");
  const totalRevenue = confirmedBookings.length * pricePerTrip;
  const averageRevenuePerUser = users.length > 0 ? Math.round(totalRevenue / users.length) : 0;

  // Monthly revenue data (simulated)
  const monthlyData = [
    { month: "Jan", revenue: 150000, bookings: 3 },
    { month: "Feb", revenue: 200000, bookings: 4 },
    { month: "Mar", revenue: 180000, bookings: 3 },
    { month: "Apr", revenue: 250000, bookings: 5 },
    { month: "May", revenue: 300000, bookings: 6 },
    { month: "Jun", revenue: 280000, bookings: 5 },
  ];

  // Booking status distribution
  const statusData = [
    { name: "Confirmed", value: bookings.filter((b) => b.status === "confirmed").length },
    { name: "Pending", value: bookings.filter((b) => b.status === "pending").length },
    { name: "Completed", value: bookings.filter((b) => b.status === "completed").length },
    { name: "Cancelled", value: bookings.filter((b) => b.status === "cancelled").length },
  ];

  const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#ef4444"];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Revenue & Analytics</h3>
        <p className="text-sm text-gray-600 mt-1">Total revenue and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{(totalRevenue / 100000).toFixed(1)}L</p>
                <p className="text-xs text-gray-500 mt-2">From {confirmedBookings.length} trips</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
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
                <p className="text-xs text-gray-500 mt-2">{confirmedBookings.length} confirmed</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
                <p className="text-xs text-gray-500 mt-2">Active travelers</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg Revenue/User</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{(averageRevenuePerUser / 1000).toFixed(1)}K</p>
                <p className="text-xs text-gray-500 mt-2">Per traveler</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
          <CardDescription>Revenue and bookings over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" label={{ value: "Revenue (₹)", angle: -90, position: "insideLeft" }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: "Bookings", angle: 90, position: "insideRight" }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#10b981" name="Revenue (₹)" />
                <Bar yAxisId="right" dataKey="bookings" fill="#3b82f6" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Booking Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
            <CardDescription>Current status of all bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>Summary Statistics</CardTitle>
            <CardDescription>Key business metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="font-medium text-gray-700">Conversion Rate</span>
                <Badge className="bg-green-100 text-green-800">
                  {bookings.length > 0 ? Math.round((confirmedBookings.length / bookings.length) * 100) : 0}%
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="font-medium text-gray-700">Avg Trip Value</span>
                <Badge className="bg-blue-100 text-blue-800">₹{(pricePerTrip / 1000).toFixed(0)}K</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <span className="font-medium text-gray-700">User Reviews</span>
                <Badge className="bg-purple-100 text-purple-800">{testimonials.length}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="font-medium text-gray-700">Pending Revenue</span>
                <Badge className="bg-amber-100 text-amber-800">
                  ₹{(bookings.filter((b) => b.status === "pending").length * pricePerTrip / 100000).toFixed(1)}L
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="font-medium text-gray-700">Cancelled Bookings</span>
                <Badge className="bg-red-100 text-red-800">
                  {bookings.filter((b) => b.status === "cancelled").length}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-700">Revenue per Month (Avg)</span>
                <Badge className="bg-gray-100 text-gray-800">
                  ₹{(monthlyData.reduce((sum, m) => sum + m.revenue, 0) / monthlyData.length / 100000).toFixed(1)}L
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
