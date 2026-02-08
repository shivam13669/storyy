import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import initSqlJs from 'sql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = path.join(__dirname, '..', 'story.db');

let db = null;
let SQL = null;

const STORAGE_KEY = 'story.db';

export function getDB() {
  return db;
}

export async function initDB() {
  try {
    // Initialize SQL.js
    SQL = await initSqlJs();

    // Try to load existing database from file
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath);
      const uint8Array = new Uint8Array(data);
      db = new SQL.Database(uint8Array);
      console.log(`📁 Loaded database from: ${dbPath}`);
    } else {
      // Create new database
      db = new SQL.Database();
      console.log(`📁 Creating new database at: ${dbPath}`);
      // Create tables
      createTables();
      // Save initial database
      saveDatabase();
    }

    // Create tables if they don't exist
    createTables();

    // Initialize admin user
    await initializeAdmin();

    console.log('✅ Connected to SQLite database');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

function createTables() {
  try {
    // Users table
    db.run(`
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
    db.run(`
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
    db.run(`
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
    db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_bookings_userId ON bookings(userId)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_testimonials_userId ON testimonials(userId)`);

    saveDatabase();
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

function saveDatabase() {
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  } catch (error) {
    console.error('Failed to save database:', error);
  }
}

async function initializeAdmin() {
  try {
    const adminEmail = 'nitinmishra2202@gmail.com';

    // Check if admin exists
    const result = db.exec(`SELECT * FROM users WHERE email = '${adminEmail.replace(/'/g, "''")}'`);

    if (!result || result.length === 0 || result[0].values.length === 0) {
      // Create admin user
      const adminPassword = 'stnt@stories123@';
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      db.run(
        `INSERT INTO users (fullName, email, password, mobileNumber, countryCode, role, signupDate, testimonialAllowed, isSuspended)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['Nitin Mishra', adminEmail, hashedPassword, '0000000000', 'IN', 'admin', new Date().toISOString(), 1, 0]
      );

      saveDatabase();
      console.log('👤 Admin user created successfully');
    } else {
      console.log('👤 Admin user already exists');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
    throw error;
  }
}
