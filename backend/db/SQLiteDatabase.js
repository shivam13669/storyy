import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import initSqlJs from 'sql.js';
import { IDatabase } from './IDatabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../story.db');

export class SQLiteDatabase extends IDatabase {
  constructor() {
    super();
    this.db = null;
    this.SQL = null;
  }

  /**
   * Initialize database and create tables
   */
  async init() {
    try {
      this.SQL = await initSqlJs();

      // Load existing database or create new one
      if (fs.existsSync(dbPath)) {
        const data = fs.readFileSync(dbPath);
        const uint8Array = new Uint8Array(data);
        this.db = new this.SQL.Database(uint8Array);
        console.log(`📁 Loaded database from: ${dbPath}`);
      } else {
        this.db = new this.SQL.Database();
        console.log(`📁 Creating new database at: ${dbPath}`);
      }

      // Create tables
      this._createTables();

      // Initialize admin user
      await this._initializeAdmin();

      console.log('✅ Connected to SQLite database');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Create database tables
   */
  _createTables() {
    try {
      // Users table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          fullName TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          mobileNumber TEXT NOT NULL,
          countryCode TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'user',
          signupDate TEXT NOT NULL,
          testimonialAllowed INTEGER NOT NULL DEFAULT 0,
          isSuspended INTEGER NOT NULL DEFAULT 0,
          phoneLastChangedAt TEXT,
          gender TEXT,
          dateOfBirth TEXT,
          age INTEGER,
          nationality TEXT,
          maritalStatus TEXT,
          anniversary TEXT,
          state TEXT,
          district TEXT,
          passportNumber TEXT,
          passportExpiryDate TEXT,
          passportIssuingCountry TEXT,
          panCardNumber TEXT,
          aadhaarCardNo TEXT,
          documents TEXT
        )
      `);

      const userColumns = this.db.exec(`PRAGMA table_info(users)`);
      const columnNames = userColumns.length > 0 ? userColumns[0].values.map((column) => column[1]) : [];

      const requiredColumns = [
        'phoneLastChangedAt', 'gender', 'dateOfBirth', 'age', 'nationality', 'maritalStatus',
        'anniversary', 'state', 'district', 'passportNumber', 'passportExpiryDate',
        'passportIssuingCountry', 'panCardNumber', 'aadhaarCardNo', 'documents'
      ];

      for (const col of requiredColumns) {
        if (!columnNames.includes(col)) {
          const columnType = col === 'age' ? 'INTEGER' : 'TEXT';
          this.db.run(`ALTER TABLE users ADD COLUMN ${col} ${columnType}`);
        }
      }

      // Bookings table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          tripName TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          bookingDate TEXT NOT NULL,
          tripDate TEXT NOT NULL,
          details TEXT,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `);

      // Testimonials table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS testimonials (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          userName TEXT NOT NULL,
          email TEXT NOT NULL,
          tripName TEXT NOT NULL,
          quote TEXT NOT NULL,
          rating INTEGER NOT NULL,
          role TEXT,
          location TEXT,
          highlight TEXT,
          submittedDate TEXT NOT NULL,
          isVisible INTEGER NOT NULL DEFAULT 1,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `);

      // Coupons table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS coupons (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          discount INTEGER NOT NULL,
          discountType TEXT NOT NULL,
          maxUses INTEGER NOT NULL,
          usedCount INTEGER NOT NULL DEFAULT 0,
          expiryDate TEXT NOT NULL,
          isActive INTEGER NOT NULL DEFAULT 1,
          createdDate TEXT NOT NULL,
          applicablePackages TEXT NOT NULL
        )
      `);

      // OTP Verifications table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS otp_verifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          otp TEXT NOT NULL,
          expiresAt TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          purpose TEXT NOT NULL DEFAULT 'signup'
        )
      `);

      // OTP Send History table - tracks all OTP send attempts per email per purpose
      this.db.run(`
        CREATE TABLE IF NOT EXISTS otp_send_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL,
          purpose TEXT NOT NULL,
          sentAt TEXT NOT NULL,
          FOREIGN KEY (email) REFERENCES users(email)
        )
      `);

      // OTP Attempts table - tracks wrong OTP verification attempts
      this.db.run(`
        CREATE TABLE IF NOT EXISTS otp_attempts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL,
          otp_id INTEGER NOT NULL,
          purpose TEXT NOT NULL,
          attemptedAt TEXT NOT NULL,
          isCorrect INTEGER NOT NULL DEFAULT 0,
          FOREIGN KEY (email) REFERENCES users(email)
        )
      `);

      // OTP Blocks table - tracks email blocks due to abuse
      this.db.run(`
        CREATE TABLE IF NOT EXISTS otp_blocks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL,
          blockReason TEXT NOT NULL,
          blockedAt TEXT NOT NULL,
          unblockAt TEXT NOT NULL,
          isActive INTEGER NOT NULL DEFAULT 1,
          FOREIGN KEY (email) REFERENCES users(email)
        )
      `);

      // Create indexes
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_bookings_userId ON bookings(userId)`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_testimonials_userId ON testimonials(userId)`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code)`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_otp_verifications_email ON otp_verifications(email)`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_otp_send_history_email_purpose ON otp_send_history(email, purpose)`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_otp_attempts_email ON otp_attempts(email)`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_otp_blocks_email ON otp_blocks(email)`);

      this._save();
    } catch (error) {
      console.error('Error creating tables:', error);
    }
  }

  /**
   * Save database to file
   */
  _save() {
    try {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(dbPath, buffer);
    } catch (error) {
      console.error('Failed to save database:', error);
    }
  }

  /**
   * Initialize admin user
   */
  async _initializeAdmin() {
    try {
      const adminEmail = 'nitinmishra2202@gmail.com';

      const result = this.db.exec(`SELECT * FROM users WHERE email = ?`, [adminEmail]);
      if (!result || result.length === 0 || result[0].values.length === 0) {
        const adminPassword = 'stnt@stories123@';
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        this.db.run(
          `INSERT INTO users (fullName, email, password, mobileNumber, countryCode, role, signupDate, testimonialAllowed, isSuspended)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          ['Nitin Mishra', adminEmail, hashedPassword, '0000000000', 'IN', 'admin', new Date().toISOString(), 1, 0]
        );

        this._save();
        console.log('👤 Admin user created successfully');
      } else {
        console.log('👤 Admin user already exists');
      }
    } catch (error) {
      console.error('Error initializing admin:', error);
      throw error;
    }
  }

  // ============ Users Operations ============

  async createUser(userData) {
    try {
      const {
        fullName,
        email,
        password,
        mobileNumber,
        countryCode,
        role = 'user',
        testimonialAllowed = 0,
        isSuspended = 0
      } = userData;

      const emailLower = email.toLowerCase();
      const hashedPassword = await bcrypt.hash(password, 10);

      this.db.run(
        `INSERT INTO users (fullName, email, password, mobileNumber, countryCode, role, signupDate, testimonialAllowed, isSuspended)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [fullName, emailLower, hashedPassword, mobileNumber, countryCode, role, new Date().toISOString(), testimonialAllowed, isSuspended]
      );

      this._save();

      return this.getUserByEmail(emailLower);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async getUserById(id) {
    try {
      const result = this.db.exec(
        `SELECT id, fullName, email, role, mobileNumber, countryCode, testimonialAllowed, isSuspended, signupDate, phoneLastChangedAt, gender, dateOfBirth, age, nationality, maritalStatus, anniversary, state, district, passportNumber, passportExpiryDate, passportIssuingCountry, panCardNumber, aadhaarCardNo, documents FROM users WHERE id = ?`,
        [id]
      );

      if (!result || result.length === 0 || result[0].values.length === 0) {
        return null;
      }

      return this._mapUserRow(result[0].values[0]);
    } catch (error) {
      throw new Error(`Failed to get user by id: ${error.message}`);
    }
  }

  async getUserByEmail(email) {
    try {
      const emailLower = email.toLowerCase();
      const result = this.db.exec(
        `SELECT id, fullName, email, password, role, mobileNumber, countryCode, testimonialAllowed, isSuspended, signupDate, phoneLastChangedAt, gender, dateOfBirth, age, nationality, maritalStatus, anniversary, state, district, passportNumber, passportExpiryDate, passportIssuingCountry, panCardNumber, aadhaarCardNo, documents FROM users WHERE LOWER(email) = ?`,
        [emailLower]
      );

      if (!result || result.length === 0 || result[0].values.length === 0) {
        return null;
      }

      const row = result[0].values[0];
      return {
        id: row[0],
        fullName: row[1],
        email: row[2],
        password: row[3],
        role: row[4],
        mobileNumber: row[5],
        countryCode: row[6],
        testimonialAllowed: row[7] === 1,
        isSuspended: row[8] === 1,
        signupDate: row[9],
        phoneLastChangedAt: row[10],
        gender: row[11],
        dateOfBirth: row[12],
        nationality: row[13],
        maritalStatus: row[14],
        anniversary: row[15],
        state: row[16],
        district: row[17],
        passportNumber: row[18],
        passportExpiryDate: row[19],
        passportIssuingCountry: row[20],
        panCardNumber: row[21],
        aadhaarCardNo: row[22],
        documents: row[23]
      };
    } catch (error) {
      throw new Error(`Failed to get user by email: ${error.message}`);
    }
  }

  async getAllUsers() {
    try {
      const result = this.db.exec(
        `SELECT id, fullName, email, role, mobileNumber, countryCode, testimonialAllowed, isSuspended, signupDate, phoneLastChangedAt, gender, dateOfBirth, age, nationality, maritalStatus, anniversary, state, district, passportNumber, passportExpiryDate, passportIssuingCountry, panCardNumber, aadhaarCardNo, documents FROM users ORDER BY id`
      );

      if (!result || result.length === 0) {
        return [];
      }

      return result[0].values.map(row => this._mapUserRow(row));
    } catch (error) {
      throw new Error(`Failed to get all users: ${error.message}`);
    }
  }

  async updateUser(id, updates) {
    try {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }

      values.push(id);

      this.db.run(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      this._save();

      return this.getUserById(id);
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async deleteUser(id) {
    try {
      // Delete bookings first
      this.db.run(`DELETE FROM bookings WHERE userId = ?`, [id]);

      // Delete testimonials
      this.db.run(`DELETE FROM testimonials WHERE userId = ?`, [id]);

      // Delete user
      this.db.run(`DELETE FROM users WHERE id = ?`, [id]);

      this._save();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  _mapUserRow(row) {
    return {
      id: row[0],
      fullName: row[1],
      email: row[2],
      role: row[3],
      mobileNumber: row[4],
      countryCode: row[5],
      testimonialAllowed: row[6] === 1,
      isSuspended: row[7] === 1,
      signupDate: row[8],
      phoneLastChangedAt: row[9] || null,
      gender: row[10] || null,
      dateOfBirth: row[11] || null,
      age: row[12] ?? null,
      nationality: row[13] || null,
      maritalStatus: row[14] || null,
      anniversary: row[15] || null,
      state: row[16] || null,
      district: row[17] || null,
      passportNumber: row[18] || null,
      passportExpiryDate: row[19] || null,
      passportIssuingCountry: row[20] || null,
      panCardNumber: row[21] || null,
      aadhaarCardNo: row[22] || null,
      documents: row[23] || null
    };
  }

  // ============ Bookings Operations ============

  async createBooking(bookingData) {
    try {
      const { userId, tripName, status = 'pending', bookingDate, tripDate, details } = bookingData;

      this.db.run(
        `INSERT INTO bookings (userId, tripName, status, bookingDate, tripDate, details)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, tripName, status, bookingDate, tripDate, details]
      );

      this._save();

      // Get last inserted ID and return the booking
      const result = this.db.exec(`SELECT last_insert_rowid() as id`);
      const bookingId = result[0].values[0][0];

      return this._getBookingById(bookingId);
    } catch (error) {
      throw new Error(`Failed to create booking: ${error.message}`);
    }
  }

  async getAllBookings() {
    try {
      const result = this.db.exec(
        `SELECT id, userId, tripName, status, bookingDate, tripDate, details FROM bookings ORDER BY bookingDate DESC`
      );

      if (!result || result.length === 0) {
        return [];
      }

      return result[0].values.map(row => this._mapBookingRow(row));
    } catch (error) {
      throw new Error(`Failed to get all bookings: ${error.message}`);
    }
  }

  async getBookingsByUserId(userId) {
    try {
      const result = this.db.exec(
        `SELECT id, userId, tripName, status, bookingDate, tripDate, details FROM bookings WHERE userId = ? ORDER BY bookingDate DESC`,
        [userId]
      );

      if (!result || result.length === 0) {
        return [];
      }

      return result[0].values.map(row => this._mapBookingRow(row));
    } catch (error) {
      throw new Error(`Failed to get bookings by user id: ${error.message}`);
    }
  }

  async deleteBooking(id) {
    try {
      this.db.run(`DELETE FROM bookings WHERE id = ?`, [id]);
      this._save();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete booking: ${error.message}`);
    }
  }

  _getBookingById(id) {
    const result = this.db.exec(
      `SELECT id, userId, tripName, status, bookingDate, tripDate, details FROM bookings WHERE id = ?`,
      [id]
    );

    if (!result || result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    return this._mapBookingRow(result[0].values[0]);
  }

  _mapBookingRow(row) {
    return {
      id: row[0],
      userId: row[1],
      tripName: row[2],
      status: row[3],
      bookingDate: row[4],
      tripDate: row[5],
      details: row[6]
    };
  }

  // ============ Testimonials Operations ============

  async createTestimonial(testimonialData) {
    try {
      const { userId, userName, email, tripName, quote, rating, role, location, highlight } = testimonialData;

      this.db.run(
        `INSERT INTO testimonials (userId, userName, email, tripName, quote, rating, role, location, highlight, submittedDate, isVisible)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, userName, email, tripName, quote, rating, role, location, highlight, new Date().toISOString(), 1]
      );

      this._save();

      const result = this.db.exec(`SELECT last_insert_rowid() as id`);
      const testimonialId = result[0].values[0][0];

      return this._getTestimonialById(testimonialId);
    } catch (error) {
      throw new Error(`Failed to create testimonial: ${error.message}`);
    }
  }

  async getAllTestimonials() {
    try {
      const result = this.db.exec(
        `SELECT id, userId, userName, email, tripName, quote, rating, role, location, highlight, submittedDate, isVisible FROM testimonials WHERE isVisible = 1 ORDER BY submittedDate DESC`
      );

      if (!result || result.length === 0) {
        return [];
      }

      return result[0].values.map(row => this._mapTestimonialRow(row));
    } catch (error) {
      throw new Error(`Failed to get all testimonials: ${error.message}`);
    }
  }

  async getTestimonialsByUserId(userId) {
    try {
      const result = this.db.exec(
        `SELECT id, userId, userName, email, tripName, quote, rating, role, location, highlight, submittedDate, isVisible FROM testimonials WHERE userId = ? ORDER BY submittedDate DESC`,
        [userId]
      );

      if (!result || result.length === 0) {
        return [];
      }

      return result[0].values.map(row => this._mapTestimonialRow(row));
    } catch (error) {
      throw new Error(`Failed to get testimonials by user id: ${error.message}`);
    }
  }

  async deleteTestimonial(id) {
    try {
      this.db.run(`DELETE FROM testimonials WHERE id = ?`, [id]);
      this._save();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete testimonial: ${error.message}`);
    }
  }

  async updateTestimonial(id, updates) {
    try {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }

      values.push(id);

      this.db.run(
        `UPDATE testimonials SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      this._save();

      return this._getTestimonialById(id);
    } catch (error) {
      throw new Error(`Failed to update testimonial: ${error.message}`);
    }
  }

  _getTestimonialById(id) {
    const result = this.db.exec(
      `SELECT id, userId, userName, email, tripName, quote, rating, role, location, highlight, submittedDate, isVisible FROM testimonials WHERE id = ?`,
      [id]
    );

    if (!result || result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    return this._mapTestimonialRow(result[0].values[0]);
  }

  async getTestimonialById(id) {
    try {
      const result = this.db.exec(
        `SELECT id, userId, userName, email, tripName, quote, rating, role, location, highlight, submittedDate, isVisible FROM testimonials WHERE id = ?`,
        [id]
      );

      if (!result || result.length === 0 || result[0].values.length === 0) {
        return null;
      }

      return this._mapTestimonialRow(result[0].values[0]);
    } catch (error) {
      throw new Error(`Failed to get testimonial by id: ${error.message}`);
    }
  }

  async toggleTestimonialVisibility(id) {
    try {
      const result = this.db.exec(
        `SELECT isVisible FROM testimonials WHERE id = ?`,
        [id]
      );

      if (!result || result.length === 0 || result[0].values.length === 0) {
        throw new Error('Testimonial not found');
      }

      const currentValue = result[0].values[0][0];
      const newValue = currentValue === 1 ? 0 : 1;

      this.db.run(
        `UPDATE testimonials SET isVisible = ? WHERE id = ?`,
        [newValue, id]
      );

      this._save();
      return newValue === 1;
    } catch (error) {
      throw new Error(`Failed to toggle testimonial visibility: ${error.message}`);
    }
  }

  _mapTestimonialRow(row) {
    return {
      id: row[0],
      userId: row[1],
      userName: row[2],
      email: row[3],
      tripName: row[4],
      quote: row[5],
      rating: row[6],
      role: row[7],
      location: row[8],
      highlight: row[9],
      submittedDate: row[10],
      isVisible: row[11] === 1
    };
  }

  // ============ Check Operations ============

  async emailExists(email) {
    try {
      const emailLower = email.toLowerCase();
      const result = this.db.exec(
        `SELECT id FROM users WHERE LOWER(email) = ?`,
        [emailLower]
      );

      return result && result.length > 0 && result[0].values.length > 0;
    } catch (error) {
      throw new Error(`Failed to check email: ${error.message}`);
    }
  }

  async mobileNumberExists(mobileNumber) {
    try {
      const result = this.db.exec(
        `SELECT id FROM users WHERE mobileNumber = ?`,
        [mobileNumber]
      );

      return result && result.length > 0 && result[0].values.length > 0;
    } catch (error) {
      throw new Error(`Failed to check mobile number: ${error.message}`);
    }
  }

  // ============ OTP Verifications Operations ============

  async storeOTP(email, otp, expiresAt, purpose = 'signup') {
    try {
      const emailLower = email.toLowerCase();
      // Delete existing OTP for this email if any
      this.db.run(`DELETE FROM otp_verifications WHERE email = ?`, [emailLower]);

      // Insert new OTP
      this.db.run(
        `INSERT INTO otp_verifications (email, otp, expiresAt, createdAt, purpose)
         VALUES (?, ?, ?, ?, ?)`,
        [emailLower, otp, expiresAt, new Date().toISOString(), purpose]
      );

      // Record in send history
      this.db.run(
        `INSERT INTO otp_send_history (email, purpose, sentAt)
         VALUES (?, ?, ?)`,
        [emailLower, purpose, new Date().toISOString()]
      );

      this._save();
      return { email: emailLower, otp, expiresAt };
    } catch (error) {
      throw new Error(`Failed to store OTP: ${error.message}`);
    }
  }

  async getOTP(email) {
    try {
      const emailLower = email.toLowerCase();
      const result = this.db.exec(
        `SELECT id, email, otp, expiresAt, purpose FROM otp_verifications WHERE email = ?`,
        [emailLower]
      );

      if (!result || result.length === 0 || result[0].values.length === 0) {
        return null;
      }

      const row = result[0].values[0];
      return {
        id: row[0],
        email: row[1],
        otp: row[2],
        expiresAt: row[3],
        purpose: row[4] || 'signup'
      };
    } catch (error) {
      throw new Error(`Failed to get OTP: ${error.message}`);
    }
  }

  async deleteOTP(email) {
    try {
      const emailLower = email.toLowerCase();
      this.db.run(`DELETE FROM otp_verifications WHERE email = ?`, [emailLower]);
      this._save();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete OTP: ${error.message}`);
    }
  }

  async deleteExpiredOTPs() {
    try {
      const now = new Date().toISOString();
      const stmt = this.db.prepare(`DELETE FROM otp_verifications WHERE expiresAt < ?`);
      stmt.run([now]);
      this._save();
      // Return the number of rows deleted
      const result = this.db.exec(`SELECT changes() as count`);
      return result[0]?.values[0]?.[0] || 0;
    } catch (error) {
      throw new Error(`Failed to delete expired OTPs: ${error.message}`);
    }
  }

  // ============ OTP Tracking Operations ============

  async recordOTPAttempt(email, otpId, purpose, isCorrect = false) {
    try {
      const emailLower = email.toLowerCase();
      this.db.run(
        `INSERT INTO otp_attempts (email, otp_id, purpose, attemptedAt, isCorrect)
         VALUES (?, ?, ?, ?, ?)`,
        [emailLower, otpId, purpose, new Date().toISOString(), isCorrect ? 1 : 0]
      );
      this._save();
      return true;
    } catch (error) {
      throw new Error(`Failed to record OTP attempt: ${error.message}`);
    }
  }

  async getRecentOTPAttempts(email, otpId, limit = 10) {
    try {
      const emailLower = email.toLowerCase();
      const result = this.db.exec(
        `SELECT id, email, otp_id, purpose, attemptedAt, isCorrect FROM otp_attempts
         WHERE email = ? AND otp_id = ? ORDER BY attemptedAt DESC LIMIT ?`,
        [emailLower, otpId, limit]
      );

      if (!result || result.length === 0) {
        return [];
      }

      return result[0].values.map(row => ({
        id: row[0],
        email: row[1],
        otpId: row[2],
        purpose: row[3],
        attemptedAt: row[4],
        isCorrect: row[5] === 1
      }));
    } catch (error) {
      throw new Error(`Failed to get OTP attempts: ${error.message}`);
    }
  }

  async getOTPSendHistory(email, purpose, hours = 24) {
    try {
      const emailLower = email.toLowerCase();
      const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
      const result = this.db.exec(
        `SELECT id, email, purpose, sentAt FROM otp_send_history
         WHERE email = ? AND purpose = ? AND sentAt > ? ORDER BY sentAt DESC`,
        [emailLower, purpose, cutoffTime]
      );

      if (!result || result.length === 0) {
        return [];
      }

      return result[0].values.map(row => ({
        id: row[0],
        email: row[1],
        purpose: row[2],
        sentAt: row[3]
      }));
    } catch (error) {
      throw new Error(`Failed to get OTP send history: ${error.message}`);
    }
  }

  async clearOTPSendHistory(email, purpose) {
    try {
      const emailLower = email.toLowerCase();
      console.log(`🗑️  Clearing OTP send history for ${emailLower} (${purpose})`);

      this.db.run(
        `DELETE FROM otp_send_history WHERE email = ? AND purpose = ?`,
        [emailLower, purpose]
      );
      this._save();

      console.log(`✅ Cleared OTP send history for ${emailLower} (${purpose})`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to clear OTP send history: ${error.message}`);
      throw new Error(`Failed to clear OTP send history: ${error.message}`);
    }
  }

  async addOTPBlock(email, blockReason, blockDurationMinutes = 15) {
    try {
      const emailLower = email.toLowerCase();
      const blockedAt = new Date().toISOString();
      const unblockAt = new Date(Date.now() + blockDurationMinutes * 60 * 1000).toISOString();

      this.db.run(
        `INSERT INTO otp_blocks (email, blockReason, blockedAt, unblockAt, isActive)
         VALUES (?, ?, ?, ?, ?)`,
        [emailLower, blockReason, blockedAt, unblockAt, 1]
      );
      this._save();
      return true;
    } catch (error) {
      throw new Error(`Failed to add OTP block: ${error.message}`);
    }
  }

  async getActiveOTPBlock(email) {
    try {
      const emailLower = email.toLowerCase();
      const now = new Date().toISOString();
      const result = this.db.exec(
        `SELECT id, email, blockReason, blockedAt, unblockAt FROM otp_blocks
         WHERE email = ? AND isActive = 1 AND unblockAt > ? ORDER BY unblockAt DESC LIMIT 1`,
        [emailLower, now]
      );

      if (!result || result.length === 0 || result[0].values.length === 0) {
        return null;
      }

      const row = result[0].values[0];
      return {
        id: row[0],
        email: row[1],
        blockReason: row[2],
        blockedAt: row[3],
        unblockAt: row[4]
      };
    } catch (error) {
      throw new Error(`Failed to get active OTP block: ${error.message}`);
    }
  }

  async removeOTPBlock(email) {
    try {
      const emailLower = email.toLowerCase();
      this.db.run(
        `UPDATE otp_blocks SET isActive = 0 WHERE email = ? AND isActive = 1`,
        [emailLower]
      );
      this._save();
      return true;
    } catch (error) {
      throw new Error(`Failed to remove OTP block: ${error.message}`);
    }
  }

  async getFailedAttemptBlocksInDay(email) {
    try {
      const emailLower = email.toLowerCase();
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const result = this.db.exec(
        `SELECT COUNT(*) as count FROM otp_blocks
         WHERE email = ? AND blockReason LIKE '%wrong%' AND blockedAt > ?`,
        [emailLower, oneDayAgo]
      );

      if (!result || result.length === 0) {
        return 0;
      }

      return result[0].values[0][0];
    } catch (error) {
      throw new Error(`Failed to get failed attempt blocks: ${error.message}`);
    }
  }

  // ============ Coupons Operations ============

  async createCoupon(couponData) {
    try {
      const { code, discount, discountType, maxUses, expiryDate, applicablePackages } = couponData;

      this.db.run(
        `INSERT INTO coupons (code, discount, discountType, maxUses, usedCount, expiryDate, isActive, createdDate, applicablePackages)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [code.toUpperCase(), discount, discountType, maxUses, 0, expiryDate, 1, new Date().toISOString(), applicablePackages]
      );

      this._save();

      const result = this.db.exec(`SELECT last_insert_rowid() as id`);
      const couponId = result[0].values[0][0];

      return this._getCouponById(couponId);
    } catch (error) {
      throw new Error(`Failed to create coupon: ${error.message}`);
    }
  }

  async getAllCoupons() {
    try {
      const result = this.db.exec(
        `SELECT id, code, discount, discountType, maxUses, usedCount, expiryDate, isActive, createdDate, applicablePackages FROM coupons ORDER BY createdDate DESC`
      );

      if (!result || result.length === 0) {
        return [];
      }

      return result[0].values.map(row => this._mapCouponRow(row));
    } catch (error) {
      throw new Error(`Failed to get all coupons: ${error.message}`);
    }
  }

  async getCouponByCode(code) {
    try {
      const result = this.db.exec(
        `SELECT id, code, discount, discountType, maxUses, usedCount, expiryDate, isActive, createdDate, applicablePackages FROM coupons WHERE UPPER(code) = ?`,
        [code.toUpperCase()]
      );

      if (!result || result.length === 0 || result[0].values.length === 0) {
        return null;
      }

      return this._mapCouponRow(result[0].values[0]);
    } catch (error) {
      throw new Error(`Failed to get coupon by code: ${error.message}`);
    }
  }

  async updateCoupon(id, updates) {
    try {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }

      values.push(id);

      this.db.run(
        `UPDATE coupons SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      this._save();

      return this._getCouponById(id);
    } catch (error) {
      throw new Error(`Failed to update coupon: ${error.message}`);
    }
  }

  async deleteCoupon(id) {
    try {
      this.db.run(`DELETE FROM coupons WHERE id = ?`, [id]);
      this._save();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete coupon: ${error.message}`);
    }
  }

  _getCouponById(id) {
    const result = this.db.exec(
      `SELECT id, code, discount, discountType, maxUses, usedCount, expiryDate, isActive, createdDate, applicablePackages FROM coupons WHERE id = ?`,
      [id]
    );

    if (!result || result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    return this._mapCouponRow(result[0].values[0]);
  }

  _mapCouponRow(row) {
    return {
      id: row[0],
      code: row[1],
      discount: row[2],
      discountType: row[3],
      maxUses: row[4],
      usedCount: row[5],
      expiryDate: row[6],
      isActive: row[7] === 1,
      createdDate: row[8],
      applicablePackages: row[9]
    };
  }
}
