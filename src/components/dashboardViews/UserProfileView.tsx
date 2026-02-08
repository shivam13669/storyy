import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Edit2, X } from "lucide-react";
import { format } from "date-fns";

interface User {
  id: number;
  fullName: string;
  email: string;
  mobileNumber: string;
  countryCode: string;
  signupDate: string;
}

interface UserProfileViewProps {
  user: User;
  onUserUpdate?: (updatedUser: User) => void;
  onChangePassword?: () => void;
}

export function UserProfileView({ user, onUserUpdate, onChangePassword }: UserProfileViewProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSaveChanges = async () => {
    setError("");
    setSuccess(false);

    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (fullName === user.fullName) {
      setError("No changes made");
      return;
    }

    setLoading(true);
    try {
      // Update user profile
      // Note: In a real app, this would call an API endpoint to update the user
      // For now, we'll simulate the update
      const updatedUser = { ...user, fullName };
      
      // Call the update callback if provided
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      setSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
        setSuccess(false);
        toast({ title: "Success", description: "Profile updated successfully" });
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFullName(user.fullName);
    setError("");
    setSuccess(false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">My Profile</h3>
        <p className="text-sm text-gray-600 mt-1">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Profile Info Card */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Profile updated successfully!
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-2"
                  disabled={loading}
                />
              ) : (
                <p className="mt-2 text-lg font-semibold text-gray-900">{user.fullName}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                This name appears on your account and trip bookings. The first letter will update in your avatar after you logout and login again.
              </p>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <p className="mt-2 text-lg font-semibold text-gray-900">{user.email}</p>
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed after signup
              </p>
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                +{user.countryCode} {user.mobileNumber}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Phone number cannot be changed after signup
              </p>
            </div>

            {/* Member Since */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Member Since</Label>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {format(new Date(user.signupDate), "MMMM dd, yyyy")}
              </p>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage your password and security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Your account security is important to us. You can change your password at any time.
            </p>
            <Button className="w-full">Change Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
