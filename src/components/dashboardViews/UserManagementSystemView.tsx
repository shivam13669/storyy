import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserDetailsModal } from "@/components/UserDetailsModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    return name
      .split(" ")
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

  const getRoleBadgeStyle = (role: string) => {
    if (role === "admin") return "bg-purple-100 text-purple-800";
    if (role === "user") return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (isSuspended: boolean) => {
    return isSuspended ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800";
  };

  // Calculate metrics
  const totalDoctors = users.filter((u) => u.role === "admin").length; // Treating admin as doctors
  const totalCustomers = users.filter((u) => u.role === "user").length;
  const totalStaff = 0; // Can be expanded
  const suspendedCount = users.filter((u) => u.isSuspended).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">User Management</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage user accounts - suspend, reactivate or delete users
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <span className="text-2xl font-bold text-blue-600">👨‍⚕️</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{totalDoctors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <span className="text-2xl font-bold text-green-600">👥</span>
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
              <div className="bg-orange-100 p-3 rounded-xl">
                <span className="text-2xl font-bold text-orange-600">👔</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{totalStaff}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-3 rounded-xl">
                <span className="text-2xl font-bold text-red-600">⛔</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-gray-900">{suspendedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by name, email, or username..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* User Directory Table */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>Search and filter users, manage their account status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getAvatarColor(user.id)}`}
                          >
                            {getInitials(user.fullName)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.fullName}</p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeStyle(user.role)}>
                          {user.role === "admin" ? "Hospital" : "Customer"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.isSuspended)}>
                          {user.isSuspended ? "Suspended" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {format(new Date(user.signupDate), "MM/dd/yyyy hh:mm a")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => setResetPasswordUser(user)}
                              className="flex items-center gap-2"
                            >
                              <Lock className="w-4 h-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setSuspendConfirmId(user.id)}
                              className="flex items-center gap-2"
                            >
                              {user.isSuspended ? (
                                <>
                                  <PowerOff className="w-4 h-4" />
                                  Reactivate
                                </>
                              ) : (
                                <>
                                  <Power className="w-4 h-4" />
                                  Suspend
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirmId(user.id)}
                              className="flex items-center gap-2 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-600">
                      No users found matching your search
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
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
    </div>
  );
}
