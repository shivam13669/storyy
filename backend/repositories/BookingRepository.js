import { getDB } from '../db/index.js';

export class BookingRepository {
  /**
   * Create a new booking
   */
  static async create(userId, tripName, bookingDate, tripDate, status = 'pending', details = null) {
    const db = getDB();

    const booking = await db.createBooking({
      userId,
      tripName,
      status,
      bookingDate,
      tripDate,
      details
    });

    if (!booking) {
      throw new Error('Failed to create booking');
    }

    return booking;
  }

  /**
   * Get all bookings
   */
  static async getAll() {
    const db = getDB();
    return await db.getAllBookings();
  }

  /**
   * Get bookings by user ID
   */
  static async getByUserId(userId) {
    const db = getDB();
    return await db.getBookingsByUserId(userId);
  }

  /**
   * Delete booking
   */
  static async delete(id) {
    const db = getDB();
    const success = await db.deleteBooking(id);

    if (!success) {
      throw new Error('Failed to delete booking');
    }

    return true;
  }
}
