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
          nationality TEXT,
          maritalStatus TEXT,
          anniversary TEXT,
          state TEXT,
          district TEXT,
          passportNumber TEXT,
          passportExpiryDate TEXT,
          passportIssuingCountry TEXT,
          panCardNumber TEXT,
          documents TEXT
        )
      `);

      const userColumns = this.db.exec(`PRAGMA table_info(users)`);
      const columnNames = userColumns.length > 0 ? userColumns[0].values.map((column) => column[1]) : [];

      const requiredColumns = [
        'phoneLastChangedAt', 'gender', 'dateOfBirth', 'nationality', 'maritalStatus',
        'anniversary', 'state', 'district', 'passportNumber', 'passportExpiryDate',
        'passportIssuingCountry', 'panCardNumber', 'documents'
      ];

      for (const col of requiredColumns) {
        if (!columnNames.includes(col)) {
          this.db.run(`ALTER TABLE users ADD COLUMN ${col} TEXT`);
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
          createdAt TEXT NOT NULL
        )
      `);

      // Create indexes
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_bookings_userId ON bookings(userId)`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_testimonials_userId ON testimonials(userId)`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code)`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_otp_verifications_email ON otp_verifications(email)`);

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
        `SELECT id, fullName, email, role, mobileNumber, countryCode, testimonialAllowed, isSuspended, signupDate, phoneLastChangedAt, gender, dateOfBirth, nationality, maritalStatus, anniversary, state, district, passportNumber, passportExpiryDate, passportIssuingCountry, panCardNumber, documents FROM users WHERE id = ?`,
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
        `SELECT id, fullName, email, password, role, mobileNumber, countryCode, testimonialAllowed, isSuspended, signupDate, phoneLastChangedAt, gender, dateOfBirth, nationality, maritalStatus, anniversary, state, district, passportNumber, passportExpiryDate, passportIssuingCountry, panCardNumber, documents FROM users WHERE LOWER(email) = ?`,
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
        documents: row[22]
      };
    } catch (error) {
      throw new Error(`Failed to get user by email: ${error.message}`);
    }
  }

  async getAllUsers() {
    try {
      const result = this.db.exec(
        `SELECT id, fullName, email, role, mobileNumber, countryCode, testimonialAllowed, isSuspended, signupDate, phoneLastChangedAt, gender, dateOfBirth, nationality, maritalStatus, anniversary, state, district, passportNumber, passportExpiryDate, passportIssuingCountry, panCardNumber, documents FROM users ORDER BY id`
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
      nationality: row[12] || null,
      maritalStatus: row[13] || null,
      anniversary: row[14] || null,
      state: row[15] || null,
      district: row[16] || null,
      passportNumber: row[17] || null,
      passportExpiryDate: row[18] || null,
      passportIssuingCountry: row[19] || null,
      panCardNumber: row[20] || null,
      documents: row[21] || null
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

  async storeOTP(email, otp, expiresAt) {
    try {
      const emailLower = email.toLowerCase();
      // Delete existing OTP for this email if any
      this.db.run(`DELETE FROM otp_verifications WHERE email = ?`, [emailLower]);

      // Insert new OTP
      this.db.run(
        `INSERT INTO otp_verifications (email, otp, expiresAt, createdAt)
         VALUES (?, ?, ?, ?)`,
        [emailLower, otp, expiresAt, new Date().toISOString()]
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
        `SELECT email, otp, expiresAt FROM otp_verifications WHERE email = ?`,
        [emailLower]
      );

      if (!result || result.length === 0 || result[0].values.length === 0) {
        return null;
      }

      const row = result[0].values[0];
      return {
        email: row[0],
        otp: row[1],
        expiresAt: row[2]
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
