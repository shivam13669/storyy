import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserDetailsModal } from "@/components/UserDetailsModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { AdminResetPasswordModal } from "@/components/AdminResetPasswordModal";
import {
  Search,
  MoreVertical,
  Lock,
  Power,
  PowerOff,
  Trash2,
  RefreshCw,
  Eye,
  Download,
  Filter,
  Mail,
  Phone,
} from "lucide-react";
import { format } from "date-fns";
import { suspendUser, unsuspendUser, deleteUser, resetUserPassword } from "@/lib/api";

interface User {
  id: number;
  fullName: string;
  email: string;
  mobileNumber: string;
  countryCode: string;
  role: string;
  signupDate: string;
  isSuspended: boolean;
}

interface UserManagementSystemViewProps {
  users: User[];
  onDataChange: () => void;
}

export function UserManagementSystemView({ users, onDataChange }: UserManagementSystemViewProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [suspendConfirmId, setSuspendConfirmId] = useState<number | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleRefresh = async () => {
    setRefreshLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onDataChange();
      toast({ title: "Success", description: "Data refreshed successfully" });
    } finally {
      setRefreshLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    setLoading(true);
    try {
      await deleteUser(userId);
      toast({ title: "Success", description: "User deleted successfully" });
      onDataChange();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
      });
    } finally {
      setLoading(false);
      setDeleteConfirmId(null);
    }
  };

  const handleToggleSuspend = async (userId: number, isSuspended: boolean) => {
    setLoading(true);
    try {
      if (isSuspended) {
        await unsuspendUser(userId);
        toast({ title: "Success", description: "User unsuspended" });
      } else {
        await suspendUser(userId);
        toast({ title: "Success", description: "User suspended" });
      }
      onDataChange();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user",
      });
    } finally {
      setLoading(false);
      setSuspendConfirmId(null);
    }
  };

  const handleResetPassword = async (newPassword: string, confirmPassword: string) => {
    if (!resetPasswordUser) return;
    try {
      await resetUserPassword(resetPasswordUser.id, newPassword);
      toast({ title: "Success", description: "Password reset successfully" });
      setResetPasswordUser(null);
    } catch (error) {
      throw error;
    }
  };

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
      ["Name", "Email", "Phone", "Role", "Status", "Joined Date"],
      ...filteredUsers.map((user) => {
        const date = new Date(user.signupDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${day}/${month}/${year}`; // DD/MM/YYYY format: 09/02/2026

        return [
          user.fullName,
          user.email,
          `+${getNumericCountryCode(user.countryCode)} ${user.mobileNumber}`,
          user.role === "admin" ? "Admin" : "Customer",
          user.isSuspended ? "Suspended" : "Active",
          formattedDate,
        ];
      }),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">User Management</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage and view all registered users in your system
          </p>
        </div>
        <Button onClick={handleExportList} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export List
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <span className="text-2xl font-bold text-blue-600">👥</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role !== "admin").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <span className="text-2xl font-bold text-green-600">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role !== "admin" && !u.isSuspended).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-xl">
                <span className="text-2xl font-bold text-orange-600">⛔</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role !== "admin" && u.isSuspended).length}</p>
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
                placeholder="Search by name, email, phone..."
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

      {/* Users List - Table Format */}
      <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle>Users List</CardTitle>
          <CardDescription>Complete list of registered users</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">User</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Role</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Joined</th>
                    <th className="px-6 py-4 text-right font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      {/* User Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase ${getAvatarColor(user.id)}`}
                          >
                            {getInitials(user.fullName)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.fullName}</p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-600">+{getNumericCountryCode(user.countryCode)} {user.mobileNumber}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Column */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-700">
                          {user.role === "admin" ? "Admin" : "Customer"}
                        </span>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.isSuspended
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.isSuspended ? "Suspended" : "Active"}
                        </span>
                      </td>

                      {/* Joined Column */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          <p className="font-medium">{format(new Date(user.signupDate), "dd/MM/yyyy")}</p>
                          <p className="text-xs text-gray-600">{format(new Date(user.signupDate), "h:mm a")}</p>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setResetPasswordUser(user)}>
                              <Lock className="w-4 h-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSuspendConfirmId(user.id)}>
                              {user.isSuspended ? (
                                <>
                                  <PowerOff className="w-4 h-4 mr-2" />
                                  Reactivate User
                                </>
                              ) : (
                                <>
                                  <Power className="w-4 h-4 mr-2" />
                                  Suspend User
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirmId(user.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              <p>No users found matching your search</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The user account will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteConfirmId && handleDeleteUser(deleteConfirmId)}
            className="bg-red-600 hover:bg-red-700"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspend Confirmation */}
      <AlertDialog open={suspendConfirmId !== null} onOpenChange={() => setSuspendConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {users.find((u) => u.id === suspendConfirmId)?.isSuspended
                ? "Reactivate User"
                : "Suspend User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {users.find((u) => u.id === suspendConfirmId)?.isSuspended
                ? "The user will be able to login again."
                : "The user will not be able to login. They will see: 'Your account has been suspended.'"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              const user = users.find((u) => u.id === suspendConfirmId);
              if (user && suspendConfirmId) {
                handleToggleSuspend(suspendConfirmId, user.isSuspended);
              }
            }}
            disabled={loading}
          >
            {loading ? "Updating..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Modal */}
      {resetPasswordUser && (
        <AdminResetPasswordModal
          isOpen={!!resetPasswordUser}
          onClose={() => setResetPasswordUser(null)}
          userName={resetPasswordUser.fullName}
          onSubmit={handleResetPassword}
        />
      )}

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isDetailsModalOpen}
        user={selectedUser}
        onClose={() => setIsDetailsModalOpen(false)}
        onDataChange={onDataChange}
      />
    </div>
  );
}
