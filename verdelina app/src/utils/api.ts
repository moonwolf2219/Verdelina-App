import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a71b7664`;

export interface FarmerData {
  id: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  language: string;
  hasPayment: boolean;
  listingsPosted: number;
  maxListings: number;
  createdAt: string;
  updatedAt?: string;
}

export interface MachineryListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerVillage: string;
  farmerDistrict: string;
  machineName: string;
  brand: string;
  model?: string;
  year?: string;
  price: number;
  condition: string;
  description?: string;
  images: string[];
  status: string;
  createdAt: string;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  preferences: {
    language: string;
    theme: string;
  };
}

// ============================================================================
// AUTH API
// ============================================================================

export async function signup(data: {
  name: string;
  phone: string;
  village: string;
  district: string;
  language: string;
  password: string;
}): Promise<{ success: boolean; farmerId?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Signup error:', result);
      return { success: false, error: result.error || 'Signup failed' };
    }

    return result;
  } catch (error) {
    console.error('Signup request error:', error);
    return { success: false, error: 'Network error during signup' };
  }
}

export async function login(phone: string, password: string): Promise<{
  success: boolean;
  accessToken?: string;
  farmer?: FarmerData;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ phone, password }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Login error:', result);
      return { success: false, error: result.error || 'Login failed' };
    }

    return result;
  } catch (error) {
    console.error('Login request error:', error);
    return { success: false, error: 'Network error during login' };
  }
}

export async function adminLogin(username: string, password: string): Promise<{
  success: boolean;
  accessToken?: string;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Admin login error:', result);
      return { success: false, error: result.error || 'Login failed' };
    }

    return result;
  } catch (error) {
    console.error('Admin login request error:', error);
    return { success: false, error: 'Network error during admin login' };
  }
}

// ============================================================================
// PAYMENT API
// ============================================================================

export async function verifyPayment(
  accessToken: string,
  paymentData: {
    paymentId: string;
    orderId: string;
    signature: string;
  }
): Promise<{ success: boolean; maxListings?: number; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Payment verification error:', result);
      return { success: false, error: result.error || 'Payment verification failed' };
    }

    return result;
  } catch (error) {
    console.error('Payment verification request error:', error);
    return { success: false, error: 'Network error during payment verification' };
  }
}

// ============================================================================
// MACHINERY API
// ============================================================================

export async function createListing(
  accessToken: string,
  listingData: {
    machineName: string;
    brand: string;
    model?: string;
    year?: string;
    price: number;
    condition: string;
    description?: string;
    images: string[]; // Base64 encoded images
  }
): Promise<{ success: boolean; listingId?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/machinery/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(listingData),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Create listing error:', result);
      return { success: false, error: result.error || 'Failed to create listing' };
    }

    return result;
  } catch (error) {
    console.error('Create listing request error:', error);
    return { success: false, error: 'Network error while creating listing' };
  }
}

export async function getAllListings(): Promise<{
  success: boolean;
  listings?: MachineryListing[];
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/machinery/all`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Get listings error:', result);
      return { success: false, error: result.error || 'Failed to fetch listings' };
    }

    return result;
  } catch (error) {
    console.error('Get listings request error:', error);
    return { success: false, error: 'Network error while fetching listings' };
  }
}

export async function getMyListings(accessToken: string): Promise<{
  success: boolean;
  listings?: MachineryListing[];
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/machinery/my-listings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Get my listings error:', result);
      return { success: false, error: result.error || 'Failed to fetch your listings' };
    }

    return result;
  } catch (error) {
    console.error('Get my listings request error:', error);
    return { success: false, error: 'Network error while fetching your listings' };
  }
}

export async function deleteListing(accessToken: string, listingId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/machinery/${listingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Delete listing error:', result);
      return { success: false, error: result.error || 'Failed to delete listing' };
    }

    return result;
  } catch (error) {
    console.error('Delete listing request error:', error);
    return { success: false, error: 'Network error while deleting listing' };
  }
}

// ============================================================================
// PROFILE & SETTINGS API
// ============================================================================

export async function getProfile(accessToken: string): Promise<{
  success: boolean;
  profile?: FarmerData;
  settings?: UserSettings;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Get profile error:', result);
      return { success: false, error: result.error || 'Failed to fetch profile' };
    }

    return result;
  } catch (error) {
    console.error('Get profile request error:', error);
    return { success: false, error: 'Network error while fetching profile' };
  }
}

export async function updateProfile(
  accessToken: string,
  updates: Partial<FarmerData>
): Promise<{ success: boolean; profile?: FarmerData; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updates),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Update profile error:', result);
      return { success: false, error: result.error || 'Failed to update profile' };
    }

    return result;
  } catch (error) {
    console.error('Update profile request error:', error);
    return { success: false, error: 'Network error while updating profile' };
  }
}

export async function updateSettings(
  accessToken: string,
  settings: UserSettings
): Promise<{ success: boolean; settings?: UserSettings; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(settings),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Update settings error:', result);
      return { success: false, error: result.error || 'Failed to update settings' };
    }

    return result;
  } catch (error) {
    console.error('Update settings request error:', error);
    return { success: false, error: 'Network error while updating settings' };
  }
}

// ============================================================================
// ADMIN API
// ============================================================================

export async function adminGetFarmers(accessToken: string): Promise<{
  success: boolean;
  farmers?: FarmerData[];
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/farmers`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Admin get farmers error:', result);
      return { success: false, error: result.error || 'Failed to fetch farmers' };
    }

    return result;
  } catch (error) {
    console.error('Admin get farmers request error:', error);
    return { success: false, error: 'Network error while fetching farmers' };
  }
}

export async function adminGetListings(accessToken: string): Promise<{
  success: boolean;
  listings?: MachineryListing[];
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/listings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Admin get listings error:', result);
      return { success: false, error: result.error || 'Failed to fetch listings' };
    }

    return result;
  } catch (error) {
    console.error('Admin get listings request error:', error);
    return { success: false, error: 'Network error while fetching listings' };
  }
}

export async function adminDeleteListing(accessToken: string, listingId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/listing/${listingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Admin delete listing error:', result);
      return { success: false, error: result.error || 'Failed to delete listing' };
    }

    return result;
  } catch (error) {
    console.error('Admin delete listing request error:', error);
    return { success: false, error: 'Network error while deleting listing' };
  }
}

export async function adminGetStats(accessToken: string): Promise<{
  success: boolean;
  stats?: {
    totalFarmers: number;
    totalListings: number;
    activeListings: number;
    totalPayments: number;
    totalRevenue: number;
  };
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Admin get stats error:', result);
      return { success: false, error: result.error || 'Failed to fetch stats' };
    }

    return result;
  } catch (error) {
    console.error('Admin get stats request error:', error);
    return { success: false, error: 'Network error while fetching stats' };
  }
}
