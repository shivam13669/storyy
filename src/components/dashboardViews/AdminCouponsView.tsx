import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Copy, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  discountType: "percentage" | "fixed";
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  isActive: boolean;
  createdDate: string;
}

interface AdminCouponsViewProps {
  initialCoupons?: Coupon[];
}

export function AdminCouponsView({ initialCoupons = [] }: AdminCouponsViewProps) {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    discountType: "percentage" as "percentage" | "fixed",
    maxUses: "100",
    expiryDate: "",
  });

  const generateCouponCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.code.trim()) {
      setError("Coupon code is required");
      return;
    }

    if (!formData.discount || isNaN(Number(formData.discount))) {
      setError("Valid discount amount is required");
      return;
    }

    if (formData.discountType === "percentage" && Number(formData.discount) > 100) {
      setError("Percentage discount cannot exceed 100%");
      return;
    }

    if (!formData.expiryDate) {
      setError("Expiry date is required");
      return;
    }

    setLoading(true);
    try {
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        code: formData.code.toUpperCase(),
        discount: Number(formData.discount),
        discountType: formData.discountType,
        maxUses: Number(formData.maxUses),
        usedCount: 0,
        expiryDate: formData.expiryDate,
        isActive: true,
        createdDate: new Date().toISOString(),
      };

      setCoupons([...coupons, newCoupon]);
      setSuccess("Coupon created successfully!");
      toast({ title: "Success", description: `Coupon ${newCoupon.code} created` });

      // Reset form
      setFormData({
        code: "",
        discount: "",
        discountType: "percentage",
        maxUses: "100",
        expiryDate: "",
      });

      setTimeout(() => {
        setShowForm(false);
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons(coupons.filter((c) => c.id !== id));
    toast({ title: "Success", description: "Coupon deleted" });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Success", description: "Coupon code copied to clipboard" });
  };

  const activeCoupons = coupons.filter((c) => c.isActive && new Date(c.expiryDate) > new Date());
  const expiredCoupons = coupons.filter((c) => new Date(c.expiryDate) <= new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Coupon Management</h3>
          <p className="text-sm text-gray-600 mt-1">Create and manage discount coupons</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          {showForm ? "Cancel" : "+ Create Coupon"}
        </Button>
      </div>

      {/* Create Coupon Form */}
      {showForm && (
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>Create New Coupon</CardTitle>
            <CardDescription>Generate a new discount coupon for your customers</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Coupon Code</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="code"
                      placeholder="SUMMER2024"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateCouponCode}
                      disabled={loading}
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="discount">Discount Amount</Label>
                  <Input
                    id="discount"
                    type="number"
                    placeholder="20"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    disabled={loading}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="discountType">Type</Label>
                  <select
                    id="discountType"
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as "percentage" | "fixed" })}
                    disabled={loading}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="maxUses">Max Uses</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    placeholder="100"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    disabled={loading}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    disabled={loading}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creating..." : "Create Coupon"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Active Coupons */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle>Active Coupons</CardTitle>
          <CardDescription>{activeCoupons.length} active coupons</CardDescription>
        </CardHeader>
        <CardContent>
          {activeCoupons.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Used / Max</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeCoupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-mono font-bold text-gray-900">{coupon.code}</TableCell>
                      <TableCell>
                        <Badge>
                          {coupon.discount}
                          {coupon.discountType === "percentage" ? "%" : "₹"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {coupon.usedCount} / {coupon.maxUses}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {format(new Date(coupon.expiryDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyCode(coupon.code)}
                            title="Copy code"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-600">No active coupons yet</p>
          )}
        </CardContent>
      </Card>

      {/* Expired Coupons */}
      {expiredCoupons.length > 0 && (
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>Expired Coupons</CardTitle>
            <CardDescription>{expiredCoupons.length} expired coupons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Used / Max</TableHead>
                    <TableHead>Expired Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiredCoupons.map((coupon) => (
                    <TableRow key={coupon.id} className="opacity-60">
                      <TableCell className="font-mono font-bold text-gray-900">{coupon.code}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {coupon.discount}
                          {coupon.discountType === "percentage" ? "%" : "₹"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {coupon.usedCount} / {coupon.maxUses}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {format(new Date(coupon.expiryDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
