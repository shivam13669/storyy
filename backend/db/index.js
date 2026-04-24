import { PostgresDatabase } from './PostgresDatabase.js';
import { SQLiteDatabase } from './SQLiteDatabase.js';

let database = null;

/**
 * Initialize the database
 */
export async function initDB() {
  if (database) return database;

  // Use PostgreSQL if DATABASE_URL is set, otherwise fall back to SQLite for development
  if (process.env.DATABASE_URL) {
    database = new PostgresDatabase();
    console.log('🔗 Using PostgreSQL database');
  } else {
    database = new SQLiteDatabase();
    console.log('💾 Using SQLite database (development mode)');
  }

  await database.init();
  return database;
}

/**
 * Get the database instance
 */
export function getDB() {
  if (!database) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return database;
}

// For backwards compatibility with routes that use getDB
export default getDB;
