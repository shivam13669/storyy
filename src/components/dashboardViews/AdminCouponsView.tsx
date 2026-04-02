import { useState, useEffect } from "react";
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
import { AlertCircle, CheckCircle, Copy, Trash2, ChevronDown, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { destinations } from "@/data/destinations";
import { Coupon } from "@/utils/couponUtils";

interface AdminCouponsViewProps {
  initialCoupons?: Coupon[];
}

const API_URL = '/api';

export function AdminCouponsView({ initialCoupons = [] }: AdminCouponsViewProps) {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [loading, setLoading] = useState(false);
  const [fetchingCoupons, setFetchingCoupons] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingCouponId, setEditingCouponId] = useState<string | number | null>(null);

  // Fetch coupons from API on component mount
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setFetchingCoupons(true);
        const response = await fetch(`${API_URL}/coupons`);
        if (!response.ok) {
          throw new Error('Failed to fetch coupons');
        }
        const data = await response.json();
        setCoupons(data.coupons || []);
      } catch (err) {
        console.error('Error fetching coupons:', err);
        toast({
          title: "Error",
          description: "Failed to load coupons",
          variant: "destructive"
        });
      } finally {
        setFetchingCoupons(false);
      }
    };

    fetchCoupons();
  }, [toast]);

  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    discountType: "percentage" as "percentage" | "fixed",
    maxUses: "100",
    expiryDate: "",
    applicablePackages: "all" as "all" | string[],
  });

  const [packageSearch, setPackageSearch] = useState("");
  const [showPackageDropdown, setShowPackageDropdown] = useState(false);

  // Get all packages from all destinations
  const allPackages = destinations.flatMap((destination) =>
    destination.packages.map((pkg) => ({
      slug: pkg.slug,
      name: pkg.name,
      destination: destination.name,
    }))
  );

  // Filter packages based on search
  const filteredPackages = allPackages.filter((pkg) =>
    pkg.name.toLowerCase().includes(packageSearch.toLowerCase()) ||
    pkg.destination.toLowerCase().includes(packageSearch.toLowerCase())
  );

  // Get selected packages display
  const getSelectedPackagesDisplay = () => {
    if (formData.applicablePackages === "all") {
      return "All Packages";
    }
    if (Array.isArray(formData.applicablePackages) && formData.applicablePackages.length > 0) {
      const selectedCount = formData.applicablePackages.length;
      const maxDisplay = 2;
      const selectedNames = formData.applicablePackages
        .slice(0, maxDisplay)
        .map((slug) => allPackages.find((p) => p.slug === slug)?.name)
        .filter(Boolean)
        .join(", ");
      const remaining = selectedCount - maxDisplay;
      return remaining > 0 ? `${selectedNames} +${remaining} more` : selectedNames;
    }
    return "Select Packages";
  };

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

    if (
      formData.applicablePackages !== "all" &&
      (Array.isArray(formData.applicablePackages) && formData.applicablePackages.length === 0)
    ) {
      setError("Please select at least one package or select All Packages");
      return;
    }

    setLoading(true);
    try {
      if (editingCouponId) {
        // Update existing coupon
        const response = await fetch(`${API_URL}/coupons/${editingCouponId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            discount: Number(formData.discount),
            discountType: formData.discountType,
            maxUses: Number(formData.maxUses),
            expiryDate: formData.expiryDate,
            applicablePackages: formData.applicablePackages,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update coupon');
        }

        const data = await response.json();
        setCoupons(coupons.map((c) => (c.id === editingCouponId ? data.coupon : c)));
        setSuccess("Coupon updated successfully!");
        toast({ title: "Success", description: `Coupon ${data.coupon.code} updated` });
      } else {
        // Create new coupon
        const response = await fetch(`${API_URL}/coupons`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: formData.code.toUpperCase(),
            discount: Number(formData.discount),
            discountType: formData.discountType,
            maxUses: Number(formData.maxUses),
            expiryDate: formData.expiryDate,
            applicablePackages: formData.applicablePackages,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create coupon');
        }

        const data = await response.json();
        setCoupons([...coupons, data.coupon]);
        setSuccess("Coupon created successfully!");
        toast({ title: "Success", description: `Coupon ${data.coupon.code} created` });
      }

      // Reset form
      setFormData({
        code: "",
        discount: "",
        discountType: "percentage",
        maxUses: "100",
        expiryDate: "",
        applicablePackages: "all",
      });
      setPackageSearch("");
      setShowPackageDropdown(false);
      setEditingCouponId(null);

      setTimeout(() => {
        setShowForm(false);
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : editingCouponId ? "Failed to update coupon" : "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCouponId(coupon.id);
    setFormData({
      code: coupon.code,
      discount: coupon.discount.toString(),
      discountType: coupon.discountType,
      maxUses: coupon.maxUses.toString(),
      expiryDate: coupon.expiryDate.split('T')[0],
      applicablePackages: coupon.applicablePackages,
    });
    setShowForm(true);
  };

  const handleDeleteCoupon = async (id: string | number) => {
    try {
      const response = await fetch(`${API_URL}/coupons/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete coupon');
      }

      setCoupons(coupons.filter((c) => c.id !== id));
      toast({ title: "Success", description: "Coupon deleted" });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete coupon",
        variant: "destructive"
      });
    }
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
        <Button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              setEditingCouponId(null);
              setFormData({
                code: "",
                discount: "",
                discountType: "percentage",
                maxUses: "100",
                expiryDate: "",
                applicablePackages: "all",
              });
              setPackageSearch("");
            }
          }}
          className="flex items-center gap-2"
        >
          {showForm ? "Cancel" : "+ Create Coupon"}
        </Button>
      </div>

      {/* Create/Edit Coupon Form */}
      {showForm && (
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>{editingCouponId ? "Edit Coupon" : "Create New Coupon"}</CardTitle>
            <CardDescription>
              {editingCouponId ? "Update the coupon details" : "Generate a new discount coupon for your customers"}
            </CardDescription>
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
                      disabled={loading || editingCouponId !== null}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateCouponCode}
                      disabled={loading || editingCouponId !== null || formData.code.trim().length > 0}
                      title={editingCouponId !== null ? "Cannot change code while editing" : formData.code.trim().length > 0 ? "Clear the field to generate a code" : "Generate a random coupon code"}
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

              {/* Package Selection */}
              <div>
                <Label htmlFor="packages">Applicable Packages</Label>
                <div className="mt-1 relative">
                  <button
                    type="button"
                    onClick={() => setShowPackageDropdown(!showPackageDropdown)}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between hover:bg-gray-50 disabled:bg-gray-100"
                  >
                    <span className="text-gray-700">{getSelectedPackagesDisplay()}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {showPackageDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-10 max-h-64 overflow-hidden flex flex-col">
                      {/* Search input */}
                      <div className="p-3 border-b border-gray-200 bg-gray-50">
                        <Input
                          placeholder="Search packages..."
                          value={packageSearch}
                          onChange={(e) => setPackageSearch(e.target.value)}
                          className="text-sm h-9"
                        />
                      </div>

                      {/* Options */}
                      <div className="overflow-y-auto flex-1">
                        {/* All Packages option */}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, applicablePackages: "all" });
                            setShowPackageDropdown(false);
                            setPackageSearch("");
                          }}
                          className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors ${
                            formData.applicablePackages === "all"
                              ? "bg-blue-600 text-white font-medium"
                              : "text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.applicablePackages === "all"}
                            readOnly
                            className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                          />
                          <span className="font-medium">All Packages</span>
                        </button>

                        {/* Individual packages with destination grouping */}
                        {filteredPackages.length > 0 ? (
                          <div>
                            {Array.from(new Set(filteredPackages.map((p) => p.destination))).map(
                              (destination) => (
                                <div key={destination}>
                                  {/* Destination header */}
                                  <div className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50 border-t border-gray-200">
                                    {destination}
                                  </div>
                                  {/* Packages under destination */}
                                  {filteredPackages
                                    .filter((pkg) => pkg.destination === destination)
                                    .map((pkg) => (
                                      <button
                                        key={pkg.slug}
                                        type="button"
                                        onClick={() => {
                                          if (formData.applicablePackages === "all") {
                                            setFormData({
                                              ...formData,
                                              applicablePackages: [pkg.slug],
                                            });
                                          } else {
                                            const currentPackages = Array.isArray(
                                              formData.applicablePackages
                                            )
                                              ? formData.applicablePackages
                                              : [];
                                            const isSelected = currentPackages.includes(pkg.slug);
                                            const updated = isSelected
                                              ? currentPackages.filter((p) => p !== pkg.slug)
                                              : [...currentPackages, pkg.slug];
                                            setFormData({
                                              ...formData,
                                              applicablePackages: updated,
                                            });
                                          }
                                        }}
                                        className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors ${
                                          Array.isArray(formData.applicablePackages) &&
                                          formData.applicablePackages.includes(pkg.slug)
                                            ? "bg-blue-50 text-blue-700 font-medium"
                                            : "text-gray-900 hover:bg-gray-50"
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={
                                            Array.isArray(formData.applicablePackages) &&
                                            formData.applicablePackages.includes(pkg.slug)
                                          }
                                          readOnly
                                          className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                        />
                                        <span className="font-medium">{pkg.name}</span>
                                      </button>
                                    ))}
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="px-4 py-8 text-sm text-gray-500 text-center">
                            No packages found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (editingCouponId ? "Updating..." : "Creating...") : (editingCouponId ? "Update Coupon" : "Create Coupon")}
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
                    <TableHead>Applicable To</TableHead>
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
                      <TableCell className="text-gray-600 text-sm">
                        {coupon.applicablePackages === "all" ? (
                          <Badge variant="secondary">All Packages</Badge>
                        ) : Array.isArray(coupon.applicablePackages) ? (
                          <div className="flex flex-wrap gap-1">
                            {coupon.applicablePackages.slice(0, 2).map((slug) => {
                              const pkg = allPackages.find((p) => p.slug === slug);
                              return (
                                <Badge key={slug} variant="secondary" className="text-xs">
                                  {pkg?.name}
                                </Badge>
                              );
                            })}
                            {coupon.applicablePackages.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{coupon.applicablePackages.length - 2} more
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
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
                            onClick={() => handleEditCoupon(coupon)}
                            title="Edit coupon"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
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
                    <TableHead>Applicable To</TableHead>
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
                      <TableCell className="text-gray-600 text-sm">
                        {coupon.applicablePackages === "all" ? (
                          <Badge variant="secondary">All Packages</Badge>
                        ) : Array.isArray(coupon.applicablePackages) ? (
                          <div className="flex flex-wrap gap-1">
                            {coupon.applicablePackages.slice(0, 2).map((slug) => {
                              const pkg = allPackages.find((p) => p.slug === slug);
                              return (
                                <Badge key={slug} variant="secondary" className="text-xs">
                                  {pkg?.name}
                                </Badge>
                              );
                            })}
                            {coupon.applicablePackages.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{coupon.applicablePackages.length - 2} more
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
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
                            onClick={() => handleEditCoupon(coupon)}
                            title="Edit coupon"
                          >
                            <Edit2 className="w-4 h-4" />
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
