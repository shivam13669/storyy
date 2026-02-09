import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { suspendUser, unsuspendUser, deleteUser, resetUserPassword } from "@/lib/api";
import { Power, PowerOff, Trash2, Lock, X, User, Mail, Phone } from "lucide-react";
import { format } from "date-fns";

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

interface UserDetailsModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onDataChange: () => void;
}

export function UserDetailsModal({
  isOpen,
  user,
  onClose,
  onDataChange,
}: UserDetailsModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [suspendConfirmId, setSuspendConfirmId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);

  if (!user) return null;

  const handleToggleSuspend = async (isSuspended: boolean) => {
    setLoading(true);
    try {
      if (isSuspended) {
        await unsuspendUser(user.id);
        toast({ title: "Success", description: "User reactivated" });
      } else {
        await suspendUser(user.id);
        toast({ title: "Success", description: "User suspended" });
      }
      onDataChange();
      onClose();
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

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      await deleteUser(user.id);
      toast({ title: "Success", description: "User deleted successfully" });
      onDataChange();
      onClose();
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

  const handleResetPassword = async (newPassword: string, confirmPassword: string) => {
    try {
      await resetUserPassword(user.id, newPassword);
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

  const getCountryDialCode = (countryCode: string) => {
    const dialCodes: { [key: string]: string } = {
      "IN": "91",
      "US": "1",
      "GB": "44",
      "CA": "1",
      "AU": "61",
      "NZ": "64",
      "SG": "65",
      "HK": "852",
    };
    return dialCodes[countryCode] || countryCode;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">User Details</DialogTitle>
            <DialogDescription>Complete information about {user.fullName}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* User Avatar and Header */}
            <div className="flex items-center gap-4 pb-6 border-b">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg ${getAvatarColor(user.id)}`}
              >
                {getInitials(user.fullName)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{user.fullName}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium">{user.fullName}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium">+{getCountryDialCode(user.countryCode)} {user.mobileNumber}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Mail className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-medium">{user.email}</span>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 mb-1">Role</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.role === "admin" ? "Hospital" : "Customer"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <Badge
                  className={
                    user.isSuspended
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }
                >
                  {user.isSuspended ? "Suspended" : "Active"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">User ID</p>
                <p className="text-lg font-semibold text-gray-900">#{user.id}</p>
              </div>
            </div>

            {/* Account Timeline */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Timeline</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Created</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👤</span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {format(new Date(user.signupDate), "MM/dd/yyyy")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(user.signupDate), "hh:mm:ss a")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Updated</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👤</span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {format(new Date(user.signupDate), "MM/dd/yyyy")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(user.signupDate), "hh:mm:ss a")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex items-center gap-2 flex-1"
                onClick={() => setSuspendConfirmId(user.id)}
                disabled={loading}
              >
                {user.isSuspended ? (
                  <>
                    <PowerOff className="w-4 h-4" />
                    Reactivate User
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4" />
                    Suspend User
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                className="flex items-center gap-2 flex-1"
                onClick={() => setDeleteConfirmId(user.id)}
                disabled={loading}
              >
                <Trash2 className="w-4 h-4" />
                Delete User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Suspend Confirmation */}
      <AlertDialog open={suspendConfirmId !== null} onOpenChange={() => setSuspendConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user.isSuspended ? "Reactivate User" : "Suspend User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {user.isSuspended
                ? "The user will be able to login again."
                : "The user will not be able to login. They will see: 'Your account has been suspended.'"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleToggleSuspend(user.isSuspended)}
            disabled={loading}
          >
            {loading ? "Updating..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

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
            onClick={handleDeleteUser}
            className="bg-red-600 hover:bg-red-700"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
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
    </>
  );
}
