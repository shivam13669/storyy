import express from 'express';
import { UserRepository } from '../repositories/UserRepository.js';
import { sendOTPEmail } from '../services/emailService.js';
import { generateOTP, getOTPExpirationTime, verifyOTP } from '../utils/otpUtils.js';
import { getDB } from '../db/index.js';

const router = express.Router();
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

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
        signupDate: user.signupDate,
        phoneLastChangedAt: user.phoneLastChangedAt || null,
        gender: user.gender || null,
        dateOfBirth: user.dateOfBirth || null,
        nationality: user.nationality || null,
        maritalStatus: user.maritalStatus || null,
        anniversary: user.anniversary || null,
        state: user.state || null,
        district: user.district || null,
        passportNumber: user.passportNumber || null,
        passportExpiryDate: user.passportExpiryDate || null,
        passportIssuingCountry: user.passportIssuingCountry || null,
        panCardNumber: user.panCardNumber || null,
        documents: user.documents || null
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
 * Update user profile (fullName, personal info, and document details)
 */
router.patch('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      mobileNumber,
      countryCode,
      gender,
      dateOfBirth,
      nationality,
      maritalStatus,
      anniversary,
      state,
      district,
      passportNumber,
      passportExpiryDate,
      passportIssuingCountry,
      panCardNumber
    } = req.body;
    const updates = {};

    console.log(`🔄 Updating user ${id} with data:`, {
      fullName, gender, dateOfBirth, nationality, maritalStatus,
      anniversary, state, district, passportNumber, passportExpiryDate,
      passportIssuingCountry, panCardNumber
    });

    if (fullName !== undefined) {
      if (!fullName) {
        return res.status(400).json({ error: 'Full name is required' });
      }
      updates.fullName = fullName;
    }

    if (mobileNumber !== undefined || countryCode !== undefined) {
      if (!mobileNumber || !countryCode) {
        return res.status(400).json({ error: 'Mobile number and country code are required' });
      }

      const currentUser = await UserRepository.getById(parseInt(id));
      const normalizedMobileNumber = mobileNumber.trim();
      const normalizedCountryCode = countryCode.trim().toUpperCase();
      const isPhoneActuallyChanging =
        currentUser.mobileNumber !== normalizedMobileNumber || currentUser.countryCode !== normalizedCountryCode;

      if (isPhoneActuallyChanging) {
        if (currentUser.phoneLastChangedAt) {
          const lastChangedAt = new Date(currentUser.phoneLastChangedAt).getTime();
          if (Date.now() - lastChangedAt < THIRTY_DAYS_MS) {
            const daysRemaining = Math.ceil((THIRTY_DAYS_MS - (Date.now() - lastChangedAt)) / (24 * 60 * 60 * 1000));
            return res.status(403).json({
              error: `Phone number can be changed again after ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`
            });
          }
        }

        if (await getDB().mobileNumberExists(normalizedMobileNumber) && currentUser.mobileNumber !== normalizedMobileNumber) {
          return res.status(409).json({ error: 'Mobile number already registered' });
        }

        updates.mobileNumber = normalizedMobileNumber;
        updates.countryCode = normalizedCountryCode;

        const hadRealPhoneBefore = !!currentUser.mobileNumber && !currentUser.mobileNumber.startsWith('GOOGLE_');
        if (hadRealPhoneBefore) {
          updates.phoneLastChangedAt = new Date().toISOString();
        }
      }
    }

    // Handle general information fields
    if (gender !== undefined) updates.gender = gender;
    if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth;
    if (nationality !== undefined) updates.nationality = nationality;
    if (maritalStatus !== undefined) updates.maritalStatus = maritalStatus;
    if (anniversary !== undefined) updates.anniversary = anniversary;
    if (state !== undefined) updates.state = state;
    if (district !== undefined) updates.district = district;

    // Handle document fields
    if (passportNumber !== undefined) updates.passportNumber = passportNumber;
    if (passportExpiryDate !== undefined) updates.passportExpiryDate = passportExpiryDate;
    if (passportIssuingCountry !== undefined) updates.passportIssuingCountry = passportIssuingCountry;
    if (panCardNumber !== undefined) updates.panCardNumber = panCardNumber;

    // Handle documents array (convert to JSON string for storage)
    if (req.body.documents !== undefined) {
      updates.documents = req.body.documents ? JSON.stringify(req.body.documents) : null;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const user = await UserRepository.update(parseInt(id), updates);

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
 * PATCH /api/auth/user/:id/documents
 * Update user document details (passport, PAN, and documents array)
 */
router.patch('/user/:id/documents', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      passportNumber,
      passportExpiryDate,
      passportIssuingCountry,
      panCardNumber,
      documents
    } = req.body;
    const updates = {};

    // Handle document fields
    if (passportNumber !== undefined) updates.passportNumber = passportNumber;
    if (passportExpiryDate !== undefined) updates.passportExpiryDate = passportExpiryDate;
    if (passportIssuingCountry !== undefined) updates.passportIssuingCountry = passportIssuingCountry;
    if (panCardNumber !== undefined) updates.panCardNumber = panCardNumber;

    // Handle documents array (convert to JSON string for storage)
    if (documents !== undefined) {
      updates.documents = documents && documents.length > 0 ? JSON.stringify(documents) : null;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const user = await UserRepository.update(parseInt(id), updates);

    console.log(`✅ User documents updated: ${user.email}`);

    res.json({
      message: 'User documents updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user documents error:', error);

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
 * POST /api/auth/send-otp
 * Send OTP to email (for signup verification or password reset)
 * Body: { email, purpose: 'signup' | 'password-reset' }
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { email, purpose = 'signup', mobileNumber, countryCode } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailLower = email.toLowerCase();
    console.log(`📧 Sending OTP to: ${emailLower} for purpose: ${purpose}`);

    // If this is for signup, make sure the email/mobile aren't already registered
    if (purpose === 'signup') {
      if (!mobileNumber || !countryCode) {
        return res.status(400).json({ error: 'Mobile number and country code are required' });
      }

      if (await getDB().emailExists(emailLower)) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      if (await getDB().mobileNumberExists(mobileNumber)) {
        return res.status(409).json({ error: 'Mobile number already registered' });
      }
    }

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
        signupDate: user.signupDate,
        phoneLastChangedAt: user.phoneLastChangedAt || null,
        gender: user.gender || null,
        dateOfBirth: user.dateOfBirth || null,
        nationality: user.nationality || null,
        maritalStatus: user.maritalStatus || null,
        anniversary: user.anniversary || null,
        state: user.state || null,
        district: user.district || null,
        passportNumber: user.passportNumber || null,
        passportExpiryDate: user.passportExpiryDate || null,
        passportIssuingCountry: user.passportIssuingCountry || null,
        panCardNumber: user.panCardNumber || null,
        documents: user.documents || null
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
