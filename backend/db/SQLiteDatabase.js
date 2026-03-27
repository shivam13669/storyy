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
          isSuspended INTEGER NOT NULL DEFAULT 0
        )
      `);

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

      // Create indexes
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_bookings_userId ON bookings(userId)`);
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_testimonials_userId ON testimonials(userId)`);

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
        `SELECT id, fullName, email, role, mobileNumber, countryCode, testimonialAllowed, isSuspended, signupDate FROM users WHERE id = ?`,
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
        `SELECT id, fullName, email, password, role, mobileNumber, countryCode, testimonialAllowed, isSuspended, signupDate FROM users WHERE LOWER(email) = ?`,
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
        signupDate: row[9]
      };
    } catch (error) {
      throw new Error(`Failed to get user by email: ${error.message}`);
    }
  }

  async getAllUsers() {
    try {
      const result = this.db.exec(
        `SELECT id, fullName, email, role, mobileNumber, countryCode, testimonialAllowed, isSuspended, signupDate FROM users ORDER BY id`
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
      signupDate: row[8]
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
}
