// Database service using SQLite3 (sql.js - works in browser)
import bcrypt from 'bcryptjs';

type Database = any;

export interface User {
  id: number;
  fullName: string;
  email: string;
  password: string; // hashed
  mobileNumber: string;
  countryCode: string;
  role: 'user' | 'admin';
  signupDate: string;
  testimonialAllowed: boolean;
  isSuspended: boolean;
}

export interface Booking {
  id: number;
  userId: number;
  tripName: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  bookingDate: string;
  tripDate: string;
  details?: string;
}

export interface Testimonial {
  id: number;
  userId: number;
  userName: string;
  email: string;
  tripName: string;
  quote: string;
  rating: number;
  role?: string;
  location?: string;
  highlight?: string;
  submittedDate: string;
  isVisible: boolean;
}

let dbInstance: Database | null = null;
let SQL: any = null;

const STORAGE_KEY = 'storiesbyfoot_db';

export async function initDB(): Promise<Database> {
  if (dbInstance) return dbInstance;

  try {
    // Initialize SQL.js
    if (!SQL) {
      let initSqlJs: any = null;

      // Try dynamic import first
      try {
        const sqlModule: any = await import('sql.js');
        if (typeof sqlModule.default === 'function') {
          initSqlJs = sqlModule.default;
        } else if (typeof sqlModule === 'function') {
          initSqlJs = sqlModule;
        }
      } catch (importErr) {
        console.warn('Dynamic import failed, will load from CDN');
      }

      // If dynamic import failed or module is empty, load from CDN
      if (!initSqlJs) {
        // Load sql.js from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/sql-wasm.js';
        script.async = true;

        initSqlJs = await new Promise<any>((resolve, reject) => {
          script.onload = () => {
            // @ts-ignore - sql.js is loaded globally
            if (typeof window.initSqlJs === 'function') {
              // @ts-ignore
              resolve(window.initSqlJs);
            } else {
              reject(new Error('sql.js CDN loaded but initSqlJs not found'));
            }
          };
          script.onerror = () => reject(new Error('Failed to load sql.js from CDN'));
          document.head.appendChild(script);
        });
      }

      if (typeof initSqlJs !== 'function') {
        throw new Error('initSqlJs is not a function');
      }

      // Initialize with WASM file location
      SQL = await initSqlJs({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/${file}`,
      });
    }

    // Try to load existing database from localStorage
    const savedDb = localStorage.getItem(STORAGE_KEY);
    if (savedDb) {
      const uint8Array = new Uint8Array(JSON.parse(savedDb));
      dbInstance = new SQL.Database(uint8Array);
    } else {
      // Create new database
      dbInstance = new SQL.Database();
      // Create tables
      createTables();
    }

    // Initialize admin user if not exists
    await initializeAdmin();

    // Save database periodically
    saveDatabase();

    return dbInstance;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

function createTables() {
  if (!dbInstance) return;

  // Users table
  dbInstance.run(`
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
  dbInstance.run(`
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
  dbInstance.run(`
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
  dbInstance.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  dbInstance.run(`CREATE INDEX IF NOT EXISTS idx_bookings_userId ON bookings(userId)`);
  dbInstance.run(`CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)`);
  dbInstance.run(`CREATE INDEX IF NOT EXISTS idx_testimonials_userId ON testimonials(userId)`);
  dbInstance.run(`CREATE INDEX IF NOT EXISTS idx_testimonials_visible ON testimonials(isVisible)`);

  saveDatabase();
}

function saveDatabase() {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Array.from(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buffer));
  } catch (error) {
    console.error('Failed to save database:', error);
  }
}

async function initializeAdmin() {
  if (!dbInstance) return;

  const adminEmail = 'nitinmishra2202@gmail.com';
  
  try {
    const result = dbInstance.exec(`SELECT * FROM users WHERE email = '${adminEmail.replace(/'/g, "''")}'`);
    if (result.length === 0 || result[0].values.length === 0) {
      const adminPassword = 'stnt@stories123@';
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      dbInstance.run(
        `INSERT INTO users (id, fullName, email, password, mobileNumber, countryCode, role, signupDate, testimonialAllowed, isSuspended) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [1, 'Nitin Mishra', adminEmail, hashedPassword, '0000000000', 'IN', 'admin', new Date().toISOString(), 1, 0]
      );
      saveDatabase();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.warn('Admin initialization warning:', error);
  }
}

// Helper function to convert SQL result to object
function sqlToUser(row: any[]): User {
  return {
    id: row[0],
    fullName: row[1],
    email: row[2],
    password: row[3],
    mobileNumber: row[4],
    countryCode: row[5],
    role: row[6] as 'user' | 'admin',
    signupDate: row[7],
    testimonialAllowed: row[8] === 1,
    isSuspended: row[9] === 1,
  };
}

function sqlToBooking(row: any[]): Booking {
  return {
    id: row[0],
    userId: row[1],
    tripName: row[2],
    status: row[3] as 'confirmed' | 'pending' | 'cancelled' | 'completed',
    bookingDate: row[4],
    tripDate: row[5],
    details: row[6] || undefined,
  };
}

function sqlToTestimonial(row: any[]): Testimonial {
  return {
    id: row[0],
    userId: row[1],
    userName: row[2],
    email: row[3],
    tripName: row[4],
    quote: row[5],
    rating: row[6],
    role: row[7] || undefined,
    location: row[8] || undefined,
    highlight: row[9] || undefined,
    submittedDate: row[10],
    isVisible: row[11] === 1,
  };
}

// User operations
// Helper to escape SQL strings
function escapeSQL(str: string): string {
  return str.replace(/'/g, "''");
}

export async function createUser(userData: Omit<User, 'id' | 'password'> & { password: string }): Promise<number> {
  const db = await initDB();
  
  // Check if email already exists
  const email = userData.email.toLowerCase();
  const result = db.exec(`SELECT id FROM users WHERE email = '${escapeSQL(email)}'`);
  if (result.length > 0 && result[0].values.length > 0) {
    throw new Error('Email already registered');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  // Get next ID
  const idResult = db.exec(`SELECT COALESCE(MAX(id), 0) + 1 as nextId FROM users`);
  const nextId = idResult.length > 0 && idResult[0].values.length > 0 ? idResult[0].values[0][0] : 1;

  db.run(
    `INSERT INTO users (fullName, email, password, mobileNumber, countryCode, role, signupDate, testimonialAllowed, isSuspended) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userData.fullName,
      email,
      hashedPassword,
      userData.mobileNumber,
      userData.countryCode,
      'user',
      new Date().toISOString(),
      0, // testimonialAllowed
      0, // isSuspended
    ]
  );
  
  saveDatabase();
  return nextId as number;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const db = await initDB();
  const result = db.exec(`SELECT * FROM users WHERE email = '${escapeSQL(email.toLowerCase())}'`);
  if (result.length === 0 || result[0].values.length === 0) {
    return undefined;
  }
  return sqlToUser(result[0].values[0]);
}

export async function getUserById(id: number): Promise<User | undefined> {
  const db = await initDB();
  const result = db.exec(`SELECT * FROM users WHERE id = ${id}`);
  if (result.length === 0 || result[0].values.length === 0) {
    return undefined;
  }
  return sqlToUser(result[0].values[0]);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export async function getAllUsers(): Promise<User[]> {
  const db = await initDB();
  const result = db.exec(`SELECT * FROM users ORDER BY id`);
  if (result.length === 0) return [];
  return result[0].values.map(row => sqlToUser(row));
}

export async function updateUser(userId: number, updates: Partial<User>): Promise<void> {
  const db = await initDB();
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');
  
  const updateFields: string[] = [];
  const values: any[] = [];

  if (updates.fullName !== undefined) {
    updateFields.push('fullName = ?');
    values.push(updates.fullName);
  }
  if (updates.email !== undefined) {
    updateFields.push('email = ?');
    values.push(updates.email.toLowerCase());
  }
  if (updates.password !== undefined) {
    updateFields.push('password = ?');
    values.push(updates.password);
  }
  if (updates.mobileNumber !== undefined) {
    updateFields.push('mobileNumber = ?');
    values.push(updates.mobileNumber);
  }
  if (updates.countryCode !== undefined) {
    updateFields.push('countryCode = ?');
    values.push(updates.countryCode);
  }
  if (updates.role !== undefined) {
    updateFields.push('role = ?');
    values.push(updates.role);
  }
  if (updates.testimonialAllowed !== undefined) {
    updateFields.push('testimonialAllowed = ?');
    values.push(updates.testimonialAllowed ? 1 : 0);
  }
  if (updates.isSuspended !== undefined) {
    updateFields.push('isSuspended = ?');
    values.push(updates.isSuspended ? 1 : 0);
  }

  if (updateFields.length === 0) return;

  values.push(userId);
  db.run(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, values);
  saveDatabase();
}

export async function updateUserPassword(userId: number, newPassword: string): Promise<void> {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await updateUser(userId, { password: hashedPassword });
}

export async function toggleTestimonialPermission(userId: number): Promise<void> {
  const db = await initDB();
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');
  await updateUser(userId, { testimonialAllowed: !user.testimonialAllowed });
}

export async function suspendUser(userId: number): Promise<void> {
  const db = await initDB();
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');
  if (user.role === 'admin') throw new Error('Cannot suspend admin user');
  await updateUser(userId, { isSuspended: true });
}

export async function unsuspendUser(userId: number): Promise<void> {
  const db = await initDB();
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');
  await updateUser(userId, { isSuspended: false });
}

export async function deleteUser(userId: number): Promise<void> {
  const db = await initDB();
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');
  if (user.role === 'admin') throw new Error('Cannot delete admin user');
  
  // Delete user's bookings
  db.run(`DELETE FROM bookings WHERE userId = ${userId}`);
  
  // Delete user's testimonials
  db.run(`DELETE FROM testimonials WHERE userId = ${userId}`);
  
  // Delete user
  db.run(`DELETE FROM users WHERE id = ${userId}`);
  
  saveDatabase();
}

// Booking operations
export async function createBooking(booking: Omit<Booking, 'id'>): Promise<number> {
  const db = await initDB();
  const idResult = db.exec(`SELECT COALESCE(MAX(id), 0) + 1 as nextId FROM bookings`);
  const nextId = idResult.length > 0 && idResult[0].values.length > 0 ? idResult[0].values[0][0] : 1;

  db.run(
    `INSERT INTO bookings (userId, tripName, status, bookingDate, tripDate, details) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      booking.userId,
      booking.tripName,
      booking.status,
      booking.bookingDate,
      booking.tripDate,
      booking.details || null,
    ]
  );
  
  saveDatabase();
  return nextId as number;
}

export async function getUserBookings(userId: number): Promise<Booking[]> {
  const db = await initDB();
  const result = db.exec(`SELECT * FROM bookings WHERE userId = ${userId} ORDER BY id`);
  if (result.length === 0) return [];
  return result[0].values.map(row => sqlToBooking(row));
}

export async function getAllBookings(): Promise<Booking[]> {
  const db = await initDB();
  const result = db.exec(`SELECT * FROM bookings ORDER BY id`);
  if (result.length === 0) return [];
  return result[0].values.map(row => sqlToBooking(row));
}

export async function updateBooking(bookingId: number, updates: Partial<Booking>): Promise<void> {
  const db = await initDB();
  const result = db.exec(`SELECT * FROM bookings WHERE id = ${bookingId}`);
  if (result.length === 0 || result[0].values.length === 0) {
    throw new Error('Booking not found');
  }

  const updateFields: string[] = [];
  const values: any[] = [];

  if (updates.userId !== undefined) {
    updateFields.push('userId = ?');
    values.push(updates.userId);
  }
  if (updates.tripName !== undefined) {
    updateFields.push('tripName = ?');
    values.push(updates.tripName);
  }
  if (updates.status !== undefined) {
    updateFields.push('status = ?');
    values.push(updates.status);
  }
  if (updates.bookingDate !== undefined) {
    updateFields.push('bookingDate = ?');
    values.push(updates.bookingDate);
  }
  if (updates.tripDate !== undefined) {
    updateFields.push('tripDate = ?');
    values.push(updates.tripDate);
  }
  if (updates.details !== undefined) {
    updateFields.push('details = ?');
    values.push(updates.details || null);
  }

  if (updateFields.length === 0) return;

  values.push(bookingId);
  db.run(`UPDATE bookings SET ${updateFields.join(', ')} WHERE id = ?`, values);
  saveDatabase();
}

export async function cancelBooking(bookingId: number): Promise<void> {
  await updateBooking(bookingId, { status: 'cancelled' });
}

// Testimonial operations
export async function createTestimonial(testimonial: Omit<Testimonial, 'id'>): Promise<number> {
  const db = await initDB();
  const idResult = db.exec(`SELECT COALESCE(MAX(id), 0) + 1 as nextId FROM testimonials`);
  const nextId = idResult.length > 0 && idResult[0].values.length > 0 ? idResult[0].values[0][0] : 1;

  db.run(
    `INSERT INTO testimonials (userId, userName, email, tripName, quote, rating, role, location, highlight, submittedDate, isVisible) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      testimonial.userId,
      testimonial.userName,
      testimonial.email,
      testimonial.tripName,
      testimonial.quote,
      testimonial.rating,
      testimonial.role || null,
      testimonial.location || null,
      testimonial.highlight || null,
      testimonial.submittedDate,
      testimonial.isVisible ? 1 : 0,
    ]
  );
  
  saveDatabase();
  return nextId as number;
}

export async function getVisibleTestimonials(): Promise<Testimonial[]> {
  const db = await initDB();
  const result = db.exec(`SELECT * FROM testimonials WHERE isVisible = 1 ORDER BY id`);
  if (result.length === 0) return [];
  return result[0].values.map(row => sqlToTestimonial(row));
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const db = await initDB();
  const result = db.exec(`SELECT * FROM testimonials ORDER BY id`);
  if (result.length === 0) return [];
  return result[0].values.map(row => sqlToTestimonial(row));
}

export async function toggleTestimonialVisibility(testimonialId: number): Promise<void> {
  const db = await initDB();
  const result = db.exec(`SELECT * FROM testimonials WHERE id = ${testimonialId}`);
  if (result.length === 0 || result[0].values.length === 0) {
    throw new Error('Testimonial not found');
  }
  const testimonial = sqlToTestimonial(result[0].values[0]);
  db.run(`UPDATE testimonials SET isVisible = ${testimonial.isVisible ? 0 : 1} WHERE id = ${testimonialId}`);
  saveDatabase();
}

export async function deleteTestimonial(testimonialId: number): Promise<void> {
  const db = await initDB();
  db.run(`DELETE FROM testimonials WHERE id = ${testimonialId}`);
  saveDatabase();
}

export async function getBookingsByUserId(userId: number): Promise<Booking[]> {
  const db = await initDB();
  const result = db.exec(`SELECT * FROM bookings WHERE userId = ${userId} ORDER BY bookingDate DESC`);
  return result[0]?.values?.map((row: any) => ({
    id: row[0],
    userId: row[1],
    tripName: row[2],
    status: row[3],
    bookingDate: row[4],
    tripDate: row[5],
    details: row[6],
  })) || [];
}

export async function getTestimonialsByUserId(userId: number): Promise<Testimonial[]> {
  const db = await initDB();
  const result = db.exec(`SELECT * FROM testimonials WHERE userId = ${userId} ORDER BY submittedDate DESC`);
  return result[0]?.values?.map((row: any) => ({
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
    isVisible: !!row[11],
  })) || [];
}
