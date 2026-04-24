export interface Coupon {
  id: string | number;
  code: string;
  discount: number;
  discountType: "percentage" | "fixed";
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  isActive: boolean;
  createdDate: string;
  applicablePackages: "all" | string[];
}

const COUPONS_STORAGE_KEY = "admin_coupons";

// Get all coupons from localStorage
export const getCouponsFromStorage = (): Coupon[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(COUPONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse coupons from storage", e);
    return [];
  }
};

// Save coupons to localStorage
export const saveCouponsToStorage = (coupons: Coupon[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
  } catch (e) {
    console.error("Failed to save coupons to storage", e);
  }
};

// Validate coupon code from API and check if it's applicable to a package
export const validateCouponFromAPI = async (
  code: string,
  packageSlug: string
): Promise<{ valid: boolean; coupon?: Coupon; error?: string }> => {
  try {
    const response = await fetch(`/api/coupons/code/${code.toUpperCase()}`);

    if (!response.ok) {
      return { valid: false, error: "Coupon code not found" };
    }

    const data = await response.json();
    const coupon = data.coupon;

    // Check if coupon is active
    if (!coupon.isActive) {
      return { valid: false, error: "This coupon is no longer valid" };
    }

    // Check expiry date
    if (new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, error: "This coupon has expired" };
    }

    // Check usage limit
    if (coupon.usedCount >= coupon.maxUses) {
      return { valid: false, error: "This coupon has reached its usage limit" };
    }

    // Check if applicable to this package
    if (
      coupon.applicablePackages !== "all" &&
      !coupon.applicablePackages.includes(packageSlug)
    ) {
      return { valid: false, error: "This coupon is not applicable to this package" };
    }

    return { valid: true, coupon };
  } catch (err) {
    return { valid: false, error: "Failed to validate coupon" };
  }
};

// Validate coupon code and check if it's applicable to a package (deprecated - use validateCouponFromAPI)
export const validateCoupon = (
  code: string,
  packageSlug: string
): { valid: boolean; coupon?: Coupon; error?: string } => {
  const coupons = getCouponsFromStorage();
  const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());

  if (!coupon) {
    return { valid: false, error: "Coupon code not found" };
  }

  // Check if coupon is active
  if (!coupon.isActive) {
    return { valid: false, error: "This coupon is no longer valid" };
  }

  // Check expiry date
  if (new Date(coupon.expiryDate) < new Date()) {
    return { valid: false, error: "This coupon has expired" };
  }

  // Check usage limit
  if (coupon.usedCount >= coupon.maxUses) {
    return { valid: false, error: "This coupon has reached its usage limit" };
  }

  // Check if applicable to this package
  if (
    coupon.applicablePackages !== "all" &&
    !coupon.applicablePackages.includes(packageSlug)
  ) {
    return { valid: false, error: "This coupon is not applicable to this package" };
  }

  return { valid: true, coupon };
};

// Calculate discount amount
export const calculateDiscount = (
  coupon: Coupon,
  originalPrice: number
): number => {
  if (coupon.discountType === "percentage") {
    return Math.round((originalPrice * coupon.discount) / 100);
  } else {
    return coupon.discount;
  }
};

// Increment coupon usage via API
export const incrementCouponUsageFromAPI = async (couponId: string | number): Promise<void> => {
  try {
    const response = await fetch(`/api/coupons/${couponId}/increment-usage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to increment coupon usage');
    }
  } catch (err) {
    console.error('Error incrementing coupon usage:', err);
  }
};

// Increment coupon usage (deprecated - use incrementCouponUsageFromAPI)
export const incrementCouponUsage = (couponId: string): void => {
  const coupons = getCouponsFromStorage();
  const updatedCoupons = coupons.map((c) =>
    c.id === couponId ? { ...c, usedCount: c.usedCount + 1 } : c
  );
  saveCouponsToStorage(updatedCoupons);
};
