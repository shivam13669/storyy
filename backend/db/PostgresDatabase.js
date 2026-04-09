import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import initSqlJs from 'sql.js';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { IDatabase } from './IDatabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../../story.db');

export class PostgresDatabase extends IDatabase {
  constructor() {
    super();
    this.pool = null;
  }

  async init() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is required');
    }

    const url = new URL(connectionString);
    const ssl = url.hostname.includes('supabase') ? { rejectUnauthorized: false } : undefined;

    this.pool = new Pool({
      connectionString,
      ssl,
      max: 20,
      min: 2,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      keepAlives: true,
      keepAlivesIdleTimeout: 30000,
    });

    await this._createTables();
    await this._ensureUsersColumnOrder();
    await this._migrateFromSQLiteIfNeeded();
    await this._initializeAdmin();

    console.log('✅ Connected to PostgreSQL database');
  }

  async _query(text, params = []) {
    return this.pool.query(text, params);
  }

  async _withClient(callback) {
    const client = await this.pool.connect();
    try {
      return await callback(client);
    } finally {
      client.release();
    }
  }

  _toBoolean(value) {
    return value === true || value === 1 || value === '1' || value === 'true';
  }

  _normalizeBooleanUpdate(key, value) {
    if (key === 'testimonialAllowed' || key === 'isSuspended' || key === 'isVisible') {
      return this._toBoolean(value);
    }

    return value;
  }

  _mapUserRow(row) {
    return {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      role: row.role,
      mobileNumber: row.mobile_number,
      countryCode: row.country_code,
      testimonialAllowed: row.testimonial_allowed,
      isSuspended: row.is_suspended,
      signupDate: row.signup_date,
      phoneLastChangedAt: row.phone_last_changed_at,
      gender: row.gender,
      dateOfBirth: row.date_of_birth,
      age: row.age,
      nationality: row.nationality,
      maritalStatus: row.marital_status,
      anniversary: row.anniversary,
      state: row.state,
      district: row.district,
      passportNumber: row.passport_number,
      passportExpiryDate: row.passport_expiry_date,
      passportIssuingCountry: row.passport_issuing_country,
      panCardNumber: row.pan_card_number,
      aadhaarCardNo: row.aadhaar_card_no,
      documents: row.documents,
    };
  }

  _mapBookingRow(row) {
    return {
      id: row.id,
      userId: row.user_id,
      tripName: row.trip_name,
      status: row.status,
      bookingDate: row.booking_date,
      tripDate: row.trip_date,
      details: row.details,
    };
  }

  _mapTestimonialRow(row) {
    return {
      id: row.id,
      userId: row.user_id,
      userName: row.user_name,
      email: row.email,
      tripName: row.trip_name,
      quote: row.quote,
      rating: row.rating,
      role: row.role,
      location: row.location,
      highlight: row.highlight,
      submittedDate: row.submitted_date,
      isVisible: row.is_visible,
    };
  }

  async _createTables() {
    await this._query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        mobile_number TEXT NOT NULL UNIQUE,
        country_code TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        signup_date TEXT NOT NULL,
        testimonial_allowed BOOLEAN NOT NULL DEFAULT FALSE,
        is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
        phone_last_changed_at TEXT,
        gender TEXT,
        date_of_birth TEXT,
        age INTEGER,
        nationality TEXT,
        marital_status TEXT,
        anniversary TEXT,
        state TEXT,
        district TEXT,
        passport_number TEXT,
        passport_expiry_date TEXT,
        passport_issuing_country TEXT,
        pan_card_number TEXT,
        aadhaar_card_no TEXT,
        documents TEXT
      )
    `);

    await this._query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_last_changed_at TEXT`);
    await this._query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT`);
    await this._query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth TEXT`);
    await this._query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER`);
    await this._query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS nationality TEXT`);
    await this._query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS marital_status TEXT`);
    await this._query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS anniversary TEXT`);
    await this._query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS state TEXT`);
    await this._query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS district TEXT`);
    await this._query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS passport_number TEXT`);
    await this._query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS passport_expiry_date TEXT`);
    await this._query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS passport_issuing_country TEXT`);
    await this._query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS pan_card_number TEXT`);
    await this._query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS aadhaar_card_no TEXT`);
    await this._query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS documents TEXT`);

    await this._query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        trip_name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        booking_date TEXT NOT NULL,
        trip_date TEXT NOT NULL,
        details TEXT
      )
    `);

    await this._query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        user_name TEXT NOT NULL,
        email TEXT NOT NULL,
        trip_name TEXT NOT NULL,
        quote TEXT NOT NULL,
        rating INTEGER NOT NULL,
        role TEXT,
        location TEXT,
        highlight TEXT,
        submitted_date TEXT NOT NULL,
        is_visible BOOLEAN NOT NULL DEFAULT TRUE
      )
    `);

    await this._query(`
      CREATE TABLE IF NOT EXISTS coupons (
        id SERIAL PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        discount INTEGER NOT NULL,
        discount_type TEXT NOT NULL,
        max_uses INTEGER NOT NULL,
        used_count INTEGER NOT NULL DEFAULT 0,
        expiry_date TEXT NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_date TEXT NOT NULL,
        applicable_packages TEXT NOT NULL
      )
    `);

    await this._query(`
      CREATE TABLE IF NOT EXISTS otp_verifications (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        otp TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

    await this._query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await this._query(`CREATE INDEX IF NOT EXISTS idx_users_mobile_number ON users(mobile_number)`);
    await this._query(`CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id)`);
    await this._query(`CREATE INDEX IF NOT EXISTS idx_testimonials_user_id ON testimonials(user_id)`);
    await this._query(`CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code)`);
    await this._query(`CREATE INDEX IF NOT EXISTS idx_otp_verifications_email ON otp_verifications(email)`);
  }

  async _ensureUsersColumnOrder() {
    const result = await this._query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users'
      ORDER BY ordinal_position
    `);

    const currentOrder = result.rows.map((row) => row.column_name);
    const desiredOrder = [
      'id',
      'full_name',
      'email',
      'password',
      'mobile_number',
      'country_code',
      'role',
      'signup_date',
      'testimonial_allowed',
      'is_suspended',
      'phone_last_changed_at',
      'gender',
      'date_of_birth',
      'age',
      'nationality',
      'marital_status',
      'anniversary',
      'state',
      'district',
      'passport_number',
      'passport_expiry_date',
      'passport_issuing_country',
      'pan_card_number',
      'aadhaar_card_no',
      'documents'
    ];

    const needsRebuild =
      currentOrder.length !== desiredOrder.length ||
      currentOrder.some((column, index) => column !== desiredOrder[index]);

    if (!needsRebuild) {
      return;
    }

    console.log('🔧 Rebuilding users table to place age between date_of_birth and nationality');

    await this._withClient(async (client) => {
      await client.query('BEGIN');
      try {
        await client.query('ALTER TABLE users RENAME TO users_old');

        await client.query(`
          CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            mobile_number TEXT NOT NULL UNIQUE,
            country_code TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            signup_date TEXT NOT NULL,
            testimonial_allowed BOOLEAN NOT NULL DEFAULT FALSE,
            is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
            phone_last_changed_at TEXT,
            gender TEXT,
            date_of_birth TEXT,
            age INTEGER,
            nationality TEXT,
            marital_status TEXT,
            anniversary TEXT,
            state TEXT,
            district TEXT,
            passport_number TEXT,
            passport_expiry_date TEXT,
            passport_issuing_country TEXT,
            pan_card_number TEXT,
            aadhaar_card_no TEXT,
            documents TEXT
          )
        `);

        await client.query(`
          INSERT INTO users (
            id, full_name, email, password, mobile_number, country_code, role, signup_date,
            testimonial_allowed, is_suspended, phone_last_changed_at, gender, date_of_birth,
            age, nationality, marital_status, anniversary, state, district, passport_number,
            passport_expiry_date, passport_issuing_country, pan_card_number, aadhaar_card_no, documents
          )
          SELECT
            id, full_name, email, password, mobile_number, country_code, role, signup_date,
            testimonial_allowed, is_suspended, phone_last_changed_at, gender, date_of_birth,
            age, nationality, marital_status, anniversary, state, district, passport_number,
            passport_expiry_date, passport_issuing_country, pan_card_number, aadhaar_card_no, documents
          FROM users_old
          ORDER BY id
        `);

        await client.query(`
          SELECT setval(
            pg_get_serial_sequence('users', 'id'),
            COALESCE((SELECT MAX(id) FROM users), 1),
            EXISTS (SELECT 1 FROM users)
          )
        `);

        await client.query('DROP TABLE users_old CASCADE');

        await client.query(`
          ALTER TABLE bookings
          ADD CONSTRAINT bookings_user_id_fkey
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        `);

        await client.query(`
          ALTER TABLE testimonials
          ADD CONSTRAINT testimonials_user_id_fkey
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        `);

        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    });
  }

  async _initializeAdmin() {
    const adminEmail = 'nitinmishra2202@gmail.com';
    const result = await this._query(`SELECT id FROM users WHERE LOWER(email) = $1`, [adminEmail.toLowerCase()]);

    if (result.rows.length > 0) {
      console.log('👤 Admin user already exists');
      return;
    }

    const adminPassword = 'stnt@stories123@';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await this._query(
      `INSERT INTO users (full_name, email, password, mobile_number, country_code, role, signup_date, testimonial_allowed, is_suspended)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      ['Nitin Mishra', adminEmail.toLowerCase(), hashedPassword, '0000000000', 'IN', 'admin', new Date().toISOString(), true, false]
    );

    console.log('👤 Admin user created successfully');
  }

  async _migrateFromSQLiteIfNeeded() {
    if (!fs.existsSync(dbPath)) {
      return;
    }

    const counts = await this._query(`
      SELECT
        (SELECT COUNT(*)::int FROM users) AS users_count,
        (SELECT COUNT(*)::int FROM bookings) AS bookings_count,
        (SELECT COUNT(*)::int FROM testimonials) AS testimonials_count
    `);

    const { users_count: usersCount, bookings_count: bookingsCount, testimonials_count: testimonialsCount } = counts.rows[0];

    if (usersCount > 0 || bookingsCount > 0 || testimonialsCount > 0) {
      return;
    }

    const sqlJs = await initSqlJs();
    const data = fs.readFileSync(dbPath);
    const sqliteDb = new sqlJs.Database(new Uint8Array(data));

    const sqliteQuery = (query) => {
      const result = sqliteDb.exec(query);
      if (!result || result.length === 0) {
        return [];
      }
      return result[0].values;
    };

    const users = sqliteQuery(`SELECT id, fullName, email, password, mobileNumber, countryCode, role, signupDate, testimonialAllowed, isSuspended FROM users ORDER BY id`);
    const bookings = sqliteQuery(`SELECT id, userId, tripName, status, bookingDate, tripDate, details FROM bookings ORDER BY id`);
    const testimonials = sqliteQuery(`SELECT id, userId, userName, email, tripName, quote, rating, role, location, highlight, submittedDate, isVisible FROM testimonials ORDER BY id`);

    await this._withClient(async (client) => {
      await client.query('BEGIN');
      try {
        for (const row of users) {
          await client.query(
            `INSERT INTO users (id, full_name, email, password, mobile_number, country_code, role, signup_date, testimonial_allowed, is_suspended)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              row[0],
              row[1],
              row[2].toLowerCase(),
              row[3],
              row[4],
              row[5],
              row[6],
              row[7],
              this._toBoolean(row[8]),
              this._toBoolean(row[9]),
            ]
          );
        }

        for (const row of bookings) {
          await client.query(
            `INSERT INTO bookings (id, user_id, trip_name, status, booking_date, trip_date, details)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [row[0], row[1], row[2], row[3], row[4], row[5], row[6]]
          );
        }

        for (const row of testimonials) {
          await client.query(
            `INSERT INTO testimonials (id, user_id, user_name, email, trip_name, quote, rating, role, location, highlight, submitted_date, is_visible)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [
              row[0],
              row[1],
              row[2],
              row[3],
              row[4],
              row[5],
              row[6],
              row[7],
              row[8],
              row[9],
              row[10],
              this._toBoolean(row[11]),
            ]
          );
        }

        await client.query(`SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1), false)`);
        await client.query(`SELECT setval(pg_get_serial_sequence('bookings', 'id'), COALESCE((SELECT MAX(id) FROM bookings), 1), false)`);
        await client.query(`SELECT setval(pg_get_serial_sequence('testimonials', 'id'), COALESCE((SELECT MAX(id) FROM testimonials), 1), false)`);

        await client.query('COMMIT');
        console.log(`📦 Migrated SQLite data from ${dbPath} to PostgreSQL`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    });

    sqliteDb.close();
  }

  async createUser(userData) {
    try {
      const {
        fullName,
        email,
        password,
        mobileNumber,
        countryCode,
        role = 'user',
        testimonialAllowed = false,
        isSuspended = false,
      } = userData;

      const emailLower = email.toLowerCase();
      const hashedPassword = await bcrypt.hash(password, 10);

      await this._query(
        `INSERT INTO users (full_name, email, password, mobile_number, country_code, role, signup_date, testimonial_allowed, is_suspended)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [fullName, emailLower, hashedPassword, mobileNumber, countryCode, role, new Date().toISOString(), this._toBoolean(testimonialAllowed), this._toBoolean(isSuspended)]
      );

      return this.getUserByEmail(emailLower);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async getUserById(id) {
    try {
      const result = await this._query(
        `SELECT id, full_name, email, role, mobile_number, country_code, testimonial_allowed, is_suspended, signup_date, phone_last_changed_at, gender, date_of_birth, age, nationality, marital_status, anniversary, state, district, passport_number, passport_expiry_date, passport_issuing_country, pan_card_number, aadhaar_card_no, documents FROM users WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return this._mapUserRow(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to get user by id: ${error.message}`);
    }
  }

  async getUserByEmail(email) {
    try {
      const result = await this._query(
        `SELECT id, full_name, email, password, role, mobile_number, country_code, testimonial_allowed, is_suspended, signup_date, phone_last_changed_at, gender, date_of_birth, age, nationality, marital_status, anniversary, state, district, passport_number, passport_expiry_date, passport_issuing_country, pan_card_number, aadhaar_card_no, documents FROM users WHERE LOWER(email) = $1`,
        [email.toLowerCase()]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        password: row.password,
        role: row.role,
        mobileNumber: row.mobile_number,
        countryCode: row.country_code,
        testimonialAllowed: row.testimonial_allowed,
        isSuspended: row.is_suspended,
        signupDate: row.signup_date,
        phoneLastChangedAt: row.phone_last_changed_at,
        gender: row.gender,
      dateOfBirth: row.date_of_birth,
      age: row.age,
      nationality: row.nationality,
        maritalStatus: row.marital_status,
        anniversary: row.anniversary,
        state: row.state,
        district: row.district,
        passportNumber: row.passport_number,
        passportExpiryDate: row.passport_expiry_date,
        passportIssuingCountry: row.passport_issuing_country,
        panCardNumber: row.pan_card_number,
        aadhaarCardNo: row.aadhaar_card_no,
        documents: row.documents,
      };
    } catch (error) {
      throw new Error(`Failed to get user by email: ${error.message}`);
    }
  }

  async getAllUsers() {
    try {
      const result = await this._query(
        `SELECT id, full_name, email, role, mobile_number, country_code, testimonial_allowed, is_suspended, signup_date, phone_last_changed_at, gender, date_of_birth, age, nationality, marital_status, anniversary, state, district, passport_number, passport_expiry_date, passport_issuing_country, pan_card_number, aadhaar_card_no, documents FROM users ORDER BY id`
      );

      return result.rows.map((row) => this._mapUserRow(row));
    } catch (error) {
      throw new Error(`Failed to get all users: ${error.message}`);
    }
  }

  async updateUser(id, updates) {
    try {
      const entries = Object.entries(updates);
      if (entries.length === 0) {
        return this.getUserById(id);
      }

      const fields = [];
      const values = [];

      entries.forEach(([key, value], index) => {
        const column = key
          .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
          .replace(/^id$/, 'id');
        fields.push(`${column} = $${index + 1}`);
        values.push(this._normalizeBooleanUpdate(key, value));
      });

      values.push(id);

      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${values.length}`;
      console.log(`📝 Executing query:`, query);
      console.log(`   Values:`, values);

      await this._query(query, values);
      console.log(`✅ User ${id} updated successfully`);
      return this.getUserById(id);
    } catch (error) {
      console.error(`❌ Error updating user ${id}:`, error.message);
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async deleteUser(id) {
    try {
      await this._query(`DELETE FROM users WHERE id = $1`, [id]);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async createBooking(bookingData) {
    try {
      const { userId, tripName, status = 'pending', bookingDate, tripDate, details } = bookingData;
      const result = await this._query(
        `INSERT INTO bookings (user_id, trip_name, status, booking_date, trip_date, details)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, user_id, trip_name, status, booking_date, trip_date, details`,
        [userId, tripName, status, bookingDate, tripDate, details]
      );

      return this._mapBookingRow(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to create booking: ${error.message}`);
    }
  }

  async getAllBookings() {
    try {
      const result = await this._query(
        `SELECT id, user_id, trip_name, status, booking_date, trip_date, details FROM bookings ORDER BY booking_date DESC`
      );

      return result.rows.map((row) => this._mapBookingRow(row));
    } catch (error) {
      throw new Error(`Failed to get all bookings: ${error.message}`);
    }
  }

  async getBookingsByUserId(userId) {
    try {
      const result = await this._query(
        `SELECT id, user_id, trip_name, status, booking_date, trip_date, details FROM bookings WHERE user_id = $1 ORDER BY booking_date DESC`,
        [userId]
      );

      return result.rows.map((row) => this._mapBookingRow(row));
    } catch (error) {
      throw new Error(`Failed to get bookings by user id: ${error.message}`);
    }
  }

  async deleteBooking(id) {
    try {
      await this._query(`DELETE FROM bookings WHERE id = $1`, [id]);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete booking: ${error.message}`);
    }
  }

  async createTestimonial(testimonialData) {
    try {
      const { userId, userName, email, tripName, quote, rating, role, location, highlight } = testimonialData;
      const result = await this._query(
        `INSERT INTO testimonials (user_id, user_name, email, trip_name, quote, rating, role, location, highlight, submitted_date, is_visible)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id, user_id, user_name, email, trip_name, quote, rating, role, location, highlight, submitted_date, is_visible`,
        [userId, userName, email, tripName, quote, rating, role, location, highlight, new Date().toISOString(), true]
      );

      return this._mapTestimonialRow(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to create testimonial: ${error.message}`);
    }
  }

  async getAllTestimonials() {
    try {
      const result = await this._query(
        `SELECT id, user_id, user_name, email, trip_name, quote, rating, role, location, highlight, submitted_date, is_visible FROM testimonials WHERE is_visible = TRUE ORDER BY submitted_date DESC`
      );

      return result.rows.map((row) => this._mapTestimonialRow(row));
    } catch (error) {
      throw new Error(`Failed to get all testimonials: ${error.message}`);
    }
  }

  async getTestimonialsByUserId(userId) {
    try {
      const result = await this._query(
        `SELECT id, user_id, user_name, email, trip_name, quote, rating, role, location, highlight, submitted_date, is_visible FROM testimonials WHERE user_id = $1 ORDER BY submitted_date DESC`,
        [userId]
      );

      return result.rows.map((row) => this._mapTestimonialRow(row));
    } catch (error) {
      throw new Error(`Failed to get testimonials by user id: ${error.message}`);
    }
  }

  async deleteTestimonial(id) {
    try {
      await this._query(`DELETE FROM testimonials WHERE id = $1`, [id]);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete testimonial: ${error.message}`);
    }
  }

  async updateTestimonial(id, updates) {
    try {
      const entries = Object.entries(updates);
      if (entries.length === 0) {
        return this.getTestimonialById(id);
      }

      const fields = [];
      const values = [];

      entries.forEach(([key, value], index) => {
        const column = key
          .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
          .replace(/^id$/, 'id');
        fields.push(`${column} = $${index + 1}`);
        values.push(this._normalizeBooleanUpdate(key, value));
      });

      values.push(id);

      await this._query(`UPDATE testimonials SET ${fields.join(', ')} WHERE id = $${values.length}`, values);
      return this.getTestimonialById(id);
    } catch (error) {
      throw new Error(`Failed to update testimonial: ${error.message}`);
    }
  }

  async getTestimonialById(id) {
    try {
      const result = await this._query(
        `SELECT id, user_id, user_name, email, trip_name, quote, rating, role, location, highlight, submitted_date, is_visible FROM testimonials WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return this._mapTestimonialRow(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to get testimonial by id: ${error.message}`);
    }
  }

  async toggleTestimonialVisibility(id) {
    try {
      const result = await this._query(`SELECT is_visible FROM testimonials WHERE id = $1`, [id]);

      if (result.rows.length === 0) {
        throw new Error('Testimonial not found');
      }

      const newValue = !result.rows[0].is_visible;
      await this._query(`UPDATE testimonials SET is_visible = $1 WHERE id = $2`, [newValue, id]);
      return newValue;
    } catch (error) {
      throw new Error(`Failed to toggle testimonial visibility: ${error.message}`);
    }
  }

  async emailExists(email) {
    try {
      const result = await this._query(`SELECT id FROM users WHERE LOWER(email) = $1`, [email.toLowerCase()]);
      return result.rows.length > 0;
    } catch (error) {
      throw new Error(`Failed to check email: ${error.message}`);
    }
  }

  async mobileNumberExists(mobileNumber) {
    try {
      const result = await this._query(`SELECT id FROM users WHERE mobile_number = $1`, [mobileNumber]);
      return result.rows.length > 0;
    } catch (error) {
      throw new Error(`Failed to check mobile number: ${error.message}`);
    }
  }

  // ============ OTP Verifications Operations ============

  async storeOTP(email, otp, expiresAt) {
    try {
      const emailLower = email.toLowerCase();
      // Delete existing OTP for this email if any
      await this._query(`DELETE FROM otp_verifications WHERE email = $1`, [emailLower]);

      // Insert new OTP
      await this._query(
        `INSERT INTO otp_verifications (email, otp, expires_at, created_at)
         VALUES ($1, $2, $3, $4)`,
        [emailLower, otp, expiresAt, new Date().toISOString()]
      );

      return { email: emailLower, otp, expiresAt };
    } catch (error) {
      throw new Error(`Failed to store OTP: ${error.message}`);
    }
  }

  async getOTP(email) {
    try {
      const emailLower = email.toLowerCase();
      const result = await this._query(
        `SELECT email, otp, expires_at FROM otp_verifications WHERE email = $1`,
        [emailLower]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        email: row.email,
        otp: row.otp,
        expiresAt: row.expires_at
      };
    } catch (error) {
      throw new Error(`Failed to get OTP: ${error.message}`);
    }
  }

  async deleteOTP(email) {
    try {
      const emailLower = email.toLowerCase();
      await this._query(`DELETE FROM otp_verifications WHERE email = $1`, [emailLower]);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete OTP: ${error.message}`);
    }
  }

  // ============ Coupons Operations ============

  _mapCouponRow(row) {
    return {
      id: row.id,
      code: row.code,
      discount: row.discount,
      discountType: row.discount_type,
      maxUses: row.max_uses,
      usedCount: row.used_count,
      expiryDate: row.expiry_date,
      isActive: row.is_active,
      createdDate: row.created_date,
      applicablePackages: row.applicable_packages,
    };
  }

  async createCoupon(couponData) {
    try {
      const { code, discount, discountType, maxUses, expiryDate, applicablePackages } = couponData;
      const result = await this._query(
        `INSERT INTO coupons (code, discount, discount_type, max_uses, used_count, expiry_date, is_active, created_date, applicable_packages)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, code, discount, discount_type, max_uses, used_count, expiry_date, is_active, created_date, applicable_packages`,
        [code.toUpperCase(), discount, discountType, maxUses, 0, expiryDate, true, new Date().toISOString(), applicablePackages]
      );

      return this._mapCouponRow(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to create coupon: ${error.message}`);
    }
  }

  async getAllCoupons() {
    try {
      const result = await this._query(
        `SELECT id, code, discount, discount_type, max_uses, used_count, expiry_date, is_active, created_date, applicable_packages FROM coupons ORDER BY created_date DESC`
      );

      return result.rows.map((row) => this._mapCouponRow(row));
    } catch (error) {
      throw new Error(`Failed to get all coupons: ${error.message}`);
    }
  }

  async getCouponByCode(code) {
    try {
      const result = await this._query(
        `SELECT id, code, discount, discount_type, max_uses, used_count, expiry_date, is_active, created_date, applicable_packages FROM coupons WHERE UPPER(code) = $1`,
        [code.toUpperCase()]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return this._mapCouponRow(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to get coupon by code: ${error.message}`);
    }
  }

  async updateCoupon(id, updates) {
    try {
      const entries = Object.entries(updates);
      if (entries.length === 0) {
        return this.getCouponById(id);
      }

      const fields = [];
      const values = [];

      entries.forEach(([key, value], index) => {
        const column = key
          .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
          .replace(/^id$/, 'id');
        fields.push(`${column} = $${index + 1}`);
        values.push(value);
      });

      values.push(id);

      await this._query(`UPDATE coupons SET ${fields.join(', ')} WHERE id = $${values.length}`, values);
      return this.getCouponById(id);
    } catch (error) {
      throw new Error(`Failed to update coupon: ${error.message}`);
    }
  }

  async deleteCoupon(id) {
    try {
      await this._query(`DELETE FROM coupons WHERE id = $1`, [id]);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete coupon: ${error.message}`);
    }
  }

  async getCouponById(id) {
    try {
      const result = await this._query(
        `SELECT id, code, discount, discount_type, max_uses, used_count, expiry_date, is_active, created_date, applicable_packages FROM coupons WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return this._mapCouponRow(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to get coupon by id: ${error.message}`);
    }
  }
}
