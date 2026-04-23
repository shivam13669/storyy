/**
 * Database Interface
 * This interface defines all database operations.
 * Any implementation (SQLite, PostgreSQL, etc.) must implement these methods.
 */

export class IDatabase {
  /**
   * Initialize the database connection/setup
   */
  async init() {
    throw new Error('Method not implemented');
  }

  // ============ Users Operations ============
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    throw new Error('Method not implemented');
  }

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User object or null
   */
  async getUserById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object or null
   */
  async getUserByEmail(email) {
    throw new Error('Method not implemented');
  }

  /**
   * Get all users
   * @returns {Promise<Array>} Array of users
   */
  async getAllUsers() {
    throw new Error('Method not implemented');
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(id, updates) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise<boolean>} Success
   */
  async deleteUser(id) {
    throw new Error('Method not implemented');
  }

  // ============ Bookings Operations ============
  /**
   * Create a booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise<Object>} Created booking
   */
  async createBooking(bookingData) {
    throw new Error('Method not implemented');
  }

  /**
   * Get all bookings
   * @returns {Promise<Array>} Array of bookings
   */
  async getAllBookings() {
    throw new Error('Method not implemented');
  }

  /**
   * Get bookings by user ID
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of bookings
   */
  async getBookingsByUserId(userId) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete booking
   * @param {number} id - Booking ID
   * @returns {Promise<boolean>} Success
   */
  async deleteBooking(id) {
    throw new Error('Method not implemented');
  }

  // ============ Testimonials Operations ============
  /**
   * Create a testimonial
   * @param {Object} testimonialData - Testimonial data
   * @returns {Promise<Object>} Created testimonial
   */
  async createTestimonial(testimonialData) {
    throw new Error('Method not implemented');
  }

  /**
   * Get all testimonials
   * @returns {Promise<Array>} Array of testimonials
   */
  async getAllTestimonials() {
    throw new Error('Method not implemented');
  }

  /**
   * Get testimonials by user ID
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of testimonials
   */
  async getTestimonialsByUserId(userId) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete testimonial
   * @param {number} id - Testimonial ID
   * @returns {Promise<boolean>} Success
   */
  async deleteTestimonial(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Update testimonial
   * @param {number} id - Testimonial ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated testimonial
   */
  async updateTestimonial(id, updates) {
    throw new Error('Method not implemented');
  }

  /**
   * Get testimonial by ID
   * @param {number} id - Testimonial ID
   * @returns {Promise<Object|null>} Testimonial object or null
   */
  async getTestimonialById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Toggle testimonial visibility
   * @param {number} id - Testimonial ID
   * @returns {Promise<boolean>} New visibility value
   */
  async toggleTestimonialVisibility(id) {
    throw new Error('Method not implemented');
  }

  // ============ Check Operations ============
  /**
   * Check if email already exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} True if exists
   */
  async emailExists(email) {
    throw new Error('Method not implemented');
  }

  /**
   * Check if mobile number already exists
   * @param {string} mobileNumber - Mobile number to check
   * @returns {Promise<boolean>} True if exists
   */
  async mobileNumberExists(mobileNumber) {
    throw new Error('Method not implemented');
  }

  // ============ OTP Verifications Operations ============
  /**
   * Store OTP for email
   * @param {string} email - Email address
   * @param {string} otp - OTP code
   * @param {string} expiresAt - Expiration timestamp
   * @returns {Promise<Object>} Stored OTP data
   */
  async storeOTP(email, otp, expiresAt) {
    throw new Error('Method not implemented');
  }

  /**
   * Get OTP for email
   * @param {string} email - Email address
   * @returns {Promise<Object|null>} OTP data or null
   */
  async getOTP(email) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete OTP for email
   * @param {string} email - Email address
   * @returns {Promise<boolean>} Success
   */
  async deleteOTP(email) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete all expired OTPs (older than current time)
   * @returns {Promise<number>} Number of deleted OTPs
   */
  async deleteExpiredOTPs() {
    throw new Error('Method not implemented');
  }

  /**
   * Record an OTP verification attempt
   * @param {string} email - Email address
   * @param {number} otpId - OTP record ID
   * @param {string} purpose - Purpose of OTP (signup, password-reset)
   * @param {boolean} isCorrect - Whether the attempt was correct
   * @returns {Promise<boolean>} Success
   */
  async recordOTPAttempt(email, otpId, purpose, isCorrect = false) {
    throw new Error('Method not implemented');
  }

  /**
   * Get recent OTP verification attempts
   * @param {string} email - Email address
   * @param {number} otpId - OTP record ID
   * @param {number} limit - Number of records to retrieve
   * @returns {Promise<Array>} Array of attempt records
   */
  async getRecentOTPAttempts(email, otpId, limit = 10) {
    throw new Error('Method not implemented');
  }

  /**
   * Get OTP send history for a specific purpose
   * @param {string} email - Email address
   * @param {string} purpose - Purpose of OTP (signup, password-reset)
   * @param {number} hours - Time window in hours
   * @returns {Promise<Array>} Array of send history records
   */
  async getOTPSendHistory(email, purpose, hours = 24) {
    throw new Error('Method not implemented');
  }

  /**
   * Add an OTP block for an email
   * @param {string} email - Email address
   * @param {string} blockReason - Reason for the block
   * @param {number} blockDurationMinutes - Duration of the block in minutes
   * @returns {Promise<boolean>} Success
   */
  async addOTPBlock(email, blockReason, blockDurationMinutes = 15) {
    throw new Error('Method not implemented');
  }

  /**
   * Get active OTP block for an email
   * @param {string} email - Email address
   * @returns {Promise<Object|null>} Block record or null
   */
  async getActiveOTPBlock(email) {
    throw new Error('Method not implemented');
  }

  /**
   * Remove OTP block for an email
   * @param {string} email - Email address
   * @returns {Promise<boolean>} Success
   */
  async removeOTPBlock(email) {
    throw new Error('Method not implemented');
  }

  /**
   * Get count of failed attempt blocks in the last 24 hours
   * @param {string} email - Email address
   * @returns {Promise<number>} Count of blocks
   */
  async getFailedAttemptBlocksInDay(email) {
    throw new Error('Method not implemented');
  }
}
