import express from 'express';
import { UserRepository } from '../repositories/UserRepository.js';

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
    const { userId } = req.headers;
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

export default router;
