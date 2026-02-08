import express from 'express';
import bcrypt from 'bcryptjs';
import { getDB } from '../db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', '..', 'story.db');

const router = express.Router();

// Helper to save database after mutations
function saveDatabase() {
  try {
    const db = getDB();
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  } catch (error) {
    console.error('Failed to save database:', error);
  }
}

// Helper to escape SQL strings
function escapeSQL(str) {
  return str.replace(/'/g, "''");
}

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password, mobileNumber, countryCode } = req.body;
    const db = getDB();

    // Validate input
    if (!fullName || !email || !password || !mobileNumber || !countryCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if email already exists
    const emailLower = email.toLowerCase();
    const existingResult = db.exec(`SELECT id FROM users WHERE LOWER(email) = LOWER('${escapeSQL(emailLower)}')`);
    if (existingResult && existingResult.length > 0 && existingResult[0].values.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Check if mobile number already exists
    const mobileResult = db.exec(`SELECT id FROM users WHERE mobileNumber = '${escapeSQL(mobileNumber)}'`);
    if (mobileResult && mobileResult.length > 0 && mobileResult[0].values.length > 0) {
      return res.status(409).json({ error: 'Phone number already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    try {
      db.run(
        `INSERT INTO users (fullName, email, password, mobileNumber, countryCode, role, signupDate, testimonialAllowed, isSuspended)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [fullName, emailLower, hashedPassword, mobileNumber, countryCode, 'user', new Date().toISOString(), 0, 0]
      );

      // Save database immediately after insert
      saveDatabase();
      console.log(`✅ User created: ${emailLower}`);
    } catch (insertError) {
      console.error('Insert error:', insertError);
      return res.status(400).json({ error: 'Failed to create user: ' + insertError.message });
    }

    // Get the created user
    const userResult = db.exec(`SELECT id, fullName, email, role, mobileNumber, countryCode, testimonialAllowed, signupDate FROM users WHERE LOWER(email) = LOWER('${escapeSQL(emailLower)}')`);
    const user = userResult && userResult.length > 0 && userResult[0].values.length > 0
      ? {
          id: userResult[0].values[0][0],
          fullName: userResult[0].values[0][1],
          email: userResult[0].values[0][2],
          role: userResult[0].values[0][3],
          mobileNumber: userResult[0].values[0][4],
          countryCode: userResult[0].values[0][5],
          testimonialAllowed: userResult[0].values[0][6],
          signupDate: userResult[0].values[0][7]
        }
      : null;

    res.status(201).json({
      message: 'User created successfully',
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
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDB();

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const emailLower = email.toLowerCase();
    console.log(`🔍 Login attempt for email: ${emailLower}`);

    const userResult = db.exec(`SELECT * FROM users WHERE LOWER(email) = LOWER('${escapeSQL(emailLower)}')`);

    if (!userResult || userResult.length === 0 || userResult[0].values.length === 0) {
      console.log(`❌ User not found: ${emailLower}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log(`✅ User found: ${emailLower}`);

    const userRow = userResult[0].values[0];
    const user = {
      id: userRow[0],
      fullName: userRow[1],
      email: userRow[2],
      password: userRow[3],
      mobileNumber: userRow[4],
      countryCode: userRow[5],
      role: userRow[6],
      signupDate: userRow[7],
      testimonialAllowed: userRow[8],
      isSuspended: userRow[9]
    };

    // Check if user is suspended
    if (user.isSuspended) {
      return res.status(403).json({ error: 'Your account has been suspended' });
    }

    // Verify password
    console.log(`🔐 Verifying password for: ${emailLower}`);
    const isValidPassword = await bcrypt.compare(password, user.password);

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

// Get user by ID (optional - for session verification)
router.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const userResult = db.exec(`SELECT id, fullName, email, role, mobileNumber, countryCode, testimonialAllowed, signupDate FROM users WHERE id = ${parseInt(id)}`);

    if (!userResult || userResult.length === 0 || userResult[0].values.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userRow = userResult[0].values[0];
    res.json({
      user: {
        id: userRow[0],
        fullName: userRow[1],
        email: userRow[2],
        role: userRow[3],
        mobileNumber: userRow[4],
        countryCode: userRow[5],
        testimonialAllowed: userRow[6] === 1,
        signupDate: userRow[7]
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all users (for admin dashboard)
router.get('/users', async (req, res) => {
  try {
    const db = getDB();
    const result = db.exec(`SELECT id, fullName, email, role, mobileNumber, countryCode, testimonialAllowed, isSuspended, signupDate FROM users ORDER BY id`);

    const users = result && result.length > 0 ? result[0].values.map(row => ({
      id: row[0],
      fullName: row[1],
      email: row[2],
      role: row[3],
      mobileNumber: row[4],
      countryCode: row[5],
      testimonialAllowed: row[6] === 1,
      isSuspended: row[7] === 1,
      signupDate: row[8]
    })) : [];

    res.json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Toggle testimonial permission
router.post('/users/:id/toggle-testimonial', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const db = getDB();

    const userResult = db.exec(`SELECT testimonialAllowed FROM users WHERE id = ${userId}`);
    if (!userResult || userResult.length === 0 || userResult[0].values.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentValue = userResult[0].values[0][0];
    const newValue = currentValue === 1 ? 0 : 1;

    db.run(`UPDATE users SET testimonialAllowed = ${newValue} WHERE id = ${userId}`);
    saveDatabase();

    res.json({ message: 'Testimonial permission toggled', testimonialAllowed: newValue === 1 });
  } catch (error) {
    console.error('Toggle testimonial permission error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Suspend user
router.post('/users/:id/suspend', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const db = getDB();

    const userResult = db.exec(`SELECT role FROM users WHERE id = ${userId}`);
    if (!userResult || userResult.length === 0 || userResult[0].values.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const role = userResult[0].values[0][0];
    if (role === 'admin') {
      return res.status(403).json({ error: 'Cannot suspend admin user' });
    }

    db.run(`UPDATE users SET isSuspended = 1 WHERE id = ${userId}`);
    saveDatabase();

    res.json({ message: 'User suspended' });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Unsuspend user
router.post('/users/:id/unsuspend', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const db = getDB();

    const userResult = db.exec(`SELECT id FROM users WHERE id = ${userId}`);
    if (!userResult || userResult.length === 0 || userResult[0].values.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.run(`UPDATE users SET isSuspended = 0 WHERE id = ${userId}`);
    saveDatabase();

    res.json({ message: 'User unsuspended' });
  } catch (error) {
    console.error('Unsuspend user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const db = getDB();

    const userResult = db.exec(`SELECT role FROM users WHERE id = ${userId}`);
    if (!userResult || userResult.length === 0 || userResult[0].values.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const role = userResult[0].values[0][0];
    if (role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin user' });
    }

    // Delete user's bookings first
    db.run(`DELETE FROM bookings WHERE userId = ${userId}`);

    // Delete user's testimonials
    db.run(`DELETE FROM testimonials WHERE userId = ${userId}`);

    // Delete user
    db.run(`DELETE FROM users WHERE id = ${userId}`);

    saveDatabase();

    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user password (for admin to reset user password)
router.post('/users/:id/reset-password', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { password } = req.body;
    const db = getDB();

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const userResult = db.exec(`SELECT id FROM users WHERE id = ${userId}`);
    if (!userResult || userResult.length === 0 || userResult[0].values.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(`UPDATE users SET password = '${escapeSQL(hashedPassword)}' WHERE id = ${userId}`);
    saveDatabase();

    res.json({ message: 'Password reset' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Change user password (user changes their own password)
router.post('/change-password', async (req, res) => {
  try {
    const { userId } = req.headers;
    const { oldPassword, newPassword } = req.body;
    const db = getDB();

    // For browser-based auth, we need userId from request
    // This endpoint should be called by authenticated users
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old password and new password required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const userResult = db.exec(`SELECT password FROM users WHERE id = ${parseInt(userId)}`);
    if (!userResult || userResult.length === 0 || userResult[0].values.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = userResult[0].values[0][0];
    const isValidPassword = await bcrypt.compare(oldPassword, hashedPassword);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ error: 'New password must be different from old password' });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    db.run(`UPDATE users SET password = '${escapeSQL(newHashedPassword)}' WHERE id = ${parseInt(userId)}`);
    saveDatabase();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
