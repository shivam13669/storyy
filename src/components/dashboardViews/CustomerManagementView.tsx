import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Download, Filter, Search, Mail, Phone } from "lucide-react";
import { format } from "date-fns";

interface User {
  id: number;
  fullName: string;
  email: string;
  mobileNumber: string;
  countryCode: string;
  signupDate: string;
  isSuspended: boolean;
}

interface CustomerManagementViewProps {
  users: User[];
  onDataChange: () => void;
}

export function CustomerManagementView({ users, onDataChange }: CustomerManagementViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.mobileNumber.includes(query)
    );
    setFilteredUsers(filtered);
  };

  // Calculate metrics
  const totalCustomers = users.length;
  const maleCustomers = Math.round(users.length * 0.45); // Mock data
  const femaleCustomers = Math.round(users.length * 0.55); // Mock data
  const thisMonth = users.filter(
    (u) => new Date(u.signupDate).getMonth() === new Date().getMonth()
  ).length;

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length === 1) {
      // Single name: take first 2 letters
      return name.substring(0, 2).toUpperCase();
    }
    // Multiple names: take first letter of each
    return parts
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (id: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-cyan-500",
    ];
    return colors[id % colors.length];
  };

  const getNumericCountryCode = (code: string) => {
    const countryCodeMap: { [key: string]: string } = {
      "IN": "91",
      "US": "1",
      "UK": "44",
      "CA": "1",
      "AU": "61",
      "DE": "49",
      "FR": "33",
      "JP": "81",
      "CN": "86",
      "BR": "55",
    };
    return countryCodeMap[code] || code;
  };

  const handleExportList = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Joined Date"],
      ...filteredUsers.map((user) => [
        user.fullName,
        user.email,
        `+${getNumericCountryCode(user.countryCode)} ${user.mobileNumber}`,
        format(new Date(user.signupDate), "MMM dd, yyyy"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Customer Management</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage and view all registered customers in your healthcare system
          </p>
        </div>
        <Button onClick={handleExportList} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export List
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <span className="text-2xl font-bold text-blue-600">👥</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <span className="text-2xl font-bold text-green-600">👨</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Male Customers</p>
                <p className="text-2xl font-bold text-gray-900">{maleCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-pink-100 p-3 rounded-xl">
                <span className="text-2xl font-bold text-pink-600">👩</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Female Customers</p>
                <p className="text-2xl font-bold text-gray-900">{femaleCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-xl">
                <span className="text-2xl font-bold text-orange-600">📅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{thisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border border-gray-200 shadow-lg rounded-2xl bg-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, phone, or blood group..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle>Customers List</CardTitle>
          <CardDescription>Complete list of registered customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase ${getAvatarColor(user.id)}`}
                    >
                      {getInitials(user.fullName)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{user.fullName}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" /> {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" /> +{getNumericCountryCode(user.countryCode)} {user.mobileNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Joined: {format(new Date(user.signupDate), "MMM dd, yyyy")}
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-600">
                <p>No customers found matching your search</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
