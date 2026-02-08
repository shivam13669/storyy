// Determine API URL based on environment
function getApiUrl() {
  // Check for environment variable first (useful for different deployments)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Always use relative path /api
  // This works with:
  // - Vite proxy in development (routes to backend)
  // - Same-server setup in production
  // - Builder.io preview environments
  // - Replit deployments
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

    const result = await response.json();

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

    const result = await response.json();

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

export async function getUser(userId: number): Promise<{ user: AuthUser }> {
  try {
    const response = await fetch(`${API_URL}/auth/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

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

export async function getAllUsers(): Promise<{ users: any[] }> {
  try {
    const response = await fetch(`${API_URL}/auth/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

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

    const result = await response.json();

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

    const result = await response.json();

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

    const result = await response.json();

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

    const result = await response.json();

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

    const result = await response.json();

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

export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_URL.replace('/api', '')}/api/health`, {
    method: 'GET',
  });

  const result = await response.json();
  return result;
}
