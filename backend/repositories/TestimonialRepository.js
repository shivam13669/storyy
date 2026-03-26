import { getDB } from '../db/index.js';

export class TestimonialRepository {
  /**
   * Create a new testimonial
   */
  static async create(userId, userName, email, tripName, quote, rating, role = null, location = null, highlight = null) {
    const db = getDB();

    const testimonial = await db.createTestimonial({
      userId,
      userName,
      email,
      tripName,
      quote,
      rating,
      role,
      location,
      highlight
    });

    if (!testimonial) {
      throw new Error('Failed to create testimonial');
    }

    return testimonial;
  }

  /**
   * Get all testimonials (only visible ones)
   */
  static async getAll() {
    const db = getDB();
    return await db.getAllTestimonials();
  }

  /**
   * Get testimonials by user ID
   */
  static async getByUserId(userId) {
    const db = getDB();
    return await db.getTestimonialsByUserId(userId);
  }

  /**
   * Delete testimonial
   */
  static async delete(id) {
    const db = getDB();
    const success = await db.deleteTestimonial(id);

    if (!success) {
      throw new Error('Failed to delete testimonial');
    }

    return true;
  }

  /**
   * Update testimonial
   */
  static async update(id, updates) {
    const db = getDB();

    const testimonial = await db.updateTestimonial(id, updates);

    if (!testimonial) {
      throw new Error('Failed to update testimonial');
    }

    return testimonial;
  }

  /**
   * Toggle visibility
   */
  static async toggleVisibility(id) {
    const db = getDB();
    const testimonials = await db.db.exec(
      `SELECT isVisible FROM testimonials WHERE id = ?`,
      [id]
    );

    if (!testimonials || testimonials.length === 0) {
      throw new Error('Testimonial not found');
    }

    const currentValue = testimonials[0].values[0][0];
    const newValue = currentValue === 1 ? 0 : 1;

    return this.update(id, { isVisible: newValue });
  }
}
