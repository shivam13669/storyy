import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Search, Trash2, Lock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface OTPStats {
  email: string;
  signup: {
    sentToday: number;
    sentThisWeek: number;
    history24h: Array<{ id: number; email: string; purpose: string; sentAt: string }>;
  };
  passwordReset: {
    sentToday: number;
    sentThisWeek: number;
    history24h: Array<{ id: number; email: string; purpose: string; sentAt: string }>;
  };
  activeBlock: {
    id: number;
    email: string;
    blockReason: string;
    blockedAt: string;
    unblockAt: string;
  } | null;
  failedAttemptsBlocksInDay: number;
}

interface BlockedEmailItem {
  email: string;
  blockReason: string;
  blockedAt: string;
  unblockAt: string;
}

export const AdminOTPManagementView = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpStats, setOtpStats] = useState<OTPStats | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [blockedEmails, setBlockedEmails] = useState<BlockedEmailItem[]>([]);

  const fetchOTPStats = async (emailToFetch?: string) => {
    // Ensure emailToFetch is a string if provided
    let emailValue = '';
    if (emailToFetch) {
      emailValue = typeof emailToFetch === 'string' ? emailToFetch : String(emailToFetch);
    } else {
      emailValue = email.trim();
    }

    if (!emailValue) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const url = `/api/admin/otp/customer/${encodeURIComponent(emailValue)}`;
      console.log('Fetching from:', url, 'with userId:', user.id);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'userid': user.id.toString(),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`Failed to fetch OTP stats: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('OTP Stats API Response:', data);
      console.log('Email field type:', typeof data.email, 'Value:', data.email);

      // Ensure email is a string, not an object
      if (typeof data.email !== 'string') {
        console.error('Email is not a string:', data.email);
        // If email is an object, try to extract it
        if (typeof data.email === 'object' && data.email !== null) {
          data.email = data.email.email || JSON.stringify(data.email);
        } else {
          data.email = String(data.email || emailValue);
        }
      }

      setOtpStats(data);
      setSearchPerformed(true);
      setEmail(emailValue);

      toast({
        title: "Success",
        description: "OTP statistics loaded",
      });
    } catch (error) {
      console.error("Error fetching OTP stats:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch OTP statistics. Make sure you're logged in as admin.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeOTPBlock = async () => {
    if (!otpStats?.email || !user?.id) return;

    setLoading(true);
    try {
      const emailStr = typeof otpStats.email === 'string' ? otpStats.email : String(otpStats.email);
      const url = `/api/admin/otp/block/${encodeURIComponent(emailStr)}`;
      console.log('Removing block from:', url);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'userid': user.id.toString(),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`Failed to remove block: ${response.status} ${response.statusText}`);
      }

      toast({
        title: "Success",
        description: "OTP block removed successfully",
      });

      // Refresh stats
      await fetchOTPStats();
    } catch (error) {
      console.error("Error removing block:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove OTP block",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetSendLimit = async (purpose: 'signup' | 'password-reset') => {
    if (!otpStats?.email || !user?.id) return;

    setLoading(true);
    try {
      const emailStr = typeof otpStats.email === 'string' ? otpStats.email : String(otpStats.email);
      const url = `/api/admin/otp/reset-send-limit/${encodeURIComponent(emailStr)}/${purpose}`;
      console.log('Resetting limit from:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userid': user.id.toString(),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`Failed to reset limit: ${response.status} ${response.statusText}`);
      }

      toast({
        title: "Success",
        description: `${purpose === 'signup' ? 'Signup' : 'Password reset'} OTP limit reset`,
      });

      // Refresh stats
      await fetchOTPStats();
    } catch (error) {
      console.error("Error resetting limit:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset OTP limit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900">OTP Management</h3>
        <p className="text-sm text-gray-600 mt-1">
          Monitor and manage OTP usage, blocks, and customer verification
        </p>
      </div>

      {/* Search Card */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle>Search Customer</CardTitle>
          <CardDescription>Enter an email address to view OTP statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Enter email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchOTPStats()}
                className="pl-10"
              />
            </div>
            <Button
              onClick={fetchOTPStats}
              disabled={loading}
              className="px-6"
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Display */}
      {searchPerformed && !otpStats && (
        <Card className="border border-yellow-200 bg-yellow-50 rounded-2xl">
          <CardContent className="p-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-yellow-800">No results found. Please check the email address and try again.</p>
          </CardContent>
        </Card>
      )}

      {otpStats && (
        <>
          {/* Customer Info & Summary */}
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{typeof otpStats.email === 'string' ? otpStats.email : String(otpStats.email)}</span>
                {otpStats.activeBlock && (
                  <Badge variant="destructive" className="flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    Blocked
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Customer OTP Activity Overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 font-medium">Signup OTP (24h)</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{otpStats.signup.sentToday}</p>
                  <p className="text-xs text-gray-500 mt-1">out of 3 limit</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 font-medium">Password Reset (24h)</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{otpStats.passwordReset.sentToday}</p>
                  <p className="text-xs text-gray-500 mt-1">out of 3 limit</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-600 font-medium">Week Activity</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">{otpStats.signup.sentThisWeek + otpStats.passwordReset.sentThisWeek}</p>
                  <p className="text-xs text-gray-500 mt-1">total OTPs sent</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-gray-600 font-medium">Failed Blocks (24h)</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">{otpStats.failedAttemptsBlocksInDay}</p>
                  <p className="text-xs text-gray-500 mt-1">wrong attempts blocks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Block Alert */}
          {otpStats.activeBlock && (
            <Card className="border border-red-200 bg-red-50 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 justify-between">
                  <div className="flex gap-3 flex-1">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900">Active Block</h4>
                      <p className="text-sm text-red-800 mt-1">{otpStats.activeBlock.blockReason}</p>
                      <p className="text-xs text-red-700 mt-2">
                        Blocked since: {new Date(otpStats.activeBlock.blockedAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-red-700">
                        Unblock at: {new Date(otpStats.activeBlock.unblockAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={removeOTPBlock}
                    disabled={loading}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Block
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Signup OTP History */}
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Signup OTP History (24h)</CardTitle>
                  <CardDescription>All signup OTP requests in the last 24 hours</CardDescription>
                </div>
                {otpStats.signup.sentToday >= 3 && (
                  <Button
                    onClick={() => resetSendLimit('signup')}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                  >
                    Reset Limit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {otpStats.signup.history24h.length > 0 ? (
                <div className="space-y-3">
                  {otpStats.signup.history24h.map((entry, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">OTP Sent</p>
                          <p className="text-sm text-gray-600">
                            {new Date(entry.sentAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline">#{idx + 1}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-6">No signup OTPs sent in the last 24 hours</p>
              )}
            </CardContent>
          </Card>

          {/* Password Reset OTP History */}
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Password Reset OTP History (24h)</CardTitle>
                  <CardDescription>All password reset OTP requests in the last 24 hours</CardDescription>
                </div>
                {otpStats.passwordReset.sentToday >= 3 && (
                  <Button
                    onClick={() => resetSendLimit('password-reset')}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                  >
                    Reset Limit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {otpStats.passwordReset.history24h.length > 0 ? (
                <div className="space-y-3">
                  {otpStats.passwordReset.history24h.map((entry, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">OTP Sent</p>
                          <p className="text-sm text-gray-600">
                            {new Date(entry.sentAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline">#{idx + 1}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-6">No password reset OTPs sent in the last 24 hours</p>
              )}
            </CardContent>
          </Card>

          {/* Common Issues - Customers with Recent Blocks */}
          {otpStats?.activeBlock && (
            <Card className="border-0 shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle>Customer with Active Block</CardTitle>
                <CardDescription>Customers currently blocked from OTP requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div
                    onClick={() => fetchOTPStats(otpStats.email)}
                    className="p-4 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{typeof otpStats.email === 'string' ? otpStats.email : String(otpStats.email)}</p>
                        <p className="text-sm text-red-600">{otpStats.activeBlock.blockReason}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Unblock at: {new Date(otpStats.activeBlock.unblockAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="destructive">Active Block</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Information */}
          <Card className="border border-blue-200 bg-blue-50 rounded-2xl">
            <CardContent className="p-6">
              <h4 className="font-semibold text-blue-900 mb-3">OTP Management Information</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex gap-2">
                  <span>•</span>
                  <span><strong>Daily Limits:</strong> Each purpose (signup/password reset) has a separate limit of 3 OTPs per email per 24 hours</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span><strong>Resend Cooldown:</strong> Users must wait 30 seconds between OTP requests</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span><strong>Wrong Attempts:</strong> After 3 wrong OTP attempts, the customer is blocked for 15 minutes</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span><strong>Repeated Abuse:</strong> If a customer gets 3 wrong attempt blocks in the same day, they're blocked for 24 hours</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span><strong>Admin Override:</strong> You can remove blocks and reset limits for customers who are having issues</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
