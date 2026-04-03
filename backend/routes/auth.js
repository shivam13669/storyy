import express from 'express';
import { UserRepository } from '../repositories/UserRepository.js';
import { sendOTPEmail } from '../services/emailService.js';
import { generateOTP, getOTPExpirationTime, verifyOTP } from '../utils/otpUtils.js';
import { getDB } from '../db/index.js';

const router = express.Router();

/**
 * POST /api/auth/signup
 * Register a new user
 */
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password, mobileNumber, countryCode } = req.body;

    // Validate input
    if (!fullName || !email || !password || !mobileNumber || !countryCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create user through repository
    const user = await UserRepository.create(fullName, email, password, mobileNumber, countryCode);

    console.log(`✅ User created: ${email}`);

    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error('Signup error:', error);

    if (error.message.includes('already registered') || error.message.includes('already registered')) {
      return res.status(409).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const emailLower = email.toLowerCase();
    console.log(`🔍 Login attempt for email: ${emailLower}`);

    // Get user by email (includes password for verification)
    const user = await UserRepository.getByEmail(emailLower);

    if (!user) {
      console.log(`❌ User not found: ${emailLower}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log(`✅ User found: ${emailLower}`);

    // Check if user is suspended
    if (user.isSuspended) {
      return res.status(403).json({ error: 'Your account has been suspended' });
    }

    // Verify password
    console.log(`🔐 Verifying password for: ${emailLower}`);
    const isValidPassword = await UserRepository.verifyPassword(user.password, password);

    if (!isValidPassword) {
      console.log(`❌ Password verification failed for: ${emailLower}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log(`✅ Password verified for: ${emailLower}`);

    // Return user data (without password)
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        mobileNumber: user.mobileNumber,
        countryCode: user.countryCode,
        testimonialAllowed: user.testimonialAllowed === 1,
        signupDate: user.signupDate
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/auth/user/:id
 * Get user by ID
 */
router.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserRepository.getById(parseInt(id));

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);

    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/auth/user/:id
 * Update user profile (fullName, mobileNumber, countryCode)
 */
router.patch('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, mobileNumber, countryCode } = req.body;

    // Validate input - at least one field is required
    if (!fullName && !mobileNumber && !countryCode) {
      return res.status(400).json({ error: 'At least one field is required for update' });
    }

    // If updating mobile number, check for duplicates
    if (mobileNumber) {
      const db = getDB();
      const userId = parseInt(id);
      const user = await UserRepository.getById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if mobile number already exists (excluding current user)
      const mobileExists = await db.mobileNumberExists(mobileNumber);
      if (mobileExists && user.mobileNumber !== mobileNumber) {
        return res.status(409).json({ error: 'Mobile number already registered' });
      }

      // Both mobileNumber and countryCode required together
      if (!countryCode) {
        return res.status(400).json({ error: 'Country code is required when updating mobile number' });
      }
    }

    // Prepare update object
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    if (countryCode) updateData.countryCode = countryCode;

    // Update user
    const user = await UserRepository.update(parseInt(id), updateData);

    console.log(`✅ User updated: ${user.email}`);

    res.json({
      message: 'User profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);

    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/auth/users
 * Get all users (admin endpoint)
 */
router.get('/users', async (req, res) => {
  try {
    const users = await UserRepository.getAll();
    res.json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/auth/users/:id/toggle-testimonial
 * Toggle testimonial permission for a user
 */
router.post('/users/:id/toggle-testimonial', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const testimonialAllowed = await UserRepository.toggleTestimonialPermission(userId);

    res.json({ message: 'Testimonial permission toggled', testimonialAllowed });
  } catch (error) {
    console.error('Toggle testimonial permission error:', error);

    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/auth/users/:id/suspend
 * Suspend a user
 */
router.post('/users/:id/suspend', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    await UserRepository.suspend(userId);

    res.json({ message: 'User suspended' });
  } catch (error) {
    console.error('Suspend user error:', error);

    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }

    if (error.message.includes('Cannot suspend')) {
      return res.status(403).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/auth/users/:id/unsuspend
 * Unsuspend a user
 */
router.post('/users/:id/unsuspend', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    await UserRepository.unsuspend(userId);

    res.json({ message: 'User unsuspended' });
  } catch (error) {
    console.error('Unsuspend user error:', error);

    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/auth/users/:id
 * Delete a user
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    await UserRepository.delete(userId);

    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);

    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }

    if (error.message.includes('Cannot delete')) {
      return res.status(403).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/auth/users/:id/reset-password
 * Reset user password (admin function)
 */
router.post('/users/:id/reset-password', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { password } = req.body;

    await UserRepository.resetPassword(userId, password);

    res.json({ message: 'Password reset' });
  } catch (error) {
    console.error('Reset password error:', error);

    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }

    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/auth/change-password
 * Change user password
 */
router.post('/change-password', async (req, res) => {
  try {
    const userId = req.headers.userid;
    const { oldPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old password and new password required' });
    }

    await UserRepository.changePassword(parseInt(userId), oldPassword, newPassword);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);

    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }

    if (error.message.includes('incorrect') || error.message.includes('different')) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/auth/check-duplicate
 * Check if email or mobile number already exists
 * Body: { email, mobileNumber }
 */
router.post('/check-duplicate', async (req, res) => {
  try {
    const { email, mobileNumber } = req.body;

    // Validate input
    if (!email && !mobileNumber) {
      return res.status(400).json({ error: 'Email or mobile number is required' });
    }

    const db = getDB();
    const errors = [];

    // Check if email exists
    if (email) {
      const emailLower = email.toLowerCase();
      const emailExists = await db.emailExists(emailLower);
      if (emailExists) {
        errors.push('Email already registered');
      }
    }

    // Check if mobile exists
    if (mobileNumber) {
      const mobileExists = await db.mobileNumberExists(mobileNumber);
      if (mobileExists) {
        errors.push('Mobile number already registered');
      }
    }

    if (errors.length > 0) {
      return res.status(409).json({ errors });
    }

    res.json({
      message: 'Email and mobile number are available',
      available: true
    });
  } catch (error) {
    console.error('Check duplicate error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/auth/send-otp
 * Send OTP to email (for signup verification or password reset)
 * Body: { email, purpose: 'signup' | 'password-reset' }
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { email, purpose = 'signup' } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailLower = email.toLowerCase();
    console.log(`📧 Sending OTP to: ${emailLower} for purpose: ${purpose}`);

    // If this is for password reset, verify email exists
    if (purpose === 'password-reset') {
      const user = await UserRepository.getByEmail(emailLower);
      if (!user) {
        return res.status(404).json({ error: 'This email doesn\'t associated to any account' });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpirationTime();

    // Store OTP in database
    const db = getDB();
    await db.storeOTP(emailLower, otp, expiresAt);

    // Send OTP via email
    await sendOTPEmail(emailLower, otp);

    res.json({
      message: 'OTP sent successfully',
      email: emailLower,
      expiresIn: '5 minutes'
    });
  } catch (error) {
    console.error('Send OTP error:', error);

    if (error.message.includes('Failed to send OTP email')) {
      return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
    }

    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verify OTP code (for signup or password reset)
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const emailLower = email.toLowerCase();
    console.log(`🔐 Verifying OTP for: ${emailLower}`);

    // Get stored OTP from database
    const db = getDB();
    const storedOTPData = await db.getOTP(emailLower);

    if (!storedOTPData) {
      return res.status(400).json({ error: 'No OTP found for this email. Please request a new one.' });
    }

    // Verify OTP
    const verificationResult = verifyOTP(otp, storedOTPData.otp, storedOTPData.expiresAt);

    if (!verificationResult.success) {
      return res.status(400).json({ error: verificationResult.message });
    }

    // Delete OTP after successful verification
    await db.deleteOTP(emailLower);

    console.log(`✅ OTP verified for: ${emailLower}`);

    res.json({
      message: 'OTP verified successfully',
      email: emailLower,
      verified: true
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/auth/reset-password-with-email
 * Reset password by email (after OTP verification for forgot password flow)
 */
router.post('/reset-password-with-email', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    const emailLower = email.toLowerCase();

    // Get user by email
    const user = await UserRepository.getByEmail(emailLower);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Reset password
    await UserRepository.resetPassword(user.id, newPassword);

    console.log(`✅ Password reset for: ${emailLower}`);

    res.json({
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);

    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }

    if (error.message.includes('must be at least')) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/auth/google
 * Handle Google OAuth login/signup
 */
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Google credential required' });
    }

    // Decode the JWT token from Google
    // The credential is a JWT token from Google
    const parts = credential.split('.');
    if (parts.length !== 3) {
      return res.status(400).json({ error: 'Invalid Google credential' });
    }

    // Decode the payload (parts[1])
    let googleData;
    try {
      const decoded = Buffer.from(parts[1], 'base64').toString('utf-8');
      googleData = JSON.parse(decoded);
    } catch (e) {
      return res.status(400).json({ error: 'Failed to decode Google credential' });
    }

    console.log(`🔍 Google login attempt for email: ${googleData.email}`);

    // Use UserRepository to find or create user
    const user = await UserRepository.googleLogin(googleData);

    console.log(`✅ Google login successful for: ${googleData.email}`);

    res.json({
      message: 'Google login successful',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        mobileNumber: user.mobileNumber,
        countryCode: user.countryCode,
        testimonialAllowed: user.testimonialAllowed === 1,
        signupDate: user.signupDate
      }
    });
  } catch (error) {
    console.error('Google login error:', error);

    if (error.message.includes('suspended')) {
      return res.status(403).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

export default router;
