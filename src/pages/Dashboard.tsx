import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  LogOut,
  MapPin,
  Calendar,
  Star,
  Settings,
  Menu,
  X,
  Activity,
  AlertCircle,
  RefreshCw,
  Ticket,
  Heart,
  Home,
  ChevronDown,
  Edit2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getBookingsByUserId, getTestimonialsByUserId, Booking, Testimonial } from "@/lib/db";
import { format } from "date-fns";
import { UserProfileView } from "@/components/dashboardViews/UserProfileView";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { changeUserPassword } from "@/lib/api";

// Country code to phone code mapping
const countryCodeToPhoneCode: { [key: string]: string } = {
  'IN': '91',   // India
  'US': '1',    // United States
  'GB': '44',   // United Kingdom
  'CA': '1',    // Canada
  'AU': '61',   // Australia
  'DE': '49',   // Germany
  'FR': '33',   // France
  'JP': '81',   // Japan
  'CN': '86',   // China
  'BR': '55',   // Brazil
  'MX': '52',   // Mexico
  'ZA': '27',   // South Africa
  'SG': '65',   // Singapore
  'HK': '852',  // Hong Kong
  'PK': '92',   // Pakistan
  'BD': '880',  // Bangladesh
};

const Dashboard = () => {
  const { user, isAuthenticated, isAdmin, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("overview");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.fullName || "");
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Redirect if not authenticated or if admin (admin should go to admin dashboard)
  useEffect(() => {
    // Wait for auth to load before checking
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    if (isAdmin) {
      navigate("/admin/dashboard");
      return;
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  // Load user data function
  const loadData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const userBookings = await getBookingsByUserId(user.id);
      const userTestimonials = await getTestimonialsByUserId(user.id);
      setBookings(userBookings || []);
      setTestimonials(userTestimonials || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load user data when user is available
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    loadData();
  }, [user?.id]);


  // Calculate stats
  const confirmedTrips = bookings.filter((b) => b.status === "confirmed").length;
  const upcomingTrips = bookings.filter((b) => b.status === "confirmed" || b.status === "pending").length;
  const pastTrips = bookings.filter((b) => b.status === "completed").length;
  const myReviews = testimonials.length;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleChangePassword = async (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    await changeUserPassword(oldPassword, newPassword);
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

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: Calendar,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "All your trips",
    },
    {
      label: "Confirmed Trips",
      value: confirmedTrips,
      icon: CheckCircleIcon,
      color: "bg-green-50",
      iconColor: "text-green-600",
      description: "Ready to go",
    },
    {
      label: "Upcoming Trips",
      value: upcomingTrips,
      icon: MapPin,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      description: "Scheduled for you",
    },
    {
      label: "Completed Trips",
      value: pastTrips,
      icon: Ticket,
      color: "bg-emerald-50",
      iconColor: "text-emerald-600",
      description: "Past adventures",
    },
    {
      label: "Your Reviews",
      value: myReviews,
      icon: Star,
      color: "bg-yellow-50",
      iconColor: "text-yellow-600",
      description: "Trip feedback",
    },
    {
      label: "Wishlist",
      value: "0",
      icon: Heart,
      color: "bg-pink-50",
      iconColor: "text-pink-600",
      description: "Saved destinations",
    },
  ];

  const recentBookings = bookings.slice(-5).reverse();
  const recentReviews = testimonials.slice(-5).reverse();

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
  // Show loading while auth is still loading, or if not authenticated, or if user is admin
  if (authLoading || !isAuthenticated || isAdmin) {
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
          <p className="text-sm text-slate-400 mt-1">My Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "bookings", label: "My Bookings", icon: Calendar },
            { id: "reviews", label: "My Reviews", icon: Star },
            { id: "profile", label: "Profile", icon: MapPin },
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
              <h2 className="text-2xl font-bold text-gray-900">
                {activeNav === "profile" ? "My Profile" : "My Trips Dashboard"}
              </h2>
              <p className="text-sm text-gray-600">
                {activeNav === "profile"
                  ? `Hi, ${user?.fullName?.split(" ")[0]}`
                  : "Manage your bookings and adventures"}
              </p>
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
              Refresh
            </Button>
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-900 hidden sm:block">
                  {user?.fullName?.split(" ")[0]}
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

              {/* Main Grid - Bookings and Reviews */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Bookings */}
                <Card className="border-0 shadow-md rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      My Bookings
                    </CardTitle>
                    <CardDescription>Your upcoming and past trips</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentBookings.length > 0 ? (
                        recentBookings.map((booking) => (
                          <div key={booking.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{booking.tripName}</h4>
                              <Badge className={`text-xs ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(booking.tripDate), "MMM dd, yyyy")}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 font-medium">No bookings yet</p>
                          <p className="text-xs text-gray-500 mt-1">Start your adventure!</p>
                          <Button
                            variant="link"
                            size="sm"
                            className="mt-3 text-primary"
                            onClick={() => navigate("/destinations")}
                          >
                            Browse destinations →
                          </Button>
                        </div>
                      )}
                    </div>
                    {recentBookings.length > 0 && (
                      <Button
                        variant="link"
                        size="sm"
                        className="w-full mt-4 text-primary"
                        onClick={() => navigate("/my-bookings")}
                      >
                        View all bookings →
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* My Reviews */}
                <Card className="border-0 shadow-md rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      My Reviews
                    </CardTitle>
                    <CardDescription>Share your travel experiences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentReviews.length > 0 ? (
                        recentReviews.map((review) => (
                          <div key={review.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{review.tripName}</h4>
                              <Badge variant={review.isVisible ? "default" : "secondary"} className="text-xs">
                                {review.isVisible ? "Public" : "Hidden"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{review.quote}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                {review.rating} Stars
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 font-medium">No reviews yet</p>
                          <p className="text-xs text-gray-500 mt-1">Share your experiences!</p>
                        </div>
                      )}
                    </div>
                    {recentReviews.length > 0 && (
                      <Button
                        variant="link"
                        size="sm"
                        className="w-full mt-4 text-primary"
                        onClick={() => navigate("/my-reviews")}
                      >
                        View all reviews →
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats Overview */}
              <Card className="border-0 shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Your Journey Summary
                  </CardTitle>
                  <CardDescription>Overview of your travel profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <div className="text-3xl font-bold text-blue-600">{bookings.length}</div>
                      <div className="text-sm text-blue-700 mt-1">Total Bookings</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                      <div className="text-3xl font-bold text-green-600">{confirmedTrips}</div>
                      <div className="text-sm text-green-700 mt-1">Confirmed</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <div className="text-3xl font-bold text-purple-600">{upcomingTrips}</div>
                      <div className="text-sm text-purple-700 mt-1">Upcoming</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                      <div className="text-3xl font-bold text-amber-600">{testimonials.length}</div>
                      <div className="text-sm text-amber-700 mt-1">Reviews</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Info Card */}
              <Card className="border-0 shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{user?.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        +{user?.countryCode} {user?.mobileNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {user?.signupDate && !isNaN(new Date(user.signupDate).getTime())
                          ? format(new Date(user.signupDate), "MMM dd, yyyy")
                          : "—"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : activeNav === "bookings" ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">My Bookings</h3>
                <p className="text-sm text-gray-600 mt-1">View all your trip bookings</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <Card key={booking.id} className="border-0 shadow-md rounded-2xl">
                      <CardHeader>
                        <CardTitle>{booking.tripName}</CardTitle>
                        <CardDescription>{format(new Date(booking.tripDate), "MMM dd, yyyy")}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-0 shadow-md rounded-2xl lg:col-span-2">
                    <CardContent className="p-8 text-center text-gray-600">
                      <p>No bookings yet</p>
                      <Button variant="link" className="mt-2 text-primary" onClick={() => navigate("/destinations")}>Browse destinations →</Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : activeNav === "reviews" ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">My Reviews</h3>
                <p className="text-sm text-gray-600 mt-1">Share your travel experiences</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recentReviews.length > 0 ? (
                  recentReviews.map((review) => (
                    <Card key={review.id} className="border-0 shadow-md rounded-2xl">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {review.tripName}
                          <Badge variant={review.isVisible ? "default" : "secondary"}>
                            {review.isVisible ? "Public" : "Hidden"}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 mb-2">{review.quote}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {review.rating} Stars
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-0 shadow-md rounded-2xl lg:col-span-2">
                    <CardContent className="p-8 text-center text-gray-600">
                      <p>No reviews yet</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : activeNav === "profile" ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">My Profile</h3>
                <p className="text-sm text-gray-600 mt-1">Manage your personal information and account settings</p>
              </div>

              {/* Personal Information Card */}
              <Card className="border-0 shadow-md rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Your account details</CardDescription>
                    </div>
                    {!isEditingName && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditingName(true);
                          setEditedName(user?.fullName || "");
                        }}
                        className="flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Name
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Full Name - Editable */}
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-2">Full Name</p>
                      {isEditingName ? (
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            placeholder="Enter your full name"
                            className="flex-1"
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              setIsEditingName(false);
                              // Here you would normally call an API to update the name
                              toast({
                                title: "Success",
                                description: "Name will update after you logout and login again"
                              });
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsEditingName(false);
                              setEditedName(user?.fullName || "");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <p className="text-lg font-semibold text-gray-900">{user?.fullName || "—"}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">First letter of your name will update your avatar after logout/login</p>
                    </div>

                    {/* Email */}
                    <div className="border-t pt-6">
                      <p className="text-sm text-gray-600 font-medium mb-2">Email Address</p>
                      <p className="text-lg font-semibold text-gray-900">{user?.email || "—"}</p>
                      <p className="text-xs text-gray-500 mt-2">Cannot be changed after signup</p>
                    </div>

                    {/* Phone */}
                    <div className="border-t pt-6">
                      <p className="text-sm text-gray-600 font-medium mb-2">Phone Number</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {user?.countryCode && user?.mobileNumber
                          ? `+${countryCodeToPhoneCode[user.countryCode] || user.countryCode}${user.mobileNumber}`
                          : "—"}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">Cannot be changed after signup</p>
                    </div>

                    {/* Member Since */}
                    <div className="border-t pt-6">
                      <p className="text-sm text-gray-600 font-medium mb-2">Member Since</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {user?.signupDate && !isNaN(new Date(user.signupDate).getTime())
                          ? format(new Date(user.signupDate), "MMMM dd, yyyy")
                          : "—"}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">Account creation date</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Security Card */}
              <Card className="border-0 shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Manage your password and security settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-4">Your account security is important to us. You can change your password at any time.</p>
                  <Button onClick={() => setIsPasswordModalOpen(true)} className="w-full">Change Password</Button>
                </CardContent>
              </Card>

              <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSubmit={handleChangePassword}
              />
            </div>
          ) : activeNav === "settings" ? (
            <Card className="border-0 shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Account settings and preferences</CardDescription>
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

export default Dashboard;
