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
  User,
  Phone,
  Search,
  Trash2,
  Plus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { UserProfileView } from "@/components/dashboardViews/UserProfileView";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { AdvancedDatePicker } from "@/components/AdvancedDatePicker";
import { changeUserPassword, getBookingsByUser, getTestimonialsByUser, updateUser, updateUserDocuments, Booking, Testimonial } from "@/lib/api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import statesAndDistricts from "@/data/states-and-districts.json";
import countries from "@/data/countries.json";

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

const COUNTRY_DIGIT_REQUIREMENTS: Record<string, { min: number; max: number }> = {
  IN: { min: 10, max: 10 },
  US: { min: 10, max: 10 },
  GB: { min: 10, max: 11 },
  CA: { min: 10, max: 10 },
  AU: { min: 9, max: 9 },
  DE: { min: 10, max: 11 },
  FR: { min: 9, max: 9 },
  IT: { min: 10, max: 10 },
  ES: { min: 9, max: 9 },
  JP: { min: 10, max: 11 },
  CN: { min: 11, max: 11 },
  SG: { min: 8, max: 8 },
  MY: { min: 9, max: 10 },
  TH: { min: 9, max: 10 },
  PH: { min: 10, max: 10 },
  ID: { min: 9, max: 12 },
  SL: { min: 9, max: 9 },
  NP: { min: 10, max: 10 },
  BR: { min: 10, max: 11 },
  MX: { min: 10, max: 10 },
  ZA: { min: 10, max: 10 },
  HK: { min: 8, max: 8 },
  PK: { min: 10, max: 10 },
  BD: { min: 10, max: 10 },
};

const COUNTRIES = [
  { code: 'IN', name: 'India', dial: '+91' },
  { code: 'US', name: 'United States', dial: '+1' },
  { code: 'GB', name: 'United Kingdom', dial: '+44' },
  { code: 'CA', name: 'Canada', dial: '+1' },
  { code: 'AU', name: 'Australia', dial: '+61' },
  { code: 'DE', name: 'Germany', dial: '+49' },
  { code: 'FR', name: 'France', dial: '+33' },
  { code: 'JP', name: 'Japan', dial: '+81' },
  { code: 'CN', name: 'China', dial: '+86' },
  { code: 'BR', name: 'Brazil', dial: '+55' },
  { code: 'MX', name: 'Mexico', dial: '+52' },
  { code: 'ZA', name: 'South Africa', dial: '+27' },
  { code: 'SG', name: 'Singapore', dial: '+65' },
  { code: 'HK', name: 'Hong Kong', dial: '+852' },
  { code: 'PK', name: 'Pakistan', dial: '+92' },
  { code: 'BD', name: 'Bangladesh', dial: '+880' },
];

const formatDisplayPhoneNumber = (countryCode?: string, mobileNumber?: string) => {
  if (!countryCode || !mobileNumber) return '—';
  const phoneCode = countryCodeToPhoneCode[countryCode] || countryCode;
  return `+${phoneCode} ${mobileNumber}`;
};

const isGooglePlaceholderPhone = (mobileNumber?: string) =>
  !!mobileNumber && mobileNumber.startsWith('GOOGLE_');

const calculateAgeFromDOB = (selectedDOB?: Date | null) => {
  if (!selectedDOB) return null;

  const today = new Date();
  const birthdayThisYear = new Date(today.getFullYear(), selectedDOB.getMonth(), selectedDOB.getDate());
  let age = today.getFullYear() - selectedDOB.getFullYear();

  if (today < birthdayThisYear) {
    age -= 1;
  }

  return age;
};

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const Dashboard = () => {
  const { user, isAuthenticated, isAdmin, logout, refreshUser, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [activeNav, setActiveNav] = useState("overview");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.fullName || "");
  const [isSavingName, setIsSavingName] = useState(false);
  const [isPhoneEditing, setIsPhoneEditing] = useState(false);
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCountrySearch, setPhoneCountrySearch] = useState("");
  const [openPhoneCountryPopover, setOpenPhoneCountryPopover] = useState(false);
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState(COUNTRIES[0]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [openStatePopover, setOpenStatePopover] = useState(false);
  const [openDistrictPopover, setOpenDistrictPopover] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [openGenderPopover, setOpenGenderPopover] = useState(false);
  const [selectedDOB, setSelectedDOB] = useState<Date | null>(null);
  const [openDOBPopover, setOpenDOBPopover] = useState(false);
  const [selectedAnniversary, setSelectedAnniversary] = useState<Date | null>(null);
  const [openAnniversaryPopover, setOpenAnniversaryPopover] = useState(false);
  const [selectedExpiryDate, setSelectedExpiryDate] = useState<Date | null>(null);
  const [openExpiryDatePopover, setOpenExpiryDatePopover] = useState(false);
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState("");
  const [openMaritalStatusPopover, setOpenMaritalStatusPopover] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [openCountryPopover, setOpenCountryPopover] = useState(false);
  const [selectedNationality, setSelectedNationality] = useState("");
  const [nationalitySearch, setNationalitySearch] = useState("");
  const [openNationalityPopover, setOpenNationalityPopover] = useState(false);

  // Documents state
  const [documents, setDocuments] = useState<Array<{id: string; type: string; number: string}>>([]);
  const [openDocTypePopovers, setOpenDocTypePopovers] = useState<{[key: string]: boolean}>({});
  const [docTypeSearches, setDocTypeSearches] = useState<{[key: string]: string}>({});
  const [passportNumber, setPassportNumber] = useState("");
  const [panCardNumber, setPanCardNumber] = useState("");
  const [aadhaarCardNumber, setAadhaarCardNumber] = useState("");
  const [isSavingDocuments, setIsSavingDocuments] = useState(false);
  const documentTypes = ["Driving License", "Voter ID"];

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

  // Sync editedName with user fullName when user data loads
  useEffect(() => {
    if (user?.fullName) {
      setEditedName(user.fullName);
    }
  }, [user?.fullName]);

  // Initialize profile fields from user data
  useEffect(() => {
    if (user) {
      if ((user as any).gender) {
        setSelectedGender((user as any).gender);
      }
      if ((user as any).dateOfBirth) {
        try {
          const dobDate = new Date((user as any).dateOfBirth);
          if (!isNaN(dobDate.getTime())) {
            setSelectedDOB(dobDate);
          }
        } catch (e) {
          console.error('Invalid DOB:', e);
        }
      }
      if ((user as any).nationality) {
        setSelectedNationality((user as any).nationality);
      }
      if ((user as any).maritalStatus) {
        setSelectedMaritalStatus((user as any).maritalStatus);
      }
      if ((user as any).anniversary) {
        try {
          const annDate = new Date((user as any).anniversary);
          if (!isNaN(annDate.getTime())) {
            setSelectedAnniversary(annDate);
          }
        } catch (e) {
          console.error('Invalid anniversary:', e);
        }
      }
      if ((user as any).state) {
        setSelectedState((user as any).state);
      }
      if ((user as any).district) {
        setSelectedDistrict((user as any).district);
      }
      // Initialize document fields
      if ((user as any).passportNumber) {
        setPassportNumber((user as any).passportNumber);
      }
      if ((user as any).panCardNumber) {
        setPanCardNumber((user as any).panCardNumber);
      }
      if ((user as any).aadhaarCardNo) {
        setAadhaarCardNumber((user as any).aadhaarCardNo);
      }
      if ((user as any).passportExpiryDate) {
        try {
          const expiryDate = new Date((user as any).passportExpiryDate);
          if (!isNaN(expiryDate.getTime())) {
            setSelectedExpiryDate(expiryDate);
          }
        } catch (e) {
          console.error('Invalid expiry date:', e);
        }
      }
      if ((user as any).passportIssuingCountry) {
        setSelectedCountry((user as any).passportIssuingCountry);
      }
      // Load documents from user object if they exist
      if ((user as any).documents) {
        try {
          const parsedDocs = typeof (user as any).documents === 'string'
            ? JSON.parse((user as any).documents)
            : (user as any).documents;
          if (Array.isArray(parsedDocs)) {
            setDocuments(parsedDocs);
          } else {
            setDocuments([]);
          }
        } catch (e) {
          console.error('Error parsing documents:', e);
          setDocuments([]);
        }
      } else {
        setDocuments([]);
      }
    }
  }, [user]);

  // Load user data function
  const loadData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const bookingsResponse = await getBookingsByUser(user.id);
      const testimonialsResponse = await getTestimonialsByUser(user.id);
      setBookings(bookingsResponse.bookings || []);
      setTestimonials(testimonialsResponse.testimonials || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load your data",
        variant: "destructive"
      });
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
    if (!user?.id) {
      throw new Error("User not authenticated");
    }
    await changeUserPassword(user.id, oldPassword, newPassword);
  };

  const openPhoneEditor = () => {
    const indiaCountry = COUNTRIES.find((country) => country.code === 'IN') || COUNTRIES[0];
    const currentCountry = user?.countryCode
      ? COUNTRIES.find((country) => country.code === user.countryCode) || indiaCountry
      : indiaCountry;
    const initialCountry = phoneIsMissing ? indiaCountry : currentCountry;

    setSelectedPhoneCountry(initialCountry);
    setPhoneNumber(phoneIsMissing ? "" : user?.mobileNumber || "");
    setPhoneCountrySearch("");
    setOpenPhoneCountryPopover(false);
    setIsPhoneEditing(true);
  };

  const closePhoneEditor = () => {
    setIsPhoneEditing(false);
    setIsSavingPhone(false);
    setPhoneNumber("");
    setPhoneCountrySearch("");
    setOpenPhoneCountryPopover(false);
  };

  const filteredPhoneCountries = COUNTRIES.filter((country) =>
    `${country.name} ${country.code} ${country.dial}`.toLowerCase().includes(phoneCountrySearch.toLowerCase())
  );

  const handleSavePhone = async () => {
    if (!user?.id) {
      toast({ title: "Error", description: "User not authenticated", variant: "destructive" });
      return;
    }

    if (!phoneNumber.trim()) {
      toast({ title: "Error", description: "Please enter your phone number", variant: "destructive" });
      return;
    }

    setIsSavingPhone(true);
    try {
      await updateUser(user.id, {
        mobileNumber: phoneNumber.trim(),
        countryCode: selectedPhoneCountry.code,
      });
      await refreshUser();
      toast({ title: "Success", description: "Phone number added successfully" });
      closePhoneEditor();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update phone number",
        variant: "destructive",
      });
    } finally {
      setIsSavingPhone(false);
    }
  };

  const handleSaveDocuments = async () => {
    if (!user?.id) {
      toast({ title: "Error", description: "User not authenticated", variant: "destructive" });
      return;
    }

    setIsSavingDocuments(true);
    try {
      const documentData: any = {};

      if (passportNumber) documentData.passportNumber = passportNumber;
      if (selectedExpiryDate) documentData.passportExpiryDate = format(selectedExpiryDate, "yyyy-MM-dd");
      if (selectedCountry) documentData.passportIssuingCountry = selectedCountry;
      if (panCardNumber) documentData.panCardNumber = panCardNumber;
      if (aadhaarCardNumber) documentData.aadhaarCardNo = aadhaarCardNumber;
      if (documents.length > 0) documentData.documents = documents;

      await updateUserDocuments(user.id, documentData);
      await refreshUser();
      toast({ title: "Success", description: "Documents saved successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save documents",
        variant: "destructive",
      });
    } finally {
      setIsSavingDocuments(false);
    }
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

  const phoneIsMissing = !user?.countryCode || !user?.mobileNumber || isGooglePlaceholderPhone(user.mobileNumber);
  const displayPhoneNumber = formatDisplayPhoneNumber(user?.countryCode, phoneIsMissing ? undefined : user?.mobileNumber);
  const phoneChangeAvailableAt = user?.phoneLastChangedAt
    ? new Date(user.phoneLastChangedAt).getTime() + THIRTY_DAYS_MS
    : null;
  const isPhoneChangeLocked = phoneChangeAvailableAt ? Date.now() < phoneChangeAvailableAt : false;
  const phoneDaysRemaining = phoneChangeAvailableAt
    ? Math.max(0, Math.ceil((phoneChangeAvailableAt - Date.now()) / DAY_MS))
    : 0;

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
            Stories by <span className="text-secondary">Foot</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">My Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm text-slate-300 hover:text-white"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            <span>Go to Home</span>
          </button>

          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "bookings", label: "My Bookings", icon: Calendar },
            { id: "reviews", label: "My Reviews", icon: Star },
            { id: "profile", label: "Profile", icon: User },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setSidebarOpen(false);
                }}
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
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4 flex flex-col gap-3 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4 min-w-0">
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
          <div className="flex items-center gap-2 sm:gap-4 self-end sm:self-auto">
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
        <div className="p-4 space-y-6 sm:p-6">
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
                          <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
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
                        onClick={() => {
                          setSidebarOpen(false);
                          navigate("/my-bookings");
                        }}
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
                          <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
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
                        onClick={() => {
                          setSidebarOpen(false);
                          navigate("/my-reviews");
                        }}
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
                      {phoneIsMissing ? (
                        <div className="mt-1 space-y-2">
                          <p className="text-lg font-semibold text-gray-900">Phone not added</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-fit"
                            onClick={() => {
                              setActiveNav("profile");
                              openPhoneEditor();
                            }}
                          >
                            Add Phone Number
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-1 space-y-2">
                          <p className="text-lg font-semibold text-gray-900">{displayPhoneNumber}</p>
                          {!isPhoneChangeLocked ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-fit"
                              onClick={() => {
                                setActiveNav("profile");
                                openPhoneEditor();
                              }}
                            >
                              Change Phone Number
                            </Button>
                          ) : (
                            <p className="text-xs text-gray-500">
                              Change available in {phoneDaysRemaining} day{phoneDaysRemaining === 1 ? "" : "s"}
                            </p>
                          )}
                        </div>
                      )}
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
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">My Profile</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage your personal information and account settings</p>
                </div>
                <Button
                  className="bg-gray-700 hover:bg-gray-800 text-white"
                  onClick={async () => {
                    if (!editedName.trim()) {
                      toast({
                        title: "Error",
                        description: "Name cannot be empty",
                        variant: "destructive"
                      });
                      return;
                    }

                    setIsSavingName(true);
                    try {
                      if (!user?.id) {
                        throw new Error("User not authenticated");
                      }

                      const updateData: any = { fullName: editedName };

                      if (selectedGender) updateData.gender = selectedGender;
                      if (selectedDOB) {
                        updateData.dateOfBirth = format(selectedDOB, "yyyy-MM-dd");
                        const age = calculateAgeFromDOB(selectedDOB);
                        if (age !== null) updateData.age = age;
                      }
                      if (selectedNationality) updateData.nationality = selectedNationality;
                      if (selectedMaritalStatus) updateData.maritalStatus = selectedMaritalStatus;
                      if (selectedAnniversary) updateData.anniversary = format(selectedAnniversary, "yyyy-MM-dd");
                      if (selectedState) updateData.state = selectedState;
                      if (selectedDistrict) updateData.district = selectedDistrict;

                      await updateUser(user.id, updateData);
                      await refreshUser();
                      toast({
                        title: "Success",
                        description: "Your profile has been updated successfully"
                      });
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: error instanceof Error ? error.message : "Failed to update profile",
                        variant: "destructive"
                      });
                    } finally {
                      setIsSavingName(false);
                    }
                  }}
                  disabled={isSavingName}
                >
                  {isSavingName ? "Saving..." : "SAVE"}
                </Button>
              </div>

              {/* General Information Card */}
              <Card className="border-0 shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Full Name and empty column */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Full Name</label>
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full mt-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                      <div></div>
                    </div>

                    {/* Gender and Date of Birth */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Gender</label>
                        <Popover open={openGenderPopover} onOpenChange={setOpenGenderPopover}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full mt-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all flex items-center justify-between"
                            >
                              <span>{selectedGender || "Select Gender"}</span>
                              <ChevronDown className="h-5 w-5 text-gray-600 flex-shrink-0" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-50" align="start">
                            <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-lg">
                              {["Male", "Female", "Others"].map((gender) => (
                                <button
                                  key={gender}
                                  type="button"
                                  onClick={() => {
                                    setSelectedGender(gender);
                                    setOpenGenderPopover(false);
                                  }}
                                  className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${
                                    selectedGender === gender
                                      ? "bg-blue-50 text-gray-900 font-semibold border-l-3 border-blue-500"
                                      : "text-gray-700 hover:bg-blue-50 border-l-3 border-transparent"
                                  }`}
                                >
                                  <span>{gender}</span>
                                  {selectedGender === gender && (
                                    <span className="text-blue-600 font-bold">✓</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Date of Birth</label>
                        <Popover open={openDOBPopover} onOpenChange={setOpenDOBPopover}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full mt-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all flex items-center justify-between"
                            >
                              <span className="text-gray-900">
                                {selectedDOB ? format(selectedDOB, "dd MMM, yyyy") : "Select Date"}
                              </span>
                              <ChevronDown className="h-5 w-5 text-gray-600 flex-shrink-0" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-50" align="start">
                            <AdvancedDatePicker
                              selected={selectedDOB || undefined}
                              onSelect={(date) => {
                                setSelectedDOB(date);
                                setOpenDOBPopover(false);
                              }}
                              maxDate={new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Age (auto-calculated) */}
                    <div>
                      <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Age</label>
                      <div className="w-full mt-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all flex items-center justify-between">
                        <span className="text-gray-900">
                          {calculateAgeFromDOB(selectedDOB) ?? "—"}
                        </span>
                        <span className="text-xs text-gray-500">Auto-calculated</span>
                      </div>
                    </div>

                    {/* Nationality */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Nationality</label>
                        <Popover open={openNationalityPopover} onOpenChange={(open) => {
                          setOpenNationalityPopover(open);
                          if (!open) setNationalitySearch("");
                        }}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full mt-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all flex items-center justify-between"
                            >
                              <span>{selectedNationality || "Select Nationality"}</span>
                              <ChevronDown className="h-5 w-5 text-gray-600 flex-shrink-0" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-50" align="start">
                            <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-lg">
                              <div className="sticky top-0 z-10 p-4 border-b border-gray-200 bg-white">
                                <div className="relative">
                                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
                                  <input
                                    type="text"
                                    placeholder="Search countries..."
                                    value={nationalitySearch}
                                    onChange={(e) => setNationalitySearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                                    autoFocus
                                  />
                                </div>
                              </div>
                              <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                {countries
                                  .filter((c) => c.name.toLowerCase().includes(nationalitySearch.toLowerCase()))
                                  .length > 0 ? (
                                  countries
                                    .filter((c) => c.name.toLowerCase().includes(nationalitySearch.toLowerCase()))
                                    .map((country) => (
                                      <button
                                        key={country.code}
                                        type="button"
                                        onClick={() => {
                                          setSelectedNationality(country.name);
                                          setOpenNationalityPopover(false);
                                          setNationalitySearch("");
                                        }}
                                        className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between group ${
                                          selectedNationality === country.name
                                            ? "bg-blue-50 text-gray-900 font-semibold border-l-3 border-blue-500"
                                            : "text-gray-700 hover:bg-blue-50 border-l-3 border-transparent"
                                        }`}
                                      >
                                        <span>{country.name}</span>
                                        {selectedNationality === country.name && (
                                          <span className="text-blue-600 font-bold">✓</span>
                                        )}
                                      </button>
                                    ))
                                ) : (
                                  <div className="px-4 py-8 text-sm text-gray-500 text-center">No countries found</div>
                                )}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div></div>
                    </div>

                    {/* Marital Status and Anniversary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Marital Status</label>
                        <Popover open={openMaritalStatusPopover} onOpenChange={setOpenMaritalStatusPopover}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full mt-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all flex items-center justify-between"
                            >
                              <span>{selectedMaritalStatus || "Select Status"}</span>
                              <ChevronDown className="h-5 w-5 text-gray-600 flex-shrink-0" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-50" align="start">
                            <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-lg">
                              {["Single", "Married", "Others"].map((status) => (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={() => {
                                    setSelectedMaritalStatus(status);
                                    setOpenMaritalStatusPopover(false);
                                  }}
                                  className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${
                                    selectedMaritalStatus === status
                                      ? "bg-blue-50 text-gray-900 font-semibold border-l-3 border-blue-500"
                                      : "text-gray-700 hover:bg-blue-50 border-l-3 border-transparent"
                                  }`}
                                >
                                  <span>{status}</span>
                                  {selectedMaritalStatus === status && (
                                    <span className="text-blue-600 font-bold">✓</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Anniversary</label>
                        <Popover open={openAnniversaryPopover} onOpenChange={setOpenAnniversaryPopover}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full mt-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all flex items-center justify-between"
                            >
                              <span className="text-gray-900">
                                {selectedAnniversary ? format(selectedAnniversary, "dd MMM, yyyy") : "Select Date"}
                              </span>
                              <ChevronDown className="h-5 w-5 text-gray-600 flex-shrink-0" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-50" align="start">
                            <AdvancedDatePicker
                              selected={selectedAnniversary || undefined}
                              onSelect={(date) => {
                                setSelectedAnniversary(date);
                                setOpenAnniversaryPopover(false);
                              }}
                              maxDate={new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* State and District */}
                    {selectedNationality === "India" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">State</label>
                          <Popover open={openStatePopover} onOpenChange={(open) => {
                            setOpenStatePopover(open);
                            if (!open) setStateSearch("");
                          }}>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                className="w-full mt-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all flex items-center justify-between"
                              >
                                <span>{selectedState || "Select State"}</span>
                                <ChevronDown className="h-5 w-5 text-gray-600 flex-shrink-0" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-50" align="start">
                              <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-lg">
                                <div className="sticky top-0 z-10 p-4 border-b border-gray-200 bg-white">
                                  <div className="relative">
                                    <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
                                    <input
                                      type="text"
                                      placeholder="Search states..."
                                      value={stateSearch}
                                      onChange={(e) => setStateSearch(e.target.value)}
                                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                                      autoFocus
                                    />
                                  </div>
                                </div>
                                <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                  {statesAndDistricts.states
                                    .filter((s) => s.state.toLowerCase().includes(stateSearch.toLowerCase()))
                                    .length > 0 ? (
                                    statesAndDistricts.states
                                      .filter((s) => s.state.toLowerCase().includes(stateSearch.toLowerCase()))
                                      .map((state) => (
                                        <button
                                          key={state.state}
                                          type="button"
                                          onClick={() => {
                                            setSelectedState(state.state);
                                            setSelectedDistrict("");
                                            setOpenStatePopover(false);
                                            setStateSearch("");
                                          }}
                                          className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between group ${
                                            selectedState === state.state
                                              ? "bg-blue-50 text-gray-900 font-semibold border-l-3 border-blue-500"
                                              : "text-gray-700 hover:bg-blue-50 border-l-3 border-transparent"
                                          }`}
                                        >
                                          <span>{state.state}</span>
                                          {selectedState === state.state && (
                                            <span className="text-blue-600 font-bold">✓</span>
                                          )}
                                        </button>
                                      ))
                                  ) : (
                                    <div className="px-4 py-8 text-sm text-gray-500 text-center">No states found</div>
                                  )}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">District</label>
                          <Popover open={openDistrictPopover} onOpenChange={(open) => {
                            setOpenDistrictPopover(open);
                            if (!open) setDistrictSearch("");
                          }}>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                disabled={!selectedState}
                                className="w-full mt-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:hover:bg-gray-100 flex items-center justify-between"
                              >
                                <span>{selectedDistrict || "Select District"}</span>
                                <ChevronDown className="h-5 w-5 text-gray-600 flex-shrink-0" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-50" align="start">
                              <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-lg">
                                <div className="sticky top-0 z-10 p-4 border-b border-gray-200 bg-white">
                                  <div className="relative">
                                    <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
                                    <input
                                      type="text"
                                      placeholder="Search districts..."
                                      value={districtSearch}
                                      onChange={(e) => setDistrictSearch(e.target.value)}
                                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                                      autoFocus
                                    />
                                  </div>
                                </div>
                                <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                  {selectedState && statesAndDistricts.states
                                    .find((s) => s.state === selectedState)
                                    ?.districts
                                    .filter((d) => d.toLowerCase().includes(districtSearch.toLowerCase()))
                                    .length! > 0 ? (
                                    statesAndDistricts.states
                                      .find((s) => s.state === selectedState)
                                      ?.districts
                                      .filter((d) => d.toLowerCase().includes(districtSearch.toLowerCase()))
                                      .map((district) => (
                                        <button
                                          key={district}
                                          type="button"
                                          onClick={() => {
                                            setSelectedDistrict(district);
                                            setOpenDistrictPopover(false);
                                            setDistrictSearch("");
                                          }}
                                          className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between group ${
                                            selectedDistrict === district
                                              ? "bg-blue-50 text-gray-900 font-semibold border-l-3 border-blue-500"
                                              : "text-gray-700 hover:bg-blue-50 border-l-3 border-transparent"
                                          }`}
                                        >
                                          <span>{district}</span>
                                          {selectedDistrict === district && (
                                            <span className="text-blue-600 font-bold">✓</span>
                                          )}
                                        </button>
                                      ))
                                  ) : (
                                    <div className="px-4 py-8 text-sm text-gray-500 text-center">No districts found</div>
                                  )}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">State</label>
                          <Input
                            type="text"
                            placeholder="Enter state or province"
                            className="w-full mt-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all h-auto"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">District</label>
                          <Input
                            type="text"
                            placeholder="Enter district or city"
                            className="w-full mt-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all h-auto"
                          />
                        </div>
                      </div>
                    )}

                    {/* Member Since */}
                    <div className="border-t pt-6">
                      <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Member Since</label>
                      <p className="text-lg font-semibold text-gray-900 mt-2">
                        {user?.signupDate && !isNaN(new Date(user.signupDate).getTime())
                          ? format(new Date(user.signupDate), "MMMM dd, yyyy")
                          : "—"}
                      </p>
                    </div>

                  </div>
                </CardContent>
              </Card>

              {/* Contact Details Card */}
              <Card className="border-0 shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle>Contact Details</CardTitle>
                  <CardDescription>Add contact information to receive booking details & other alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Mobile Number */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Mobile Number</label>
                        {!phoneIsMissing && (
                          <span className="text-green-600 text-sm">✓</span>
                        )}
                      </div>
                      {!isPhoneEditing ? (
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold text-gray-900">{displayPhoneNumber}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={openPhoneEditor}
                            className="text-gray-600"
                          >
                            Edit
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex flex-col gap-3 sm:flex-row">
                            <Popover
                              open={openPhoneCountryPopover}
                              onOpenChange={(open) => {
                                setOpenPhoneCountryPopover(open);
                                if (!open) setPhoneCountrySearch("");
                              }}
                            >
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  className="h-10 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-gray-100 transition-all flex items-center gap-2 min-w-fit focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                  <span className="text-sm font-medium">{selectedPhoneCountry.dial}</span>
                                  <ChevronDown className="h-4 w-4 text-gray-600" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64 p-0" align="start">
                                <div className="flex flex-col">
                                  <div className="sticky top-0 z-10 p-3 border-b border-gray-200 bg-white">
                                    <div className="relative">
                                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
                                      <input
                                        type="text"
                                        placeholder="Search country..."
                                        value={phoneCountrySearch}
                                        onChange={(e) => setPhoneCountrySearch(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50"
                                        autoFocus
                                      />
                                    </div>
                                  </div>
                                  <div className="max-h-64 overflow-y-auto" onWheel={(e) => e.stopPropagation()}>
                                    {filteredPhoneCountries.length > 0 ? (
                                      filteredPhoneCountries.map((country) => (
                                        <button
                                          key={country.code}
                                          type="button"
                                          onClick={() => {
                                            setSelectedPhoneCountry(country);
                                            setOpenPhoneCountryPopover(false);
                                            setPhoneCountrySearch("");
                                          }}
                                          className={`w-full text-left px-3 py-2.5 text-sm hover:bg-blue-50 transition-colors flex items-center justify-between ${
                                            selectedPhoneCountry.code === country.code ? "bg-blue-100 font-semibold" : ""
                                          }`}
                                        >
                                          <span>
                                            <span className="font-medium">{country.dial}</span>
                                            <span className="text-gray-600 ml-2">{country.name}</span>
                                          </span>
                                          {selectedPhoneCountry.code === country.code && <span className="text-blue-600">✓</span>}
                                        </button>
                                      ))
                                    ) : (
                                      <div className="px-3 py-8 text-sm text-gray-500 text-center">No countries found</div>
                                    )}
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>

                            <Input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => {
                                const digitsOnly = e.target.value.replace(/\D/g, "");
                                const maxDigits = COUNTRY_DIGIT_REQUIREMENTS[selectedPhoneCountry.code]?.max || 15;
                                const truncated = digitsOnly.slice(0, maxDigits);
                                setPhoneNumber(truncated);
                              }}
                              placeholder="Enter phone number"
                              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all h-auto"
                            />
                          </div>

                          <div className="flex flex-col gap-2 sm:flex-row">
                            <Button onClick={handleSavePhone} disabled={isSavingPhone} className="w-full sm:w-auto">
                              {isSavingPhone ? "Saving..." : "Save"}
                            </Button>
                            <Button variant="outline" onClick={closePhoneEditor} disabled={isSavingPhone} className="w-full sm:w-auto">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Email Address */}
                    <div className="border-t pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Email Address</label>
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 mt-2">{user?.email || "—"}</p>
                      <p className="text-xs text-gray-500 mt-2">Cannot be changed after signup</p>
                    </div>

                    {/* Add Email ID */}
                    <div>
                      <Button variant="link" className="text-blue-600 p-0">
                        + ADD EMAIL ID
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Details Card */}
              <Card className="border-0 shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle>Documents Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Passport No. and Expiry Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Passport No.</label>
                        <Input
                          type="text"
                          placeholder="Enter passport number"
                          value={passportNumber}
                          onChange={(e) => setPassportNumber(e.target.value)}
                          className="mt-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all h-auto"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Expiry Date</label>
                        <Popover open={openExpiryDatePopover} onOpenChange={setOpenExpiryDatePopover}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full mt-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all flex items-center justify-between"
                            >
                              <span className="text-gray-900">
                                {selectedExpiryDate ? format(selectedExpiryDate, "dd MMM, yyyy") : "Select Date"}
                              </span>
                              <ChevronDown className="h-5 w-5 text-gray-600 flex-shrink-0" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-50" align="start">
                            <AdvancedDatePicker
                              selected={selectedExpiryDate || undefined}
                              onSelect={(date) => {
                                setSelectedExpiryDate(date);
                                setOpenExpiryDatePopover(false);
                              }}
                              minDate={new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Issuing Country and PAN Card Number */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Issuing Country</label>
                        <Popover open={openCountryPopover} onOpenChange={(open) => {
                          setOpenCountryPopover(open);
                          if (!open) setCountrySearch("");
                        }}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full mt-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all flex items-center justify-between"
                            >
                              <span>{selectedCountry || "Select Country"}</span>
                              <ChevronDown className="h-5 w-5 text-gray-600 flex-shrink-0" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-50" align="start">
                            <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-lg">
                              <div className="sticky top-0 z-10 p-4 border-b border-gray-200 bg-white">
                                <div className="relative">
                                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
                                  <input
                                    type="text"
                                    placeholder="Search countries..."
                                    value={countrySearch}
                                    onChange={(e) => setCountrySearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                                    autoFocus
                                  />
                                </div>
                              </div>
                              <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                {countries
                                  .filter((c) => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
                                  .length > 0 ? (
                                  countries
                                    .filter((c) => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
                                    .map((country) => (
                                      <button
                                        key={country.code}
                                        type="button"
                                        onClick={() => {
                                          setSelectedCountry(country.name);
                                          setOpenCountryPopover(false);
                                          setCountrySearch("");
                                        }}
                                        className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between group ${
                                          selectedCountry === country.name
                                            ? "bg-blue-50 text-gray-900 font-semibold border-l-3 border-blue-500"
                                            : "text-gray-700 hover:bg-blue-50 border-l-3 border-transparent"
                                        }`}
                                      >
                                        <span>{country.name}</span>
                                        {selectedCountry === country.name && (
                                          <span className="text-blue-600 font-bold">✓</span>
                                        )}
                                      </button>
                                    ))
                                ) : (
                                  <div className="px-4 py-8 text-sm text-gray-500 text-center">No countries found</div>
                                )}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">PAN Card Number</label>
                        <Input
                          type="text"
                          placeholder="Enter PAN card number"
                          value={panCardNumber}
                          onChange={(e) => setPanCardNumber(e.target.value)}
                          className="mt-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all h-auto"
                        />
                      </div>
                    </div>

                    {/* Aadhaar Card Number */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Aadhaar Card No.</label>
                        <Input
                          type="text"
                          placeholder="Enter Aadhaar card number"
                          value={aadhaarCardNumber}
                          onChange={(e) => setAadhaarCardNumber(e.target.value)}
                          className="mt-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all h-auto"
                        />
                      </div>
                    </div>

                    {/* Document Rows */}
                    {documents.length > 0 && (
                      <div className="space-y-4 pt-6 border-t">
                        {documents.map((doc) => (
                          <div key={doc.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            {/* Document Type Dropdown */}
                            <div>
                              <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Document Type</label>
                              <Popover
                                open={openDocTypePopovers[doc.id] || false}
                                onOpenChange={(open) => {
                                  setOpenDocTypePopovers({...openDocTypePopovers, [doc.id]: open});
                                  if (!open) setDocTypeSearches({...docTypeSearches, [doc.id]: ""});
                                }}
                              >
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className="w-full mt-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all flex items-center justify-between"
                                  >
                                    <span>{doc.type || "Select Type"}</span>
                                    <ChevronDown className="h-5 w-5 text-gray-600 flex-shrink-0" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-50" align="start">
                                  <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-lg">
                                    <div className="sticky top-0 z-10 p-4 border-b border-gray-200 bg-white">
                                      <div className="relative">
                                        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
                                        <input
                                          type="text"
                                          placeholder="Search documents..."
                                          value={docTypeSearches[doc.id] || ""}
                                          onChange={(e) => setDocTypeSearches({...docTypeSearches, [doc.id]: e.target.value})}
                                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                                        />
                                      </div>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                      {documentTypes
                                        .filter((t) => t.toLowerCase().includes((docTypeSearches[doc.id] || "").toLowerCase()))
                                        .length > 0 ? (
                                        documentTypes
                                          .filter((t) => {
                                            // Filter by search term AND exclude already selected types
                                            const matchesSearch = t.toLowerCase().includes((docTypeSearches[doc.id] || "").toLowerCase());
                                            const alreadySelected = documents.some(d => d.id !== doc.id && d.type === t);
                                            return matchesSearch && !alreadySelected;
                                          })
                                          .map((type) => (
                                            <button
                                              key={type}
                                              type="button"
                                              onClick={() => {
                                                setDocuments(documents.map(d => d.id === doc.id ? {...d, type} : d));
                                                setOpenDocTypePopovers({...openDocTypePopovers, [doc.id]: false});
                                                setDocTypeSearches({...docTypeSearches, [doc.id]: ""});
                                              }}
                                              className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between group ${
                                                doc.type === type
                                                  ? "bg-blue-50 text-gray-900 font-semibold border-l-3 border-blue-500"
                                                  : "text-gray-700 hover:bg-blue-50 border-l-3 border-transparent"
                                              }`}
                                            >
                                              <span>{type}</span>
                                              {doc.type === type && (
                                                <span className="text-blue-600 font-bold">✓</span>
                                              )}
                                            </button>
                                          ))
                                      ) : (
                                        <div className="px-4 py-8 text-sm text-gray-500 text-center">No documents found</div>
                                      )}
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>

                            {/* Document Number Input */}
                            <div>
                              <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Document Number</label>
                              <Input
                                type="text"
                                placeholder="Enter document number"
                                value={doc.number}
                                onChange={(e) => setDocuments(documents.map(d => d.id === doc.id ? {...d, number: e.target.value} : d))}
                                className="w-full mt-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all h-auto"
                              />
                            </div>

                            {/* Delete Button */}
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => setDocuments(documents.filter(d => d.id !== doc.id))}
                                className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete document"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Document Button */}
                    <div>
                      <Button
                        variant="link"
                        disabled={documents.length >= 2}
                        className={`p-0 ${
                          documents.length >= 2
                            ? "text-gray-400 cursor-not-allowed opacity-20"
                            : "text-blue-600"
                        }`}
                        onClick={() => {
                          if (documents.length < 2) {
                            const newDoc = {
                              id: Date.now().toString(),
                              type: "",
                              number: ""
                            };
                            setDocuments([...documents, newDoc]);
                          }
                        }}
                      >
                        + ADD DOCUMENT
                      </Button>
                    </div>

                    {/* Note */}
                    <div className="text-[13px] leading-5">
                      <span className="font-semibold text-orange-600">NOTE:</span>{" "}
                      <span className="text-slate-900">For Indian customers, PAN No. will only be used for international bookings as per RBI Guidelines</span>
                    </div>

                    {/* Save Documents Button */}
                    <div className="border-t pt-6">
                      <Button
                        onClick={handleSaveDocuments}
                        disabled={isSavingDocuments}
                        className="bg-gray-700 hover:bg-gray-800 text-white"
                      >
                        {isSavingDocuments ? "Saving..." : "SAVE DOCUMENTS"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          ) : activeNav === "settings" ? (
            <>
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
            </>
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
