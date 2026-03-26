import express from 'express';
import { TestimonialRepository } from '../repositories/TestimonialRepository.js';

const router = express.Router();

/**
 * POST /api/testimonials
 * Create a new testimonial
 */
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      userName,
      email,
      tripName,
      quote,
      rating,
      role,
      location,
      highlight
    } = req.body;

    // Validate required fields
    if (!userId || !userName || !email || !tripName || !quote || !rating) {
      return res.status(400).json({
        error: 'Missing required fields: userId, userName, email, tripName, quote, rating'
      });
    }

    const testimonial = await TestimonialRepository.create(
      userId,
      userName,
      email,
      tripName,
      quote,
      rating,
      role,
      location,
      highlight
    );

    console.log(`✅ Testimonial created: ${testimonial.id} for user ${userId}`);

    res.status(201).json({
      message: 'Testimonial created successfully',
      testimonial
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/testimonials
 * Get all visible testimonials
 */
router.get('/', async (req, res) => {
  try {
    const testimonials = await TestimonialRepository.getAll();
    res.json({ testimonials });
  } catch (error) {
    console.error('Get all testimonials error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/testimonials/user/:userId
 * Get testimonials for a specific user
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const testimonials = await TestimonialRepository.getByUserId(userId);

    res.json({ testimonials });
  } catch (error) {
    console.error('Get user testimonials error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/testimonials/:id
 * Delete a testimonial
 */
router.delete('/:id', async (req, res) => {
  try {
    const testimonialId = parseInt(req.params.id);
    await TestimonialRepository.delete(testimonialId);

    console.log(`✅ Testimonial deleted: ${testimonialId}`);

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/testimonials/:id
 * Update testimonial (toggle visibility, etc)
 */
router.patch('/:id', async (req, res) => {
  try {
    const testimonialId = parseInt(req.params.id);
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const testimonial = await TestimonialRepository.update(testimonialId, updates);

    console.log(`✅ Testimonial updated: ${testimonialId}`);

    res.json({
      message: 'Testimonial updated successfully',
      testimonial
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
