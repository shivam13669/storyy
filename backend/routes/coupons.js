import express from 'express';
import { CouponRepository } from '../repositories/CouponRepository.js';

const router = express.Router();

/**
 * POST /api/coupons
 * Create a new coupon (admin only)
 */
router.post('/', async (req, res) => {
  try {
    const { code, discount, discountType, maxUses, expiryDate, applicablePackages } = req.body;

    // Validate required fields
    if (!code || !discount || !discountType || !maxUses || !expiryDate || !applicablePackages) {
      return res.status(400).json({
        error: 'Missing required fields: code, discount, discountType, maxUses, expiryDate, applicablePackages'
      });
    }

    const coupon = await CouponRepository.create(
      code,
      discount,
      discountType,
      maxUses,
      expiryDate,
      applicablePackages
    );

    console.log(`✅ Coupon created: ${code}`);

    res.status(201).json({
      message: 'Coupon created successfully',
      coupon
    });
  } catch (error) {
    console.error('Create coupon error:', error);

    if (error.message.includes('UNIQUE constraint failed') || error.message.includes('duplicate key')) {
      return res.status(409).json({ error: 'Coupon code already exists' });
    }

    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/coupons
 * Get all coupons (admin only)
 */
router.get('/', async (req, res) => {
  try {
    const coupons = await CouponRepository.getAll();
    res.json({ coupons });
  } catch (error) {
    console.error('Get all coupons error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/coupons/code/:code
 * Get coupon by code (public - for validation during checkout)
 */
router.get('/code/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const coupon = await CouponRepository.getByCode(code);

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json({ coupon });
  } catch (error) {
    console.error('Get coupon by code error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/coupons/:id
 * Update coupon (admin only)
 */
router.patch('/:id', async (req, res) => {
  try {
    const couponId = parseInt(req.params.id);
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const coupon = await CouponRepository.update(couponId, updates);

    console.log(`✅ Coupon updated: ${couponId}`);

    res.json({
      message: 'Coupon updated successfully',
      coupon
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/coupons/:id/increment-usage
 * Increment usage count for a coupon
 */
router.post('/:id/increment-usage', async (req, res) => {
  try {
    const couponId = parseInt(req.params.id);
    const coupon = await CouponRepository.incrementUsage(couponId);

    console.log(`✅ Coupon usage incremented: ${couponId}`);

    res.json({
      message: 'Coupon usage incremented',
      coupon
    });
  } catch (error) {
    console.error('Increment coupon usage error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/coupons/:id
 * Delete a coupon (admin only)
 */
router.delete('/:id', async (req, res) => {
  try {
    const couponId = parseInt(req.params.id);
    await CouponRepository.delete(couponId);

    console.log(`✅ Coupon deleted: ${couponId}`);

    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
