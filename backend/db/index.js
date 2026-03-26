import { SQLiteDatabase } from './SQLiteDatabase.js';

let database = null;

/**
 * Initialize the database
 */
export async function initDB() {
  if (database) return database;

  database = new SQLiteDatabase();
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
