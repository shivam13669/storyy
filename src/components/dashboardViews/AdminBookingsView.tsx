import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Users } from "lucide-react";
import { format } from "date-fns";

interface Booking {
  id: number;
  userId: number;
  tripName: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  bookingDate: string;
  tripDate: string;
  details?: string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
}

interface AdminBookingsViewProps {
  bookings: Booking[];
  users: User[];
}

export function AdminBookingsView({ bookings, users }: AdminBookingsViewProps) {
  const getUserName = (userId: number) => {
    return users.find((u) => u.id === userId)?.fullName || "Unknown User";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Bookings Management</h3>
        <p className="text-sm text-gray-600 mt-1">
          View all trip bookings and their statuses
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{bookings.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Bookings</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{confirmedCount}</div>
              <div className="text-sm text-gray-600 mt-1">Confirmed</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-sm text-gray-600 mt-1">Pending</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{completedCount}</div>
              <div className="text-sm text-gray-600 mt-1">Completed</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            All Bookings
          </CardTitle>
          <CardDescription>Complete list of all trip bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Traveler</TableHead>
                  <TableHead>Trip</TableHead>
                  <TableHead>Trip Date</TableHead>
                  <TableHead>Booking Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium text-gray-900">
                        {getUserName(booking.userId)}
                      </TableCell>
                      <TableCell className="text-gray-600">{booking.tripName}</TableCell>
                      <TableCell className="text-gray-600">
                        {format(new Date(booking.tripDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {format(new Date(booking.bookingDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-600">
                      No bookings yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
