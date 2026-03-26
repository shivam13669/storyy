import express from 'express';
import { BookingRepository } from '../repositories/BookingRepository.js';

const router = express.Router();

/**
 * POST /api/bookings
 * Create a new booking
 */
router.post('/', async (req, res) => {
  try {
    const { userId, tripName, bookingDate, tripDate, status = 'pending', details } = req.body;

    // Validate required fields
    if (!userId || !tripName || !bookingDate || !tripDate) {
      return res.status(400).json({ error: 'Missing required fields: userId, tripName, bookingDate, tripDate' });
    }

    const booking = await BookingRepository.create(
      userId,
      tripName,
      bookingDate,
      tripDate,
      status,
      details
    );

    console.log(`✅ Booking created: ${booking.id} for user ${userId}`);

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/bookings
 * Get all bookings
 */
router.get('/', async (req, res) => {
  try {
    const bookings = await BookingRepository.getAll();
    res.json({ bookings });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/bookings/user/:userId
 * Get bookings for a specific user
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const bookings = await BookingRepository.getByUserId(userId);

    res.json({ bookings });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/bookings/:id
 * Delete a booking
 */
router.delete('/:id', async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    await BookingRepository.delete(bookingId);

    console.log(`✅ Booking deleted: ${bookingId}`);

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
