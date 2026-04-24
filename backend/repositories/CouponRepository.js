import { getDB } from '../db/index.js';

export class CouponRepository {
  /**
   * Create a new coupon
   */
  static async create(code, discount, discountType, maxUses, expiryDate, applicablePackages) {
    const db = getDB();

    const coupon = await db.createCoupon({
      code,
      discount,
      discountType,
      maxUses,
      expiryDate,
      applicablePackages
    });

    if (!coupon) {
      throw new Error('Failed to create coupon');
    }

    return coupon;
  }

  /**
   * Get all coupons
   */
  static async getAll() {
    const db = getDB();
    return await db.getAllCoupons();
  }

  /**
   * Get coupon by code
   */
  static async getByCode(code) {
    const db = getDB();
    return await db.getCouponByCode(code);
  }

  /**
   * Update coupon
   */
  static async update(id, updates) {
    const db = getDB();
    const coupon = await db.updateCoupon(id, updates);

    if (!coupon) {
      throw new Error('Failed to update coupon');
    }

    return coupon;
  }

  /**
   * Delete coupon
   */
  static async delete(id) {
    const db = getDB();
    const success = await db.deleteCoupon(id);

    if (!success) {
      throw new Error('Failed to delete coupon');
    }

    return true;
  }

  /**
   * Increment usage count for a coupon
   */
  static async incrementUsage(id) {
    const db = getDB();
    const coupon = await db.getCouponById(id);

    if (!coupon) {
      throw new Error('Coupon not found');
    }

    return await db.updateCoupon(id, { usedCount: coupon.usedCount + 1 });
  }
}
