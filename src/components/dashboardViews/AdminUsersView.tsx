import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  MoreHorizontal,
  Trash2,
  Lock,
  Power,
  PowerOff,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  suspendUser,
  unsuspendUser,
  deleteUser,
  resetUserPassword,
} from "@/lib/api";
import { format } from "date-fns";
import * as XLSX from "xlsx";

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

interface AdminUsersViewProps {
  users: User[];
  onDataChange: () => void;
}

export function AdminUsersView({ users, onDataChange }: AdminUsersViewProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [suspendConfirmId, setSuspendConfirmId] = useState<number | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);

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

  const handleExportUsers = () => {
    const exportData = users.map((user) => ({
      "Full Name": user.fullName,
      Email: user.email,
      "Phone Number": `+${user.countryCode} ${user.mobileNumber}`,
      Role: user.role,
      Status: user.isSuspended ? "Suspended" : "Active",
      "Signup Date": format(new Date(user.signupDate), "MMM dd, yyyy"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, `users_${format(new Date(), "yyyy-MM-dd")}.xlsx`);

    toast({ title: "Success", description: "User data exported to Excel" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">User Management</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage all registered travelers and their accounts
          </p>
        </div>
        <Button onClick={handleExportUsers} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export to Excel
        </Button>
      </div>

      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle>All Travelers</CardTitle>
          <CardDescription>
            Total: {users.length} users | Active: {users.filter((u) => !u.isSuspended).length} |
            Suspended: {users.filter((u) => u.isSuspended).length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-gray-900">
                      {user.fullName}
                    </TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell className="text-gray-600">
                      +{user.countryCode} {user.mobileNumber}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isSuspended ? "secondary" : "default"}
                        className={user.isSuspended ? "bg-red-100 text-red-800" : ""}
                      >
                        {user.isSuspended ? "Suspended" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {format(new Date(user.signupDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
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
                                Unsuspend User
                              </>
                            ) : (
                              <>
                                <Power className="w-4 h-4" />
                                Suspend User
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteConfirmId(user.id)}
                            className="flex items-center gap-2 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
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
              This action cannot be undone. The user account and all associated data (bookings, reviews) will be permanently deleted.
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
                ? "Unsuspend User"
                : "Suspend User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {users.find((u) => u.id === suspendConfirmId)?.isSuspended
                ? "The user will be able to login again."
                : "The user will not be able to login until unsuspended. They will see: 'Your account has been suspended. Please contact admin.'"}
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
