import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  BarChart3,
  Users,
  Briefcase,
  FileText,
  Settings,
  Menu,
  X,
  Activity,
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  RefreshCw,
  Home,
  ChevronDown,
  LineChart,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getAllUsers as getAllUsersFromAPI } from "@/lib/api";
import { getAllBookings, getAllTestimonials, User, Booking, Testimonial } from "@/lib/db";
import { format } from "date-fns";
import { AdminUsersView } from "@/components/dashboardViews/AdminUsersView";
import { AdminBookingsView } from "@/components/dashboardViews/AdminBookingsView";
import { AdminTestimonialsView } from "@/components/dashboardViews/AdminTestimonialsView";
import { AdminCouponsView } from "@/components/dashboardViews/AdminCouponsView";
import { AdminTestimonialForm } from "@/components/AdminTestimonialForm";
import { AdminReportsView } from "@/components/dashboardViews/AdminReportsView";
import { CustomerManagementView } from "@/components/dashboardViews/CustomerManagementView";
import { UserManagementSystemView } from "@/components/dashboardViews/UserManagementSystemView";

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("overview");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Redirect if not admin
  useEffect(() => {
    // Wait for auth to load before checking
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    if (!isAdmin) {
      navigate("/dashboard");
      return;
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const [usersResponse, allBookings, allTestimonials] = await Promise.all([
        getAllUsersFromAPI(),
        getAllBookings(),
        getAllTestimonials(),
      ]);
      setUsers(usersResponse.users || []);
      setBookings(allBookings || []);
      setTestimonials(allTestimonials || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({ title: "Error", description: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  // Calculate stats
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const visibleTestimonials = testimonials.filter((t) => t.isVisible).length;

  const stats = [
    {
      label: "Total Travelers",
      value: users.length,
      icon: Users,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "Registered users",
    },
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: Briefcase,
      color: "bg-green-50",
      iconColor: "text-green-600",
      description: "All trip bookings",
    },
    {
      label: "Confirmed Trips",
      value: confirmedBookings,
      icon: CheckCircleIcon,
      color: "bg-emerald-50",
      iconColor: "text-emerald-600",
      description: "Confirmed reservations",
    },
    {
      label: "Pending Bookings",
      value: pendingBookings,
      icon: Calendar,
      color: "bg-amber-50",
      iconColor: "text-amber-600",
      description: "Awaiting confirmation",
    },
    {
      label: "Reviews & Ratings",
      value: testimonials.length,
      icon: Star,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      description: "User testimonials",
    },
    {
      label: "Published Reviews",
      value: visibleTestimonials,
      icon: FileText,
      color: "bg-pink-50",
      iconColor: "text-pink-600",
      description: "Visible testimonials",
    },
  ];

  const recentUsers = users.slice(-5).reverse();
  const recentBookings = bookings.slice(-5).reverse();
  const recentTestimonials = testimonials.slice(-5).reverse();

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

  // Don't render content until auth is verified
  // Show loading while auth is still loading, or if not authenticated, or if not admin
  if (authLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white">
            StoriesBy<span className="text-secondary">Foot</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "reports", label: "Reports & Analytics", icon: LineChart },
            { id: "customers", label: "Customers", icon: Users },
            { id: "users", label: "User Management", icon: Users },
            { id: "bookings", label: "Bookings", icon: Briefcase },
            { id: "reviews", label: "Testimonials", icon: FileText },
            { id: "coupons", label: "Coupons", icon: Briefcase },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-orange-400 hover:text-orange-300 rounded-lg transition-colors font-medium text-sm"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
              <p className="text-sm text-gray-600">Complete overview of your travel operations</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={loadData}
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  A
                </div>
                <span className="text-sm font-medium text-gray-900 hidden sm:block">
                  Admin
                </span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => {
                      navigate("/");
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 font-medium text-sm"
                  >
                    <Home className="w-4 h-4" />
                    Go to Home
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : activeNav === "overview" ? (
            <>
              {/* Statistics Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={index}
                      className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer rounded-2xl"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                            <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
                          </div>
                          <div className={`${stat.color} p-3 rounded-xl`}>
                            <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Main Grid - Row 1: Users, Bookings, Reviews */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Travelers */}
                <Card className="border-0 shadow-md rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Recent Travelers
                    </CardTitle>
                    <CardDescription>Latest registrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentUsers.length > 0 ? (
                        recentUsers.map((u) => (
                          <div key={u.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{u.fullName}</p>
                              <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                            <Badge variant="secondary">User</Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No travelers yet</p>
                      )}
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="w-full mt-4 text-primary"
                      onClick={() => navigate("/admin/users")}
                    >
                      View all travelers →
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Bookings */}
                <Card className="border-0 shadow-md rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Recent Bookings
                    </CardTitle>
                    <CardDescription>Latest trip bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentBookings.length > 0 ? (
                        recentBookings.map((b) => (
                          <div key={b.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{b.tripName}</p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(b.tripDate), "MMM dd, yyyy")}
                              </p>
                            </div>
                            <Badge className={`text-xs ${getStatusColor(b.status)}`}>
                              {b.status}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No bookings yet</p>
                      )}
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="w-full mt-4 text-primary"
                      onClick={() => navigate("/admin/bookings")}
                    >
                      View all bookings →
                    </Button>
                  </CardContent>
                </Card>

                {/* Reviews & Testimonials */}
                <Card className="border-0 shadow-md rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Recent Reviews
                    </CardTitle>
                    <CardDescription>User testimonials</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentTestimonials.length > 0 ? (
                        recentTestimonials.map((t) => (
                          <div key={t.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{t.userName}</p>
                              <p className="text-xs text-gray-500">⭐ {t.rating} rating</p>
                            </div>
                            <Badge variant={t.isVisible ? "default" : "secondary"}>
                              {t.isVisible ? "Public" : "Hidden"}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No reviews yet</p>
                      )}
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="w-full mt-4 text-primary"
                      onClick={() => navigate("/admin/reviews")}
                    >
                      View all reviews →
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* System Overview */}
              <Card className="border-0 shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    System Overview
                  </CardTitle>
                  <CardDescription>Real-time travel system metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{users.length}</div>
                      <div className="text-sm text-gray-600 mt-1">Total Travelers</div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{bookings.length}</div>
                      <div className="text-sm text-gray-600 mt-1">Total Bookings</div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-3xl font-bold text-emerald-600">{confirmedBookings}</div>
                      <div className="text-sm text-gray-600 mt-1">Confirmed</div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-3xl font-bold text-amber-600">{pendingBookings}</div>
                      <div className="text-sm text-gray-600 mt-1">Pending</div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">{testimonials.length}</div>
                      <div className="text-sm text-gray-600 mt-1">Total Reviews</div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="text-3xl font-bold text-pink-600">{visibleTestimonials}</div>
                      <div className="text-sm text-gray-600 mt-1">Published</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : activeNav === "reports" ? (
            <AdminReportsView bookings={bookings} users={users} testimonials={testimonials} />
          ) : activeNav === "customers" ? (
            <CustomerManagementView users={users} onDataChange={loadData} />
          ) : activeNav === "users" ? (
            <UserManagementSystemView users={users} onDataChange={loadData} />
          ) : activeNav === "bookings" ? (
            <AdminBookingsView bookings={bookings} users={users} />
          ) : activeNav === "reviews" ? (
            <AdminTestimonialsView testimonials={testimonials} onDataChange={loadData} />
          ) : activeNav === "coupons" ? (
            <AdminCouponsView />
          ) : activeNav === "settings" ? (
            <Card className="border-0 shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>System settings and configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-600">
                  <p>Settings coming soon...</p>
                </div>
              </CardContent>
            </Card>
          ) : null
          }
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Helper component for CheckCircle icon
function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export default AdminDashboard;
