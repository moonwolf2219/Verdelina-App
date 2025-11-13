/**
 * VERDELINA HUB - BACKEND INTEGRATION CODE EXAMPLES
 * 
 * This file contains code snippets showing how to integrate backend APIs
 * into the existing components. Copy and paste these into the actual components.
 */

import * as api from '../utils/api';
import { toast } from 'sonner@2.0.3';

// ============================================================================
// BUYER PAGE - Load machinery listings from backend
// ============================================================================

export const BuyerPageIntegration = () => {
  // Add these imports and state
  const [machineryData, setMachineryData] = useState<api.MachineryListing[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all listings on mount
  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      try {
        const result = await api.getAllListings();
        if (result.success && result.listings) {
          setMachineryData(result.listings);
        } else {
          toast.error('Failed to load listings');
        }
      } catch (error) {
        console.error('Error loading listings:', error);
        toast.error('Error loading machinery listings');
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  // Remove the viewableListings prop - data now comes from backend
  // Show loading state while fetching
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50]"></div>
    </div>;
  }
};

// ============================================================================
// SELLER PAGE - Create listings and upload images
// ============================================================================

export const SellerPageIntegration = () => {
  const [myListings, setMyListings] = useState<api.MachineryListing[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // base64 strings
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load farmer's existing listings
  useEffect(() => {
    const loadMyListings = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error('Please log in again');
        return;
      }

      try {
        const result = await api.getMyListings(accessToken);
        if (result.success && result.listings) {
          setMyListings(result.listings);
        }
      } catch (error) {
        console.error('Error loading your listings:', error);
      }
    };

    loadMyListings();
  }, []);

  // Handle image upload (convert to base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + uploadedImages.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Submit new listing
  const handleSubmitListing = async (formData: {
    machineName: string;
    brand: string;
    model?: string;
    year?: string;
    price: number;
    condition: string;
    description?: string;
  }) => {
    if (uploadedImages.length !== 4) {
      toast.error('Please upload exactly 4 images');
      return;
    }

    setIsSubmitting(true);

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error('Please log in again');
        return;
      }

      const result = await api.createListing(accessToken, {
        ...formData,
        images: uploadedImages,
      });

      if (result.success) {
        toast.success('Machinery listed successfully!');
        // Reset form and refresh listings
        setUploadedImages([]);
        // Reload listings
        const listingsResult = await api.getMyListings(accessToken);
        if (listingsResult.success) {
          setMyListings(listingsResult.listings || []);
        }
      } else {
        toast.error(result.error || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Error creating listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete listing
  const handleDeleteListing = async (listingId: string) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      const result = await api.deleteListing(accessToken, listingId);
      if (result.success) {
        toast.success('Listing deleted');
        setMyListings(prev => prev.filter(l => l.id !== listingId));
      } else {
        toast.error(result.error || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Error deleting listing');
    }
  };
};

// ============================================================================
// ADMIN PANEL - Load real data and manage
// ============================================================================

export const AdminPanelIntegration = () => {
  const [farmers, setFarmers] = useState<api.FarmerData[]>([]);
  const [listings, setListings] = useState<api.MachineryListing[]>([]);
  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalListings: 0,
    activeListings: 0,
    totalPayments: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  // Load all admin data
  useEffect(() => {
    const loadAdminData = async () => {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        toast.error('Admin authentication required');
        return;
      }

      setLoading(true);
      try {
        const [farmersRes, listingsRes, statsRes] = await Promise.all([
          api.adminGetFarmers(adminToken),
          api.adminGetListings(adminToken),
          api.adminGetStats(adminToken),
        ]);

        if (farmersRes.success && farmersRes.farmers) {
          setFarmers(farmersRes.farmers);
        }

        if (listingsRes.success && listingsRes.listings) {
          setListings(listingsRes.listings);
        }

        if (statsRes.success && statsRes.stats) {
          setStats(statsRes.stats);
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  // Delete listing (admin)
  const handleDeleteListing = async (listingId: string) => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) return;

    try {
      const result = await api.adminDeleteListing(adminToken, listingId);
      if (result.success) {
        toast.success('Listing deleted');
        setListings(prev => prev.filter(l => l.id !== listingId));
        // Refresh stats
        const statsRes = await api.adminGetStats(adminToken);
        if (statsRes.success && statsRes.stats) {
          setStats(statsRes.stats);
        }
      } else {
        toast.error(result.error || 'Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Error deleting listing');
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    // Navigate back to language selection or login
  };
};

// ============================================================================
// USER SETTINGS - Save to backend
// ============================================================================

export const UserSettingsIntegration = () => {
  const [profile, setProfile] = useState<api.FarmerData | null>(null);
  const [settings, setSettings] = useState<api.UserSettings>({
    notifications: {
      email: true,
      sms: true,
      push: true,
    },
    preferences: {
      language: 'en',
      theme: 'light',
    },
  });
  const [loading, setLoading] = useState(true);

  // Load profile and settings
  useEffect(() => {
    const loadProfile = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error('Please log in again');
        return;
      }

      try {
        const result = await api.getProfile(accessToken);
        if (result.success) {
          setProfile(result.profile || null);
          setSettings(result.settings || settings);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Update profile
  const handleUpdateProfile = async (updates: Partial<api.FarmerData>) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      const result = await api.updateProfile(accessToken, updates);
      if (result.success && result.profile) {
        setProfile(result.profile);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };

  // Update settings
  const handleUpdateSettings = async (newSettings: api.UserSettings) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      const result = await api.updateSettings(accessToken, newSettings);
      if (result.success) {
        setSettings(newSettings);
        toast.success('Settings saved successfully!');
      } else {
        toast.error(result.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error saving settings');
    }
  };
};

// ============================================================================
// DASHBOARD - Load user profile data
// ============================================================================

export const DashboardIntegration = () => {
  const [farmerData, setFarmerData] = useState<api.FarmerData | null>(null);
  const [listingStats, setListingStats] = useState({
    posted: 0,
    max: 0,
  });

  useEffect(() => {
    const loadFarmerData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      try {
        const result = await api.getProfile(accessToken);
        if (result.success && result.profile) {
          setFarmerData(result.profile);
          setListingStats({
            posted: result.profile.listingsPosted || 0,
            max: result.profile.maxListings || 0,
          });
        }
      } catch (error) {
        console.error('Error loading farmer data:', error);
      }
    };

    loadFarmerData();
  }, []);

  // Display personalized greeting and stats
  return (
    <div>
      <h1>Welcome, {farmerData?.name}!</h1>
      <p>Village: {farmerData?.village}, {farmerData?.district}</p>
      <p>Listings: {listingStats.posted} / {listingStats.max}</p>
      {listingStats.max === 0 && (
        <p>Please make a payment to start posting listings</p>
      )}
    </div>
  );
};

// ============================================================================
// APP.TSX - Session Management
// ============================================================================

export const AppIntegration = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPayment, setHasPayment] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const result = await api.getProfile(accessToken);
          if (result.success && result.profile) {
            setIsAuthenticated(true);
            setHasPayment(result.profile.hasPayment);
            // Redirect to appropriate screen based on payment status
            if (result.profile.hasPayment) {
              // Go to dashboard
            } else {
              // Go to payment page
            }
          } else {
            // Invalid token, clear it
            localStorage.removeItem('accessToken');
            localStorage.removeItem('farmerId');
          }
        } catch (error) {
          console.error('Session check error:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('farmerId');
        }
      }
    };

    checkSession();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('farmerId');
    setIsAuthenticated(false);
    setHasPayment(false);
    // Redirect to language selection or login
  };
};
