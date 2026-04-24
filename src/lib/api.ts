// Determine API URL based on environment
function getApiUrl() {
  // In production (Vercel, etc), use full backend URL
  if (import.meta.env.VITE_BACKEND_URL) {
    return `${import.meta.env.VITE_BACKEND_URL}/api`;
  }

  // Check for VITE_API_URL (alternative variable)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Development: Use relative path /api
  // This works with:
  // - Vite proxy in development (routes to backend)
  // - Same-server setup in production
  // - Builder.io preview environments
  return '/api';
}

const API_URL = getApiUrl();

// Debug log for development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  console.log('API URL:', API_URL);
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  mobileNumber: string;
  countryCode: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: 'user' | 'admin';
  mobileNumber: string;
  countryCode: string;
  testimonialAllowed: boolean;
  signupDate: string;
  phoneLastChangedAt?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  age?: number | null;
  nationality?: string | null;
  maritalStatus?: string | null;
  anniversary?: string | null;
  state?: string | null;
  district?: string | null;
  passportNumber?: string | null;
  passportExpiryDate?: string | null;
  passportIssuingCountry?: string | null;
  panCardNumber?: string | null;
  aadhaarCardNo?: string | null;
  documents?: string | null;
}

export async function signup(data: SignupData): Promise<{ user: AuthUser; message: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Signup failed with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Signup failed');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running.`);
      }
      throw error;
    }
    throw new Error('Signup failed: Unknown error');
  }
}

export async function login(data: LoginData): Promise<{ user: AuthUser; message: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Login failed with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Login failed');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running.`);
      }
      throw error;
    }
    throw new Error('Login failed: Unknown error');
  }
}

export async function googleLogin(credential: string): Promise<{ user: AuthUser; message: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential }),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      if (!response.ok) {
        throw new Error(`Google login failed with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Google login failed');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running.`);
      }
      throw error;
    }
    throw new Error('Google login failed: Unknown error');
  }
}

export async function sendOTP(
  email: string,
  purpose: string = 'signup',
  registrationData?: { mobileNumber: string; countryCode: string }
): Promise<{ message: string; email: string; expiresIn: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, purpose, ...registrationData }),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      if (!response.ok) {
        throw new Error(`Failed to send OTP with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send OTP');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running.`);
      }
      throw error;
    }
    throw new Error('Send OTP failed: Unknown error');
  }
}

export async function verifyOTP(email: string, otp: string): Promise<{ message: string; email: string; verified: boolean }> {
  try {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      if (!response.ok) {
        throw new Error(`Failed to verify OTP with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to verify OTP');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running.`);
      }
      throw error;
    }
    throw new Error('Verify OTP failed: Unknown error');
  }
}

export async function getUser(userId: number): Promise<{ user: AuthUser }> {
  try {
    const response = await fetch(`${API_URL}/auth/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Failed to fetch user with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch user');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running.`);
      }
      throw error;
    }
    throw new Error('Failed to fetch user: Unknown error');
  }
}

export async function updateUser(userId: number, data: {
  fullName?: string;
  mobileNumber?: string;
  countryCode?: string;
  gender?: string;
  dateOfBirth?: string;
  age?: number;
  nationality?: string;
  maritalStatus?: string;
  anniversary?: string;
  state?: string;
  district?: string;
}): Promise<{ user: AuthUser; message: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      if (!response.ok) {
        throw new Error(`Failed to update user with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update user');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running.`);
      }
      throw error;
    }
    throw new Error('Failed to update user: Unknown error');
  }
}

export async function updateUserDocuments(userId: number, data: {
  passportNumber?: string;
  passportExpiryDate?: string;
  passportIssuingCountry?: string;
  panCardNumber?: string;
  aadhaarCardNo?: string;
  documents?: Array<{id: string; type: string; number: string}>;
}): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/user/${userId}/documents`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      if (!response.ok) {
        throw new Error(`Failed to update documents with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update documents');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running.`);
      }
      throw error;
    }
    throw new Error('Failed to update documents: Unknown error');
  }
}

export async function getAllUsers(): Promise<{ users: any[] }> {
  try {
    const response = await fetch(`${API_URL}/auth/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Failed to fetch users with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch users');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running.`);
      }
      throw error;
    }
    throw new Error('Failed to fetch users: Unknown error');
  }
}

export async function toggleTestimonialPermission(userId: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/auth/users/${userId}/toggle-testimonial`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Failed to toggle testimonial permission with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to toggle testimonial permission');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to toggle testimonial permission');
  }
}

export async function suspendUser(userId: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/auth/users/${userId}/suspend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Failed to suspend user with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to suspend user');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to suspend user');
  }
}

export async function unsuspendUser(userId: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/auth/users/${userId}/unsuspend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Failed to unsuspend user with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to unsuspend user');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to unsuspend user');
  }
}

export async function deleteUser(userId: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/auth/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Failed to delete user with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete user');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to delete user');
  }
}

export async function resetUserPassword(userId: number, password: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/auth/users/${userId}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Failed to reset password with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to reset password');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to reset password');
  }
}

export async function resetPasswordWithEmail(email: string, newPassword: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password-with-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, newPassword }),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      if (!response.ok) {
        throw new Error(`Failed to reset password with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to reset password');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to reset password: Unknown error');
  }
}

export async function changeUserPassword(
  userId: number,
  oldPassword: string,
  newPassword: string
): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'userId': userId.toString(),
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Failed to change password with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to change password');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to change password');
  }
}

// ============ Bookings API ============

export interface Booking {
  id: number;
  userId: number;
  tripName: string;
  status: string;
  bookingDate: string;
  tripDate: string;
  details: string | null;
}

export async function createBooking(
  userId: number,
  tripName: string,
  bookingDate: string,
  tripDate: string,
  status: string = 'pending',
  details?: string
): Promise<{ booking: Booking; message: string }> {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, tripName, bookingDate, tripDate, status, details }),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Failed to create booking with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create booking');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create booking: Unknown error');
  }
}

export async function getAllBookings(): Promise<{ bookings: Booking[] }> {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Failed to fetch bookings with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch bookings');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch bookings: Unknown error');
  }
}

export async function getBookingsByUser(userId: number): Promise<{ bookings: Booking[] }> {
  try {
    const response = await fetch(`${API_URL}/bookings/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Failed to fetch user bookings with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch user bookings');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch user bookings: Unknown error');
  }
}

export async function deleteBooking(bookingId: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Failed to delete booking with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete booking');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to delete booking');
  }
}

// ============ Testimonials API ============

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

export async function createTestimonial(
  userId: number,
  userName: string,
  email: string,
  tripName: string,
  quote: string,
  rating: number,
  role?: string,
  location?: string,
  highlight?: string
): Promise<{ testimonial: Testimonial; message: string }> {
  try {
    const response = await fetch(`${API_URL}/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        userName,
        email,
        tripName,
        quote,
        rating,
        role,
        location,
        highlight,
      }),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Failed to create testimonial with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create testimonial');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create testimonial: Unknown error');
  }
}

export async function getAllTestimonials(): Promise<{ testimonials: Testimonial[] }> {
  try {
    const response = await fetch(`${API_URL}/testimonials`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Failed to fetch testimonials with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch testimonials');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch testimonials: Unknown error');
  }
}

export async function getTestimonialsByUser(userId: number): Promise<{ testimonials: Testimonial[] }> {
  try {
    const response = await fetch(`${API_URL}/testimonials/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Failed to fetch user testimonials with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch user testimonials');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch user testimonials: Unknown error');
  }
}

export async function deleteTestimonial(testimonialId: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/testimonials/${testimonialId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Failed to delete testimonial with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete testimonial');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to delete testimonial');
  }
}

export async function updateTestimonial(
  testimonialId: number,
  updates: Partial<Testimonial>
): Promise<{ testimonial: Testimonial; message: string }> {
  try {
    const response = await fetch(`${API_URL}/testimonials/${testimonialId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      // Response body is not valid JSON
      if (!response.ok) {
        throw new Error(`Failed to update testimonial with status ${response.status}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update testimonial');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to update testimonial: Unknown error');
  }
}

export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_URL.replace('/api', '')}/api/health`, {
    method: 'GET',
  });

  const result = await response.json();
  return result;
}
