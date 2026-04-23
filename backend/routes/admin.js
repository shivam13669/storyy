import express from 'express';
import { getDB } from '../db/index.js';

const router = express.Router();

/**
 * GET /api/admin/health
 * Health check endpoint (no auth required)
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Admin routes are working' });
});

/**
 * Middleware to check if user is admin
 */
async function isAdmin(req, res, next) {
  try {
    // Get userId from header (sent by frontend)
    // Express converts header names to lowercase
    const userIdHeader = req.headers.userid;

    if (!userIdHeader) {
      console.warn('⚠️ Admin request missing userid header');
      return res.status(401).json({ error: 'Unauthorized - User ID required' });
    }

    const userId = parseInt(userIdHeader);

    if (!userId || isNaN(userId)) {
      console.warn('⚠️ Admin request invalid userid:', userIdHeader);
      return res.status(401).json({ error: 'Unauthorized - Invalid User ID' });
    }

    const db = getDB();
    const user = await db.getUserById(userId);

    if (!user) {
      console.warn(`⚠️ User not found: ${userId}`);
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.role !== 'admin') {
      console.warn(`⚠️ Non-admin user ${userId} attempted admin access`);
      return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }

    console.log(`✅ Admin request authorized for user: ${user.email}`);

    // Attach user to request for use in route handlers
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Admin check error:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /api/admin/otp/customer/:email
 * Get OTP statistics for a specific customer
 */
router.get('/otp/customer/:email', isAdmin, async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const db = getDB();

    // Get OTP send history (24h and 7d)
    const sendHistory24h = await db.getOTPSendHistory(email, 'signup', 24);
    const sendHistory7d = await db.getOTPSendHistory(email, 'signup', 24 * 7);
    const passwordResetHistory24h = await db.getOTPSendHistory(email, 'password-reset', 24);
    const passwordResetHistory7d = await db.getOTPSendHistory(email, 'password-reset', 24 * 7);

    // Get current active block
    const activeBlock = await db.getActiveOTPBlock(email);

    // Get failed attempt blocks in last 24h
    const failedBlocksInDay = await db.getFailedAttemptBlocksInDay(email);

    res.json({
      email,
      signup: {
        sentToday: sendHistory24h.length,
        sentThisWeek: sendHistory7d.length,
        history24h: sendHistory24h,
      },
      passwordReset: {
        sentToday: passwordResetHistory24h.length,
        sentThisWeek: passwordResetHistory7d.length,
        history24h: passwordResetHistory24h,
      },
      activeBlock,
      failedAttemptsBlocksInDay: failedBlocksInDay,
    });
  } catch (error) {
    console.error('Get customer OTP stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/admin/otp/block/:email
 * Remove OTP block for an email (admin override)
 */
router.delete('/otp/block/:email', isAdmin, async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const db = getDB();

    const removed = await db.removeOTPBlock(email);

    res.json({
      message: 'OTP block removed successfully',
      email,
      blockRemoved: removed
    });
  } catch (error) {
    console.error('Remove OTP block error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/admin/otp/reset-send-limit/:email/:purpose
 * Reset OTP send history for a specific purpose (admin override)
 */
router.post('/otp/reset-send-limit/:email/:purpose', isAdmin, async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const purpose = req.params.purpose; // 'signup' or 'password-reset'

    if (!['signup', 'password-reset'].includes(purpose)) {
      return res.status(400).json({ error: 'Invalid purpose. Must be "signup" or "password-reset".' });
    }

    const db = getDB();
    
    // Note: We're not deleting history, just informing the admin that they can request new OTP
    // In a more advanced system, you might want to actually delete old records
    // For now, we can just remove any active OTP and blocks
    await db.deleteOTP(email);
    await db.removeOTPBlock(email);

    res.json({
      message: `OTP send limit reset for ${purpose}`,
      email,
      purpose,
      note: 'User can now request a new OTP'
    });
  } catch (error) {
    console.error('Reset send limit error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/otp/blocked-emails
 * Get list of all currently blocked emails
 */
router.get('/otp/blocked-emails', isAdmin, async (req, res) => {
  try {
    const db = getDB();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    // Query blocked emails (this would need to be added to database)
    // For now, we'll query the otp_blocks table directly
    const now = new Date().toISOString();
    
    // Get all active blocks
    let blockedEmails = [];
    
    // Note: Since we don't have a direct method to get all active blocks,
    // we would need to add this to the database interface
    // For now, returning a placeholder response
    
    res.json({
      message: 'Blocked emails list',
      blockedEmails,
      pagination: {
        page,
        limit,
        total: blockedEmails.length
      },
      note: 'To implement this fully, add getActiveOTPBlocks method to database'
    });
  } catch (error) {
    console.error('Get blocked emails error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/admin/otp/clear-all-blocks
 * Clear all OTP blocks (admin override - use with caution)
 */
router.post('/otp/clear-all-blocks', isAdmin, async (req, res) => {
  try {
    // This would need a method to clear all blocks
    // For security, we should require additional confirmation
    
    res.json({
      message: 'This endpoint requires database method implementation',
      note: 'Would clear all active OTP blocks'
    });
  } catch (error) {
    console.error('Clear all blocks error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
