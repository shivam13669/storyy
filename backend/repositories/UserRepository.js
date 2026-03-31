import bcrypt from 'bcryptjs';
import { getDB } from '../db/index.js';

export class UserRepository {
  /**
   * Create a new user
   */
  static async create(fullName, email, password, mobileNumber, countryCode) {
    const db = getDB();

    // Check if email exists
    if (await db.emailExists(email)) {
      throw new Error('Email already registered');
    }

    // Check if mobile number exists
    if (await db.mobileNumberExists(mobileNumber)) {
      throw new Error('Mobile number already registered');
    }

    const user = await db.createUser({
      fullName,
      email,
      password,
      mobileNumber,
      countryCode,
      role: 'user',
      testimonialAllowed: 0,
      isSuspended: 0
    });

    return this._formatUserResponse(user);
  }

  /**
   * Get user by ID (without password)
   */
  static async getById(id) {
    const db = getDB();
    const user = await db.getUserById(id);

    if (!user) {
      throw new Error('User not found');
    }

    return this._formatUserResponse(user);
  }

  /**
   * Get user by email (with password for authentication)
   */
  static async getByEmail(email) {
    const db = getDB();
    const user = await db.getUserByEmail(email);

    if (!user) {
      return null;
    }

    return user;
  }

  /**
   * Get all users
   */
  static async getAll() {
    const db = getDB();
    const users = await db.getAllUsers();

    return users.map(user => this._formatUserResponse(user));
  }

  /**
   * Verify password for user
   */
  static async verifyPassword(hashedPassword, plainPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Hash password
   */
  static async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  /**
   * Update user
   */
  static async update(id, updates) {
    const db = getDB();

    // Hash password if being updated
    if (updates.password) {
      updates.password = await this.hashPassword(updates.password);
    }

    const user = await db.updateUser(id, updates);

    if (!user) {
      throw new Error('User not found');
    }

    return this._formatUserResponse(user);
  }

  /**
   * Delete user
   */
  static async delete(id) {
    const db = getDB();
    
    // Check if user exists and is not admin
    const user = await db.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.role === 'admin') {
      throw new Error('Cannot delete admin user');
    }

    await db.deleteUser(id);
    return true;
  }

  /**
   * Toggle testimonial permission
   */
  static async toggleTestimonialPermission(id) {
    const db = getDB();
    const user = await db.getUserById(id);

    if (!user) {
      throw new Error('User not found');
    }

    const newValue = !user.testimonialAllowed;
    await db.updateUser(id, { testimonialAllowed: newValue ? 1 : 0 });

    return newValue;
  }

  /**
   * Suspend user
   */
  static async suspend(id) {
    const db = getDB();
    const user = await db.getUserById(id);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role === 'admin') {
      throw new Error('Cannot suspend admin user');
    }

    await db.updateUser(id, { isSuspended: 1 });
    return true;
  }

  /**
   * Unsuspend user
   */
  static async unsuspend(id) {
    const db = getDB();
    const user = await db.getUserById(id);

    if (!user) {
      throw new Error('User not found');
    }

    await db.updateUser(id, { isSuspended: 0 });
    return true;
  }

  /**
   * Reset user password (admin function)
   */
  static async resetPassword(id, newPassword) {
    const db = getDB();
    const user = await db.getUserById(id);

    if (!user) {
      throw new Error('User not found');
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    await db.updateUser(id, { password: hashedPassword });

    return true;
  }

  /**
   * Change user password
   */
  static async changePassword(userId, oldPassword, newPassword) {
    const db = getDB();
    const user = await db.getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Need to get the password hash from database
    const userWithPassword = await db.getUserByEmail(user.email);

    if (!userWithPassword) {
      throw new Error('User not found');
    }

    const isValidPassword = await this.verifyPassword(userWithPassword.password, oldPassword);

    if (!isValidPassword) {
      throw new Error('Old password is incorrect');
    }

    if (oldPassword === newPassword) {
      throw new Error('New password must be different from old password');
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    await db.updateUser(userId, { password: hashedPassword });

    return true;
  }

  /**
   * Format user response (remove password and convert boolean fields)
   */
  static _formatUserResponse(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
