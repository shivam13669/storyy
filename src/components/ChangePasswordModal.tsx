import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (oldPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
}

const validatePassword = (password: string) => {
  const requirements = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const isValid = Object.values(requirements).every(req => req);
  return { isValid, requirements };
};

export function ChangePasswordModal({
  isOpen,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Refs for password inputs to preserve cursor position
  const oldPasswordInputRef = useRef<HTMLInputElement>(null);
  const newPasswordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  // Helper function to toggle password visibility while preserving cursor position
  const togglePasswordVisibility = (
    setter: (value: boolean) => void,
    currentValue: boolean,
    inputRef: React.RefObject<HTMLInputElement>
  ) => {
    if (inputRef.current) {
      const cursorPosition = inputRef.current.selectionStart || 0;
      setter(!currentValue);
      // Restore cursor position after state update
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
          inputRef.current.focus();
        }
      }, 0);
    } else {
      setter(!currentValue);
    }
  };

  const passwordValidation = validatePassword(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!oldPassword.trim()) {
      setError("Old password is required");
      return;
    }

    if (!newPassword.trim()) {
      setError("New password is required");
      return;
    }

    if (!passwordValidation.isValid) {
      setError("Password does not meet requirements");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (oldPassword === newPassword) {
      setError("New password must be different from old password");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(oldPassword, newPassword, confirmPassword);
      setSuccess(true);
      setTimeout(() => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" hideCloseButton>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and your new password
          </DialogDescription>
        </DialogHeader>

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Password changed successfully!
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2" onMouseDown={(e) => {
            if (e.target.closest('button')) return;
            setIsNewPasswordFocused(false);
          }}>
            <Label htmlFor="oldPassword">Old Password</Label>
            <div className="relative">
              <Input
                ref={oldPasswordInputRef}
                id="oldPassword"
                type={showOldPassword ? "text" : "password"}
                placeholder="Enter your current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  togglePasswordVisibility(setShowOldPassword, showOldPassword, oldPasswordInputRef);
                }}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                {showOldPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                ref={newPasswordInputRef}
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password (minimum 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setIsNewPasswordFocused(true)}
                onBlur={() => setIsNewPasswordFocused(false)}
                disabled={loading}
              />
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  togglePasswordVisibility(setShowNewPassword, showNewPassword, newPasswordInputRef);
                }}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {newPassword && isNewPasswordFocused && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
                <p className="text-xs font-semibold text-gray-900">Password Requirements:</p>
                <div className="space-y-1.5 text-xs">
                  <div className={`flex items-center gap-2 ${passwordValidation.requirements.length ? 'text-green-600' : 'text-gray-600'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.requirements.length ? 'bg-green-100' : 'bg-gray-200'}`}>
                      {passwordValidation.requirements.length && <span className="text-green-600 font-bold">✓</span>}
                    </div>
                    <span>At least 6 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.requirements.uppercase ? 'text-green-600' : 'text-gray-600'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.requirements.uppercase ? 'bg-green-100' : 'bg-gray-200'}`}>
                      {passwordValidation.requirements.uppercase && <span className="text-green-600 font-bold">✓</span>}
                    </div>
                    <span>At least 1 uppercase letter (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.requirements.lowercase ? 'text-green-600' : 'text-gray-600'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.requirements.lowercase ? 'bg-green-100' : 'bg-gray-200'}`}>
                      {passwordValidation.requirements.lowercase && <span className="text-green-600 font-bold">✓</span>}
                    </div>
                    <span>At least 1 lowercase letter (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.requirements.number ? 'text-green-600' : 'text-gray-600'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.requirements.number ? 'bg-green-100' : 'bg-gray-200'}`}>
                      {passwordValidation.requirements.number && <span className="text-green-600 font-bold">✓</span>}
                    </div>
                    <span>At least 1 number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.requirements.special ? 'text-green-600' : 'text-gray-600'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.requirements.special ? 'bg-green-100' : 'bg-gray-200'}`}>
                      {passwordValidation.requirements.special && <span className="text-green-600 font-bold">✓</span>}
                    </div>
                    <span>At least 1 special character (!@#$%^&*)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2" onMouseDown={(e) => {
            if (e.target.closest('button')) return;
            setIsNewPasswordFocused(false);
          }}>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                ref={confirmPasswordInputRef}
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  togglePasswordVisibility(setShowConfirmPassword, showConfirmPassword, confirmPasswordInputRef);
                }}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading || success}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || success}>
              {loading ? "Updating..." : "Change Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
