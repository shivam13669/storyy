import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle, User, Phone, Search, ChevronDown, X, Loader } from "lucide-react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { toast } from "sonner";
import { signup, sendOTP, verifyOTP, resetPasswordWithEmail, checkDuplicate } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Get first name from full name
function getFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName;
}

const COUNTRIES = [
  { code: "IN", name: "India", dial: "+91" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "IT", name: "Italy", dial: "+39" },
  { code: "ES", name: "Spain", dial: "+34" },
  { code: "JP", name: "Japan", dial: "+81" },
  { code: "CN", name: "China", dial: "+86" },
  { code: "SG", name: "Singapore", dial: "+65" },
  { code: "MY", name: "Malaysia", dial: "+60" },
  { code: "TH", name: "Thailand", dial: "+66" },
  { code: "PH", name: "Philippines", dial: "+63" },
  { code: "ID", name: "Indonesia", dial: "+62" },
  { code: "SL", name: "Sri Lanka", dial: "+94" },
  { code: "NP", name: "Nepal", dial: "+977" },
];

const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
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
};

const validateInternationalMobile = (mobile: string, countryCode: string): boolean => {
  const digitCount = mobile.replace(/\D/g, '').length;
  const requirements = COUNTRY_DIGIT_REQUIREMENTS[countryCode];

  if (!requirements) {
    return false;
  }

  if (digitCount < requirements.min || digitCount > requirements.max) {
    return false;
  }

  try {
    const phoneNumber = parsePhoneNumberFromString(mobile, countryCode as any);
    return phoneNumber ? phoneNumber.isValid() : false;
  } catch {
    return false;
  }
};

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

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { login: authLogin, googleLogin: authGoogleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [countrySearch, setCountrySearch] = useState("");
  const [openCountryPopover, setOpenCountryPopover] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isPasswordFieldFocused, setIsPasswordFieldFocused] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [signupEmailError, setSignupEmailError] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordEmailError, setForgotPasswordEmailError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [signupFormData, setSignupFormData] = useState<any>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [showConfirmResetPassword, setShowConfirmResetPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isPasswordResetOTPVerified, setIsPasswordResetOTPVerified] = useState(false);
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);

  // Refs for password inputs to preserve cursor position
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const signupPasswordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);
  const resetPasswordInputRef = useRef<HTMLInputElement>(null);
  const confirmResetPasswordInputRef = useRef<HTMLInputElement>(null);

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

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.dial.includes(countrySearch) ||
    country.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Reset to login tab and clear all view states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // When modal opens: reset to login tab and clear view states
      setActiveTab('login');
      setShowForgotPassword(false);
      setShowOTPVerification(false);
      setIsPasswordResetOTPVerified(false);
    } else {
      // When modal closes: clear all form data
      setEmail("");
      setPassword("");
      setSignupEmail("");
      setSignupPassword("");
      setConfirmPassword("");
      setFullName("");
      setMobileNumber("");
      setSelectedCountry(COUNTRIES[0]);
      setCountrySearch("");
      setAgreeTerms(false);
      setEmailError("");
      setSignupEmailError("");
      setMobileNumberError("");
      setForgotPasswordEmail("");
      setForgotPasswordEmailError("");
      setOtpCode("");
      setOtpEmail("");
      setSignupFormData(null);
      setResetPassword("");
      setConfirmResetPassword("");
      setShowPassword(false);
      setShowSignupPassword(false);
      setShowConfirmPassword(false);
      setShowResetPassword(false);
      setShowConfirmResetPassword(false);
      setShowOTPVerification(false);
      setIsPasswordResetOTPVerified(false);
      setOpenCountryPopover(false);
    }
  }, [isOpen]);

  const passwordValidation = validatePassword(signupPassword);
  const passwordsMatch = signupPassword && confirmPassword && signupPassword === confirmPassword;
  const isPasswordValid = passwordValidation.isValid && passwordsMatch;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address (e.g., you@example.com)");
      return;
    }

    setIsLoggingIn(true);
    try {
      const result = await authLogin(email, password);

      if (result.success) {
        toast.success("Welcome back!");

        // Reset form and close modal
        setEmail("");
        setPassword("");
        setEmailError("");

        // Close the modal
        onClose();
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      toast.error("Google authentication failed");
      return;
    }

    setIsGoogleLoggingIn(true);
    try {
      const result = await authGoogleLogin(credentialResponse.credential);

      if (result.success) {
        toast.success("Welcome!");

        // Close the modal
        onClose();
      } else {
        toast.error(result.message || 'Google login failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google login failed';
      toast.error(errorMessage);
    } finally {
      setIsGoogleLoggingIn(false);
    }
  };

  const handleGoogleSignup = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      toast.error("Google authentication failed");
      return;
    }

    setIsGoogleLoggingIn(true);
    try {
      const result = await authGoogleLogin(credentialResponse.credential);

      if (result.success) {
        toast.success("Account created successfully!");

        // Close the modal
        onClose();
      } else {
        toast.error(result.message || 'Google signup failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google signup failed';
      toast.error(errorMessage);
    } finally {
      setIsGoogleLoggingIn(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(signupEmail)) {
      setSignupEmailError("Please enter a valid email address (e.g., you@example.com)");
      return;
    }
    if (!validateInternationalMobile(mobileNumber, selectedCountry.code)) {
      setMobileNumberError("Please enter a valid mobile number for the selected country");
      toast.error("Please enter a valid mobile number for the selected country");
      return;
    }
    if (!isPasswordValid) {
      toast.error("Password does not meet requirements");
      return;
    }
    if (!agreeTerms) {
      toast.error("Please agree to terms and conditions");
      return;
    }

    setIsSigningUp(true);
    setIsSendingOTP(true);
    try {
      // Check if email or mobile already exists
      try {
        await checkDuplicate(signupEmail, mobileNumber);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Account verification failed';

        // Handle duplicate email/mobile errors
        if (errorMessage.includes('Email already registered')) {
          setSignupEmailError('Email already registered');
          toast.error('Email already registered');
        } else if (errorMessage.includes('Mobile number already registered')) {
          setMobileNumberError('Mobile number already registered');
          toast.error('Mobile number already registered');
        } else {
          toast.error(errorMessage);
        }
        return;
      }

      const signupFormDataToUse = {
        fullName,
        email: signupEmail,
        password: signupPassword,
        mobileNumber,
        countryCode: selectedCountry.code,
      };

      // Store form data for OTP verification flow
      setSignupFormData(signupFormDataToUse);

      // Send OTP to email (don't create user yet)
      setOtpEmail(signupEmail);
      await sendOTP(signupEmail);

      toast.success("OTP sent to your email!");

      // Show OTP verification screen
      setShowOTPVerification(true);
      setOtpCode("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      toast.error(errorMessage);
    } finally {
      setIsSigningUp(false);
      setIsSendingOTP(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpCode || otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifyingOTP(true);
    try {
      // Verify OTP
      await verifyOTP(otpEmail, otpCode);

      toast.success("OTP verified successfully!");

      // Check if this is password reset or signup
      if (signupFormData?.isPasswordReset) {
        // For password reset: don't proceed yet, user needs to enter new password
        // The form will show password fields now
        // We just verified the OTP, so we continue to the next step
        toast.success("Email verified! Now set your new password.");
        setIsPasswordResetOTPVerified(true);
        // Keep the OTP verification screen visible and show password fields
      } else if (signupFormData) {
        // For signup: create user account after OTP is verified
        await signup(signupFormData);
        toast.success("Account created successfully! Please log in now.");

        // Reset form
        setFullName("");
        setSignupEmail("");
        setSignupPassword("");
        setConfirmPassword("");
        setMobileNumber("");
        setSelectedCountry(COUNTRIES[0]);
        setAgreeTerms(false);
        setSignupEmailError("");
        setMobileNumberError("");
        setShowOTPVerification(false);
        setOtpCode("");
        setOtpEmail("");
        setSignupFormData(null);

        // Switch to login tab
        setActiveTab('login');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'OTP verification failed';
      toast.error(errorMessage);
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (!otpEmail) return;

    setIsSendingOTP(true);
    try {
      const purpose = signupFormData?.isPasswordReset ? 'password-reset' : 'signup';
      await sendOTP(otpEmail, purpose);
      toast.success("OTP resent to your email!");
      setOtpCode("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend OTP';
      toast.error(errorMessage);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetPassword || !confirmResetPassword) {
      toast.error("Please enter both passwords");
      return;
    }

    if (resetPassword !== confirmResetPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const passwordValidation = validatePassword(resetPassword);
    if (!passwordValidation.isValid) {
      toast.error("Password does not meet requirements");
      return;
    }

    setIsResettingPassword(true);
    try {
      // Reset password with email
      await resetPasswordWithEmail(otpEmail, resetPassword);

      toast.success("Password reset successfully! Please log in with your new password.");

      // Reset all forms and close
      setForgotPasswordEmail("");
      setForgotPasswordEmailError("");
      setShowForgotPassword(false);
      setShowOTPVerification(false);
      setOtpCode("");
      setOtpEmail("");
      setSignupFormData(null);
      setResetPassword("");
      setConfirmResetPassword("");

      // Switch back to login tab
      setActiveTab('login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
      toast.error(errorMessage);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleBackToSignup = () => {
    setShowOTPVerification(false);
    setOtpCode("");
    setOtpEmail("");
    setSignupFormData(null);
    setIsPasswordResetOTPVerified(false);
    setResetPassword("");
    setConfirmResetPassword("");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(forgotPasswordEmail)) {
      setForgotPasswordEmailError("Please enter a valid email address (e.g., you@example.com)");
      return;
    }

    setIsSendingOTP(true);
    try {
      // Send OTP for password reset with purpose flag
      await sendOTP(forgotPasswordEmail, 'password-reset');

      toast.success("OTP sent to your email!");

      // Show OTP verification screen for password reset
      setOtpEmail(forgotPasswordEmail);
      // Track that this is for password reset, not signup
      setSignupFormData({ isPasswordReset: true });
      setShowOTPVerification(true);
      setOtpCode("");
      // Reset password fields
      setResetPassword("");
      setConfirmResetPassword("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      toast.error(errorMessage);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setOpenCountryPopover(false);
    setCountrySearch("");
  };

  const returnToLogin = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail("");
    setForgotPasswordEmailError("");
    setShowOTPVerification(false);
    setOtpCode("");
    setOtpEmail("");
    setSignupFormData(null);
    setIsPasswordResetOTPVerified(false);
    setResetPassword("");
    setConfirmResetPassword("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!left-0 !top-auto !bottom-0 !w-full !max-w-none !translate-x-0 !translate-y-0 !h-[78vh] border-0 bg-white p-0 overflow-hidden shadow-2xl max-h-[78vh] rounded-t-[28px] rounded-b-none md:!left-1/2 md:!top-[4rem] md:!bottom-auto md:!h-auto md:!w-[85vw] md:!max-w-[1000px] md:!translate-x-[-50%] md:!translate-y-0 md:max-h-[85vh] md:rounded-lg">
        <DialogTitle className="sr-only">Login or Sign Up</DialogTitle>
        <div className="flex h-full min-h-0 md:min-h-[600px]">
          {/* Left Side - Premium Hero Image */}
          <div className="hidden md:flex md:w-[55%] relative overflow-hidden">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F2ff2ba5fbddf4a3fa883fab429f80a85%2F6fd98a818ae14adaa2b55f761fd41f39?format=webp&width=800"
              alt="Adventure experience"
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 flex flex-col justify-between p-6">
              <div className="text-white">
                <div className="inline-block bg-white/10 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white mb-4">
                  ✨ TRUSTED BY TRAVELERS
                </div>
                <h3 className="text-2xl font-bold leading-tight">
                  Discover Your Next Adventure
                </h3>
              </div>
              
              <div className="space-y-3 text-white/90 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-400" />
                  <span>Experience 20,000+ verified activities</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-400" />
                  <span>1,500+ trusted suppliers worldwide</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-400" />
                  <span>Best price guarantee on every booking</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Premium Form */}
          <div className="w-full md:w-[45%] flex flex-col bg-white overflow-y-auto max-h-[90vh] md:max-h-none">
            {!showForgotPassword ? (
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')} className="w-full flex flex-col h-full">
                {/* Premium Tab Headers */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
                  <TabsList className="w-full rounded-none bg-white p-0 h-auto flex justify-start gap-0">
                    <TabsTrigger
                      value="login"
                      className="flex-1 px-6 py-3.5 rounded-none text-sm font-bold text-gray-600 data-[state=active]:text-gray-900 data-[state=active]:border-b-4 data-[state=active]:border-orange-500 data-[state=active]:bg-gray-50/50 hover:text-gray-900 hover:bg-gray-50/30 transition-colors"
                    >
                      Login
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      className="flex-1 px-6 py-3.5 rounded-none text-sm font-bold text-gray-600 data-[state=active]:text-gray-900 data-[state=active]:border-b-4 data-[state=active]:border-orange-500 data-[state=active]:bg-gray-50/50 hover:text-gray-900 hover:bg-gray-50/30 transition-colors"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Login Tab */}
                <TabsContent value="login" className="mt-0 flex-1 overflow-y-auto">
                  <div className="p-7 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        Welcome Back
                      </h2>
                      <p className="text-sm text-gray-600">
                        Log in to your account and explore amazing experiences
                      </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      {/* Email Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">
                          Email Address
                        </label>
                        <div className="relative group">
                          <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                          <Input
                            type="text"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setEmailError("");
                            }}
                            className={`w-full pl-11 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-gray-50/50 transition-all ${
                              emailError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-orange-500'
                            }`}
                            required
                          />
                        </div>
                        {emailError && (
                          <p className="text-xs text-red-500 font-medium">{emailError}</p>
                        )}
                      </div>

                      {/* Password Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">
                          Password
                        </label>
                        <div className="relative group">
                          <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                          <Input
                            ref={passwordInputRef}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Tab' && !e.shiftKey) {
                                e.preventDefault();
                                const eyeButton = passwordInputRef.current?.parentElement?.querySelector('button');
                                if (eyeButton && eyeButton instanceof HTMLButtonElement) {
                                  eyeButton.focus();
                                }
                              }
                            }}
                            className="w-full pl-11 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50/50 transition-all"
                            required
                          />
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              togglePasswordVisibility(setShowPassword, showPassword, passwordInputRef);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Tab' && !e.shiftKey) {
                                const rememberLabel = e.currentTarget.parentElement?.parentElement?.querySelector('.flex.justify-between');
                                if (rememberLabel instanceof HTMLElement) {
                                  e.preventDefault();
                                  const firstInput = rememberLabel.querySelector('input');
                                  if (firstInput) firstInput.focus();
                                }
                              }
                            }}
                            className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Remember & Forgot */}
                      <div className="flex justify-between items-center pt-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 accent-orange-500 cursor-pointer"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                            Remember me
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>

                      {/* Login Button */}
                      <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full mt-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {isLoggingIn ? "Logging in..." : "Login & Explore"}
                        {!isLoggingIn && <ArrowRight className="h-5 w-5" />}
                      </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center gap-3 py-1">
                      <div className="flex-1 border-t border-gray-200"></div>
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        Or continue with
                      </span>
                      <div className="flex-1 border-t border-gray-200"></div>
                    </div>

                    {/* Google Sign In */}
                    <div className="flex justify-center w-full">
                      <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => toast.error("Google login failed")}
                        text="signin_with"
                        width="360"
                      />
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center pt-2">
                      <p className="text-sm text-gray-700">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab('signup');
                          }}
                          className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                        >
                          Sign up free
                        </button>
                      </p>
                    </div>

                    {/* Trust Section */}
                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                        🏆 Book With Confidence
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-green-50 to-green-50/50 p-3 rounded-lg border border-green-100">
                          <div className="text-lg font-bold text-green-600">4.8</div>
                          <p className="text-xs text-gray-600 mt-1">2.5K+ Reviews</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 p-3 rounded-lg border border-blue-100">
                          <div className="text-lg font-bold text-blue-600">4.6</div>
                          <p className="text-xs text-gray-600 mt-1">15K+ Bookings</p>
                        </div>
                      </div>
                    </div>

                    {/* Terms Text */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                      By continuing, you agree to StoriesByFoot's{" "}
                      <a href="/terms-and-condition" className="text-orange-600 hover:underline">
                        Terms & Conditions
                      </a>
                      {" "}and{" "}
                      <a href="/privacy-policy" className="text-orange-600 hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </TabsContent>

                {/* Sign Up Tab */}
                <TabsContent value="signup" className="mt-0 flex-1 overflow-y-auto">
                  {!showOTPVerification ? (
                  <div className="p-7 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        Create Your Account
                      </h2>
                      <p className="text-sm text-gray-600">
                        Join thousands of travelers and start your adventure today
                      </p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                      {/* Full Name Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">
                          Full Name
                        </label>
                        <div className="relative group" onMouseDown={() => setIsPasswordFieldFocused(false)}>
                          <User className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                          <Input
                            type="text"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50/50 transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">
                          Email Address
                        </label>
                        <div className="relative group" onMouseDown={() => setIsPasswordFieldFocused(false)}>
                          <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                          <Input
                            type="text"
                            placeholder="you@example.com"
                            value={signupEmail}
                            onChange={(e) => {
                              setSignupEmail(e.target.value);
                              setSignupEmailError("");
                            }}
                            className={`w-full pl-11 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-gray-50/50 transition-all ${
                              signupEmailError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-orange-500'
                            }`}
                            required
                          />
                        </div>
                        {signupEmailError && (
                          <p className="text-xs text-red-500 font-medium">{signupEmailError}</p>
                        )}
                      </div>

                      {/* Mobile Number with Country Code */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">
                          Mobile Number
                        </label>
                        <div className="flex gap-2" onMouseDown={() => setIsPasswordFieldFocused(false)}>
                          {/* Country Code Selector */}
                          <Popover open={openCountryPopover} onOpenChange={(open) => {
                            setOpenCountryPopover(open);
                            if (!open) {
                              setCountrySearch("");
                            }
                          }}>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                className="px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-gray-100 transition-all flex items-center gap-2 min-w-fit focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                              >
                                <span className="text-sm font-medium">{selectedCountry.dial}</span>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-0" align="start">
                              <div className="flex flex-col">
                                {/* Search Input */}
                                <div className="sticky top-0 z-10 p-3 border-b border-gray-200 bg-white">
                                  <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                      type="text"
                                      placeholder="Search country..."
                                      value={countrySearch}
                                      onChange={(e) => setCountrySearch(e.target.value)}
                                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50"
                                      autoFocus
                                    />
                                  </div>
                                </div>

                                {/* Countries List */}
                                <div className="max-h-64 overflow-y-auto" onWheel={(e) => e.stopPropagation()}>
                                  {filteredCountries.length > 0 ? (
                                    filteredCountries.map((country) => (
                                      <button
                                        key={country.code}
                                        type="button"
                                        onClick={() => handleCountrySelect(country)}
                                        className={`w-full text-left px-3 py-2.5 text-sm hover:bg-orange-50 transition-colors flex items-center justify-between ${
                                          selectedCountry.code === country.code ? "bg-orange-100 font-semibold" : ""
                                        }`}
                                      >
                                        <span>
                                          <span className="font-medium">{country.dial}</span>
                                          <span className="text-gray-600 ml-2">
                                            {country.name}
                                          </span>
                                        </span>
                                        {selectedCountry.code === country.code && (
                                          <span className="text-orange-600">✓</span>
                                        )}
                                      </button>
                                    ))
                                  ) : (
                                    <div className="px-3 py-8 text-sm text-gray-500 text-center">
                                      No countries found
                                    </div>
                                  )}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>

                          {/* Mobile Number Input */}
                          <div className="relative group flex-1">
                            <Phone className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <Input
                              type="tel"
                              placeholder="9876543210"
                              value={mobileNumber}
                              onChange={(e) => {
                                const digitsOnly = e.target.value.replace(/\D/g, '');
                                const maxDigits = COUNTRY_DIGIT_REQUIREMENTS[selectedCountry.code]?.max || 15;
                                const truncated = digitsOnly.slice(0, maxDigits);
                                setMobileNumber(truncated);
                                setMobileNumberError("");
                              }}
                              className={`w-full pl-11 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50/50 transition-all ${
                                mobileNumberError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500/20'
                              }`}
                              required
                            />
                          </div>
                        </div>
                        {mobileNumberError && (
                          <p className="text-xs text-red-500 font-medium">{mobileNumberError}</p>
                        )}
                      </div>

                      {/* Password Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">
                          Password
                        </label>
                        <div className="relative group">
                          <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                          <Input
                            ref={signupPasswordInputRef}
                            type={showSignupPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            onFocus={() => setIsPasswordFieldFocused(true)}
                            onBlur={() => setIsPasswordFieldFocused(false)}
                            onKeyDown={(e) => {
                              if (e.key === 'Tab' && !e.shiftKey) {
                                e.preventDefault();
                                const eyeButton = signupPasswordInputRef.current?.parentElement?.querySelector('button');
                                if (eyeButton && eyeButton instanceof HTMLButtonElement) {
                                  eyeButton.focus();
                                }
                              }
                            }}
                            className="w-full pl-11 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50/50 transition-all"
                            required
                          />
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              togglePasswordVisibility(setShowSignupPassword, showSignupPassword, signupPasswordInputRef);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Tab' && !e.shiftKey) {
                                e.preventDefault();
                                confirmPasswordInputRef.current?.focus();
                                confirmPasswordInputRef.current?.select();
                              }
                            }}
                            className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showSignupPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>

                        {/* Password Requirements */}
                        {signupPassword && isPasswordFieldFocused && (
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

                      {/* Confirm Password Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">
                          Confirm Password
                        </label>
                        <div className="relative group" onMouseDown={(e) => {
                          if (e.target.closest('button')) return;
                          setIsPasswordFieldFocused(false);
                        }}>
                          <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                          <Input
                            ref={confirmPasswordInputRef}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Tab' && !e.shiftKey) {
                                e.preventDefault();
                                const eyeButton = confirmPasswordInputRef.current?.parentElement?.querySelector('button');
                                if (eyeButton && eyeButton instanceof HTMLButtonElement) {
                                  eyeButton.focus();
                                }
                              }
                            }}
                            className={`w-full pl-11 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-gray-50/50 transition-all ${
                              confirmPassword && !passwordsMatch ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                            }`}
                            required
                          />
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              togglePasswordVisibility(setShowConfirmPassword, showConfirmPassword, confirmPasswordInputRef);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Tab' && !e.shiftKey) {
                                const termsCheckbox = e.currentTarget.parentElement?.parentElement?.querySelector('label input[type="checkbox"]');
                                if (termsCheckbox instanceof HTMLInputElement) {
                                  e.preventDefault();
                                  termsCheckbox.focus();
                                }
                              }
                            }}
                            className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {confirmPassword && !passwordsMatch && (
                          <p className="text-xs text-red-500 font-medium">Passwords do not match</p>
                        )}
                        {confirmPassword && passwordsMatch && (
                          <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <span>✓</span> Passwords match
                          </p>
                        )}
                      </div>

                      {/* Terms Checkbox */}
                      <label className="flex items-start gap-2 cursor-pointer group mt-3" onMouseDown={() => setIsPasswordFieldFocused(false)}>
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 accent-orange-500 cursor-pointer mt-0.5"
                          required
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                          I agree to the{" "}
                          <a href="/terms-and-condition" className="text-orange-600 hover:text-orange-700 font-semibold" onMouseDown={() => setIsPasswordFieldFocused(false)}>
                            Terms & Conditions
                          </a>
                          {" "}and{" "}
                          <a href="/privacy-policy" className="text-orange-600 hover:text-orange-700 font-semibold" onMouseDown={() => setIsPasswordFieldFocused(false)}>
                            Privacy Policy
                          </a>
                        </span>
                      </label>

                      {/* Sign Up Button */}
                      <button
                        type="submit"
                        disabled={isSigningUp || !isPasswordValid || !fullName || !signupEmail || !validateEmail(signupEmail) || !mobileNumber || !validateInternationalMobile(mobileNumber, selectedCountry.code) || !agreeTerms}
                        className="w-full mt-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {isSigningUp ? "Creating Account..." : "Create Account"}
                        {!isSigningUp && <ArrowRight className="h-5 w-5" />}
                      </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center gap-3 py-1">
                      <div className="flex-1 border-t border-gray-200"></div>
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        Or continue with
                      </span>
                      <div className="flex-1 border-t border-gray-200"></div>
                    </div>

                    {/* Google Sign Up */}
                    <div className="flex justify-center w-full" onMouseDown={() => setIsPasswordFieldFocused(false)}>
                      <GoogleLogin
                        onSuccess={handleGoogleSignup}
                        onError={() => toast.error("Google signup failed")}
                        text="signup_with"
                        width="360"
                      />
                    </div>

                    {/* Already Have Account Link */}
                    <div className="text-center pt-2">
                      <p className="text-sm text-gray-700">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab('login');
                          }}
                          onMouseDown={() => setIsPasswordFieldFocused(false)}
                          className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                        >
                          Login here
                        </button>
                      </p>
                    </div>

                    {/* Trust Section */}
                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                        🏆 Book With Confidence
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-green-50 to-green-50/50 p-3 rounded-lg border border-green-100">
                          <div className="text-lg font-bold text-green-600">4.8</div>
                          <p className="text-xs text-gray-600 mt-1">2.5K+ Reviews</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 p-3 rounded-lg border border-blue-100">
                          <div className="text-lg font-bold text-blue-600">4.6</div>
                          <p className="text-xs text-gray-600 mt-1">15K+ Bookings</p>
                        </div>
                      </div>
                    </div>

                    {/* Terms Text */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                      By continuing, you agree to StoriesByFoot's{" "}
                      <a href="/terms-and-condition" className="text-orange-600 hover:underline">
                        Terms & Conditions
                      </a>
                      {" "}and{" "}
                      <a href="/privacy-policy" className="text-orange-600 hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                  ) : (
                  // OTP Verification Screen
                  <div className="p-7 space-y-6 flex flex-col">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-50 to-orange-100 rounded-full flex items-center justify-center">
                        <Mail className="w-8 h-8 text-orange-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
                        <p className="text-sm text-gray-600 mt-2">
                          We've sent a 6-digit OTP to<br />
                          <span className="font-semibold text-gray-900">{otpEmail}</span>
                        </p>
                      </div>
                    </div>

                    {!isPasswordResetOTPVerified ? (
                      // OTP Verification Form
                      <form onSubmit={handleOTPVerification} className="space-y-4 flex-1">
                        {/* OTP Input */}
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-900">
                            Enter OTP Code
                          </label>
                          <input
                            type="text"
                            placeholder="000000"
                            value={otpCode}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                              setOtpCode(value);
                            }}
                            maxLength={6}
                            className="w-full text-center text-2xl font-bold tracking-widest px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 bg-gray-50/50 transition-all"
                            required
                          />
                          <p className="text-xs text-gray-600 text-center">The OTP expires in 5 minutes</p>
                        </div>

                        {/* Verify Button */}
                        <button
                          type="submit"
                          disabled={isVerifyingOTP || otpCode.length !== 6}
                          className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          {isVerifyingOTP ? (
                            <>
                              <Loader className="h-5 w-5 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              Verify OTP
                              <ArrowRight className="h-5 w-5" />
                            </>
                          )}
                        </button>
                      </form>
                    ) : (
                      // Password Reset Form (shown after OTP verification)
                      <form onSubmit={handlePasswordResetSubmit} className="space-y-4 flex-1">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">Set New Password</h3>
                          <p className="text-sm text-gray-600">Create a strong password to secure your account</p>
                        </div>

                        {/* New Password Field */}
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-900">
                            New Password
                          </label>
                          <div className="relative group">
                            <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <Input
                              type={showResetPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={resetPassword}
                              onChange={(e) => setResetPassword(e.target.value)}
                              onFocus={() => setIsPasswordFieldFocused(true)}
                              onBlur={() => setIsPasswordFieldFocused(false)}
                              className="w-full pl-11 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50/50 transition-all"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowResetPassword(!showResetPassword)}
                              className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showResetPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>

                          {/* Password Requirements */}
                          {resetPassword && isPasswordFieldFocused && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
                              <p className="text-xs font-semibold text-gray-900">Password Requirements:</p>
                              <div className="space-y-1.5 text-xs">
                                <div className={`flex items-center gap-2 ${validatePassword(resetPassword).requirements.length ? 'text-green-600' : 'text-gray-600'}`}>
                                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${validatePassword(resetPassword).requirements.length ? 'bg-green-100' : 'bg-gray-200'}`}>
                                    {validatePassword(resetPassword).requirements.length && <span className="text-green-600 font-bold">✓</span>}
                                  </div>
                                  <span>At least 6 characters</span>
                                </div>
                                <div className={`flex items-center gap-2 ${validatePassword(resetPassword).requirements.uppercase ? 'text-green-600' : 'text-gray-600'}`}>
                                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${validatePassword(resetPassword).requirements.uppercase ? 'bg-green-100' : 'bg-gray-200'}`}>
                                    {validatePassword(resetPassword).requirements.uppercase && <span className="text-green-600 font-bold">✓</span>}
                                  </div>
                                  <span>At least 1 uppercase letter (A-Z)</span>
                                </div>
                                <div className={`flex items-center gap-2 ${validatePassword(resetPassword).requirements.lowercase ? 'text-green-600' : 'text-gray-600'}`}>
                                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${validatePassword(resetPassword).requirements.lowercase ? 'bg-green-100' : 'bg-gray-200'}`}>
                                    {validatePassword(resetPassword).requirements.lowercase && <span className="text-green-600 font-bold">✓</span>}
                                  </div>
                                  <span>At least 1 lowercase letter (a-z)</span>
                                </div>
                                <div className={`flex items-center gap-2 ${validatePassword(resetPassword).requirements.number ? 'text-green-600' : 'text-gray-600'}`}>
                                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${validatePassword(resetPassword).requirements.number ? 'bg-green-100' : 'bg-gray-200'}`}>
                                    {validatePassword(resetPassword).requirements.number && <span className="text-green-600 font-bold">✓</span>}
                                  </div>
                                  <span>At least 1 number (0-9)</span>
                                </div>
                                <div className={`flex items-center gap-2 ${validatePassword(resetPassword).requirements.special ? 'text-green-600' : 'text-gray-600'}`}>
                                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${validatePassword(resetPassword).requirements.special ? 'bg-green-100' : 'bg-gray-200'}`}>
                                    {validatePassword(resetPassword).requirements.special && <span className="text-green-600 font-bold">✓</span>}
                                  </div>
                                  <span>At least 1 special character (!@#$%^&*)</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-900">
                            Confirm Password
                          </label>
                          <div className="relative group" onMouseDown={() => setIsPasswordFieldFocused(false)}>
                            <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <Input
                              ref={confirmResetPasswordInputRef}
                              type={showConfirmResetPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={confirmResetPassword}
                              onChange={(e) => setConfirmResetPassword(e.target.value)}
                              className={`w-full pl-11 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-gray-50/50 transition-all ${
                                confirmResetPassword && resetPassword !== confirmResetPassword ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                              }`}
                              required
                            />
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                togglePasswordVisibility(setShowConfirmResetPassword, showConfirmResetPassword, confirmResetPasswordInputRef);
                              }}
                              className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showConfirmResetPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                          {confirmResetPassword && resetPassword !== confirmResetPassword && (
                            <p className="text-xs text-red-500 font-medium">Passwords do not match</p>
                          )}
                          {confirmResetPassword && resetPassword === confirmResetPassword && (
                            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                              <span>✓</span> Passwords match
                            </p>
                          )}
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isResettingPassword || !resetPassword || !confirmResetPassword || resetPassword !== confirmResetPassword || !validatePassword(resetPassword).isValid}
                          className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          {isResettingPassword ? (
                            <>
                              <Loader className="h-5 w-5 animate-spin" />
                              Resetting...
                            </>
                          ) : (
                            <>
                              Submit
                              <ArrowRight className="h-5 w-5" />
                            </>
                          )}
                        </button>
                      </form>
                    )}

                    {!isPasswordResetOTPVerified && (
                      <>
                        {/* Resend OTP */}
                        <div className="text-center space-y-3 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            Didn't receive the code?
                          </p>
                          <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={isSendingOTP}
                            className="text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors disabled:text-gray-400"
                          >
                            {isSendingOTP ? "Sending..." : "Resend OTP"}
                          </button>
                        </div>

                        {/* Back Button */}
                        <button
                          type="button"
                          onClick={handleBackToSignup}
                          className="w-full mt-2 border-2 border-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-lg hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-200"
                        >
                          Back to Sign Up
                        </button>
                      </>
                    )}
                  </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              // Forgot Password Form
              <div className="p-7 space-y-6 flex flex-col">
                {!showOTPVerification ? (
                  // Email Input Form
                  <>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        Forgotten Your Password?
                      </h2>
                      <p className="text-sm text-gray-600">
                        Don't worry, we'll send you a message to help you reset your password.
                      </p>
                    </div>

                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      {/* Email Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">
                          Email Address
                        </label>
                        <div className="relative group">
                          <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                          <Input
                            type="text"
                            placeholder="you@example.com"
                            value={forgotPasswordEmail}
                            onChange={(e) => {
                              setForgotPasswordEmail(e.target.value);
                              setForgotPasswordEmailError("");
                            }}
                            className={`w-full pl-11 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-gray-50/50 transition-all ${
                              forgotPasswordEmailError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-orange-500'
                            }`}
                            required
                          />
                        </div>
                        {forgotPasswordEmailError && (
                          <p className="text-xs text-red-500 font-medium">{forgotPasswordEmailError}</p>
                        )}
                      </div>

                      {/* Continue Button */}
                      <button
                        type="submit"
                        disabled={isSendingOTP}
                        className="w-full mt-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {isSendingOTP ? "Sending OTP..." : "Continue"}
                      </button>
                    </form>

                    {/* Return to Login */}
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={returnToLogin}
                        className="text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                      >
                        Return to Log in
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center gap-3 py-1">
                      <div className="flex-1 border-t border-gray-200"></div>
                    </div>

                    {/* Trust Section */}
                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                        🏆 Book With Confidence
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-green-50 to-green-50/50 p-3 rounded-lg border border-green-100">
                          <div className="text-lg font-bold text-green-600">4.8</div>
                          <p className="text-xs text-gray-600 mt-1">2.5K+ Reviews</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 p-3 rounded-lg border border-blue-100">
                          <div className="text-lg font-bold text-blue-600">4.6</div>
                          <p className="text-xs text-gray-600 mt-1">15K+ Bookings</p>
                        </div>
                      </div>
                    </div>

                    {/* Terms Text */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                      By continuing, you agree to StoriesByFoot's{" "}
                      <a href="/terms-and-condition" className="text-orange-600 hover:underline">
                        Terms & Conditions
                      </a>
                      {" "}and{" "}
                      <a href="/privacy-policy" className="text-orange-600 hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  </>
                ) : (
                  // OTP Verification & Password Reset Screen
                  <>
                    {!isPasswordResetOTPVerified ? (
                      // OTP Verification Form
                      <>
                        <div className="text-center space-y-3">
                          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-50 to-orange-100 rounded-full flex items-center justify-center">
                            <Mail className="w-8 h-8 text-orange-600" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
                            <p className="text-sm text-gray-600 mt-2">
                              We've sent a 6-digit OTP to<br />
                              <span className="font-semibold text-gray-900">{otpEmail}</span>
                            </p>
                          </div>
                        </div>

                        <form onSubmit={handleOTPVerification} className="space-y-4 flex-1">
                          {/* OTP Input */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">
                              Enter OTP Code
                            </label>
                            <input
                              type="text"
                              placeholder="000000"
                              value={otpCode}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setOtpCode(value);
                              }}
                              maxLength={6}
                              className="w-full text-center text-2xl font-bold tracking-widest px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 bg-gray-50/50 transition-all"
                              required
                            />
                            <p className="text-xs text-gray-600 text-center">The OTP expires in 5 minutes</p>
                          </div>

                          {/* Verify Button */}
                          <button
                            type="submit"
                            disabled={isVerifyingOTP || otpCode.length !== 6}
                            className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            {isVerifyingOTP ? (
                              <>
                                <Loader className="h-5 w-5 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                Verify OTP
                                <ArrowRight className="h-5 w-5" />
                              </>
                            )}
                          </button>
                        </form>

                        {/* Resend OTP */}
                        <div className="text-center space-y-3 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            Didn't receive the code?
                          </p>
                          <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={isSendingOTP}
                            className="text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors disabled:text-gray-400"
                          >
                            {isSendingOTP ? "Sending..." : "Resend OTP"}
                          </button>
                        </div>

                        {/* Back Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setShowOTPVerification(false);
                            setOtpCode("");
                            setOtpEmail("");
                            setIsPasswordResetOTPVerified(false);
                            setResetPassword("");
                            setConfirmResetPassword("");
                          }}
                          className="w-full mt-2 border-2 border-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-lg hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-200"
                        >
                          Back
                        </button>
                      </>
                    ) : (
                      // Password Reset Form
                      <>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">Set New Password</h3>
                          <p className="text-sm text-gray-600">Create a strong password to secure your account</p>
                        </div>

                        <form onSubmit={handlePasswordResetSubmit} className="space-y-4 flex-1">
                          {/* New Password Field */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">
                              New Password
                            </label>
                            <div className="relative group">
                              <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                              <Input
                                ref={resetPasswordInputRef}
                                type={showResetPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={resetPassword}
                                onChange={(e) => setResetPassword(e.target.value)}
                                onFocus={() => setIsPasswordFieldFocused(true)}
                                onBlur={() => setIsPasswordFieldFocused(false)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Tab' && !e.shiftKey) {
                                    e.preventDefault();
                                    const eyeButton = resetPasswordInputRef.current?.parentElement?.querySelector('button');
                                    if (eyeButton && eyeButton instanceof HTMLButtonElement) {
                                      eyeButton.focus();
                                    }
                                  }
                                }}
                                className="w-full pl-11 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50/50 transition-all"
                                required
                              />
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  togglePasswordVisibility(setShowResetPassword, showResetPassword, resetPasswordInputRef);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Tab' && !e.shiftKey) {
                                    e.preventDefault();
                                    confirmResetPasswordInputRef.current?.focus();
                                    confirmResetPasswordInputRef.current?.select();
                                  }
                                }}
                                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showResetPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>

                            {/* Password Requirements */}
                            {resetPassword && isPasswordFieldFocused && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
                                <p className="text-xs font-semibold text-gray-900">Password Requirements:</p>
                                <div className="space-y-1.5 text-xs">
                                  <div className={`flex items-center gap-2 ${validatePassword(resetPassword).requirements.length ? 'text-green-600' : 'text-gray-600'}`}>
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${validatePassword(resetPassword).requirements.length ? 'bg-green-100' : 'bg-gray-200'}`}>
                                      {validatePassword(resetPassword).requirements.length && <span className="text-green-600 font-bold">✓</span>}
                                    </div>
                                    <span>At least 6 characters</span>
                                  </div>
                                  <div className={`flex items-center gap-2 ${validatePassword(resetPassword).requirements.uppercase ? 'text-green-600' : 'text-gray-600'}`}>
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${validatePassword(resetPassword).requirements.uppercase ? 'bg-green-100' : 'bg-gray-200'}`}>
                                      {validatePassword(resetPassword).requirements.uppercase && <span className="text-green-600 font-bold">✓</span>}
                                    </div>
                                    <span>At least 1 uppercase letter (A-Z)</span>
                                  </div>
                                  <div className={`flex items-center gap-2 ${validatePassword(resetPassword).requirements.lowercase ? 'text-green-600' : 'text-gray-600'}`}>
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${validatePassword(resetPassword).requirements.lowercase ? 'bg-green-100' : 'bg-gray-200'}`}>
                                      {validatePassword(resetPassword).requirements.lowercase && <span className="text-green-600 font-bold">✓</span>}
                                    </div>
                                    <span>At least 1 lowercase letter (a-z)</span>
                                  </div>
                                  <div className={`flex items-center gap-2 ${validatePassword(resetPassword).requirements.number ? 'text-green-600' : 'text-gray-600'}`}>
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${validatePassword(resetPassword).requirements.number ? 'bg-green-100' : 'bg-gray-200'}`}>
                                      {validatePassword(resetPassword).requirements.number && <span className="text-green-600 font-bold">✓</span>}
                                    </div>
                                    <span>At least 1 number (0-9)</span>
                                  </div>
                                  <div className={`flex items-center gap-2 ${validatePassword(resetPassword).requirements.special ? 'text-green-600' : 'text-gray-600'}`}>
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${validatePassword(resetPassword).requirements.special ? 'bg-green-100' : 'bg-gray-200'}`}>
                                      {validatePassword(resetPassword).requirements.special && <span className="text-green-600 font-bold">✓</span>}
                                    </div>
                                    <span>At least 1 special character (!@#$%^&*)</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Confirm Password Field */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">
                              Confirm Password
                            </label>
                            <div className="relative group" onMouseDown={(e) => {
                              if (e.target.closest('button')) return;
                              setIsPasswordFieldFocused(false);
                            }}>
                            <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <Input
                              ref={confirmResetPasswordInputRef}
                              type={showConfirmResetPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={confirmResetPassword}
                                onChange={(e) => setConfirmResetPassword(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Tab' && !e.shiftKey) {
                                    e.preventDefault();
                                    const eyeButton = confirmResetPasswordInputRef.current?.parentElement?.querySelector('button');
                                    if (eyeButton && eyeButton instanceof HTMLButtonElement) {
                                      eyeButton.focus();
                                    }
                                  }
                                }}
                                className={`w-full pl-11 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-gray-50/50 transition-all ${
                                  confirmResetPassword && resetPassword !== confirmResetPassword ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                                }`}
                                required
                              />
                              <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => setShowConfirmResetPassword(!showConfirmResetPassword)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Tab' && !e.shiftKey) {
                                    const submitButton = e.currentTarget.parentElement?.parentElement?.querySelector('button[type="submit"]');
                                    if (submitButton instanceof HTMLButtonElement) {
                                      e.preventDefault();
                                      submitButton.focus();
                                    }
                                  }
                                }}
                                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showConfirmResetPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                            {confirmResetPassword && resetPassword !== confirmResetPassword && (
                              <p className="text-xs text-red-500 font-medium">Passwords do not match</p>
                            )}
                            {confirmResetPassword && resetPassword === confirmResetPassword && (
                              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                <span>✓</span> Passwords match
                              </p>
                            )}
                          </div>

                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={isResettingPassword || !resetPassword || !confirmResetPassword || resetPassword !== confirmResetPassword || !validatePassword(resetPassword).isValid}
                            className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            {isResettingPassword ? (
                              <>
                                <Loader className="h-5 w-5 animate-spin" />
                                Resetting...
                              </>
                            ) : (
                              <>
                                Submit
                                <ArrowRight className="h-5 w-5" />
                              </>
                            )}
                          </button>
                        </form>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogClose asChild>
          <button aria-label="Close" className="absolute right-3 top-3 z-[99999] text-gray-700 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 rounded-full p-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            <X className="h-5 w-5" />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
