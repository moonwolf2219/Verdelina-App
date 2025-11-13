import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Create storage buckets on startup
const BUCKET_NAME = 'make-a71b7664-machinery-images';
(async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, { public: false });
      console.log('Created storage bucket:', BUCKET_NAME);
    }
  } catch (error) {
    console.error('Error creating storage bucket:', error);
  }
})();

// Helper function to generate unique IDs
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// FARMER AUTHENTICATION & REGISTRATION
// ============================================================================

// Farmer Signup
app.post('/make-server-a71b7664/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { name, phone, village, district, language, password } = body;

    if (!name || !phone || !village || !district || !password) {
      return c.json({ error: 'All fields are required' }, 400);
    }

    // Check if phone already exists
    const existingFarmer = await kv.get(`farmer:phone:${phone}`);
    if (existingFarmer) {
      return c.json({ error: 'Phone number already registered' }, 400);
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: `${phone}@verdelina.app`, // Using phone as email
      password: password,
      user_metadata: { name, phone, village, district, language },
      email_confirm: true, // Automatically confirm since no email server configured
    });

    if (error) {
      console.error('Supabase auth error during farmer signup:', error);
      return c.json({ error: `Authentication error: ${error.message}` }, 500);
    }

    const farmerId = data.user.id;

    // Store farmer data
    const farmerData = {
      id: farmerId,
      name,
      phone,
      village,
      district,
      language,
      createdAt: new Date().toISOString(),
      hasPayment: false,
      listingsPosted: 0,
      maxListings: 0,
    };

    await kv.set(`farmer:${farmerId}`, farmerData);
    await kv.set(`farmer:phone:${phone}`, farmerId);

    return c.json({ 
      success: true, 
      farmerId,
      message: 'Farmer registered successfully' 
    });
  } catch (error) {
    console.error('Error during farmer signup:', error);
    return c.json({ error: `Server error during signup: ${error.message}` }, 500);
  }
});

// Farmer Login
app.post('/make-server-a71b7664/login', async (c) => {
  try {
    const { phone, password } = await c.req.json();

    if (!phone || !password) {
      return c.json({ error: 'Phone and password are required' }, 400);
    }

    const email = `${phone}@verdelina.app`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return c.json({ error: 'Invalid phone or password' }, 401);
    }

    const farmerId = data.user.id;
    const farmer = await kv.get(`farmer:${farmerId}`);

    return c.json({ 
      success: true,
      accessToken: data.session.access_token,
      farmer,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return c.json({ error: `Server error during login: ${error.message}` }, 500);
  }
});

// Admin Login
app.post('/make-server-a71b7664/admin/login', async (c) => {
  try {
    const { username, password } = await c.req.json();

    if (username === 'admin' && password === 'admin123') {
      // Generate a simple admin token
      const adminToken = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await kv.set(`admin:token:${adminToken}`, { username, createdAt: new Date().toISOString() });
      
      return c.json({ 
        success: true,
        accessToken: adminToken,
      });
    }

    return c.json({ error: 'Invalid credentials' }, 401);
  } catch (error) {
    console.error('Error during admin login:', error);
    return c.json({ error: `Server error during admin login: ${error.message}` }, 500);
  }
});

// ============================================================================
// PAYMENT HANDLING
// ============================================================================

app.post('/make-server-a71b7664/payment/verify', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { paymentId, orderId, signature } = await c.req.json();

    // In production, verify Razorpay signature here
    // For prototype, we'll accept the payment

    const paymentData = {
      id: generateId('payment'),
      farmerId: user.id,
      paymentId,
      orderId,
      amount: 125,
      currency: 'INR',
      status: 'success',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`payment:${paymentData.id}`, paymentData);
    await kv.set(`payment:farmer:${user.id}:${paymentData.id}`, paymentData);

    // Update farmer's payment status
    const farmer = await kv.get(`farmer:${user.id}`);
    if (farmer) {
      farmer.hasPayment = true;
      farmer.maxListings = (farmer.maxListings || 0) + 10;
      await kv.set(`farmer:${user.id}`, farmer);
    }

    return c.json({ 
      success: true,
      message: 'Payment verified successfully',
      maxListings: farmer.maxListings,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return c.json({ error: `Payment verification error: ${error.message}` }, 500);
  }
});

// ============================================================================
// MACHINERY LISTINGS
// ============================================================================

// Create Machinery Listing
app.post('/make-server-a71b7664/machinery/create', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const farmer = await kv.get(`farmer:${user.id}`);
    if (!farmer) {
      return c.json({ error: 'Farmer not found' }, 404);
    }

    if (farmer.listingsPosted >= farmer.maxListings) {
      return c.json({ error: 'Listing limit reached. Please make a payment for more listings.' }, 403);
    }

    const body = await c.req.json();
    const { 
      machineName, 
      brand, 
      model, 
      year, 
      price, 
      condition, 
      description, 
      images 
    } = body;

    if (!machineName || !brand || !price || !images || images.length !== 4) {
      return c.json({ error: 'All fields required with exactly 4 images' }, 400);
    }

    const listingId = generateId('listing');
    const imageUrls: string[] = [];

    // Upload images to Supabase Storage
    for (let i = 0; i < images.length; i++) {
      const base64Data = images[i].split(',')[1];
      const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      const fileName = `${listingId}_image_${i}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, buffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        return c.json({ error: `Image upload failed: ${uploadError.message}` }, 500);
      }

      // Get signed URL
      const { data: urlData } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year

      if (urlData?.signedUrl) {
        imageUrls.push(urlData.signedUrl);
      }
    }

    const listingData = {
      id: listingId,
      farmerId: user.id,
      farmerName: farmer.name,
      farmerPhone: farmer.phone,
      farmerVillage: farmer.village,
      farmerDistrict: farmer.district,
      machineName,
      brand,
      model,
      year,
      price,
      condition,
      description,
      images: imageUrls,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`listing:${listingId}`, listingData);
    await kv.set(`listing:farmer:${user.id}:${listingId}`, listingId);

    // Update farmer's listing count
    farmer.listingsPosted = (farmer.listingsPosted || 0) + 1;
    await kv.set(`farmer:${user.id}`, farmer);

    return c.json({ 
      success: true,
      listingId,
      message: 'Machinery listed successfully',
    });
  } catch (error) {
    console.error('Error creating machinery listing:', error);
    return c.json({ error: `Error creating listing: ${error.message}` }, 500);
  }
});

// Get All Active Listings
app.get('/make-server-a71b7664/machinery/all', async (c) => {
  try {
    const allListings = await kv.getByPrefix('listing:');
    
    // Filter only main listing entries (not farmer-specific keys)
    const listings = allListings
      .filter(item => item.key.split(':').length === 2)
      .map(item => item.value)
      .filter(listing => listing.status === 'active')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ success: true, listings });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return c.json({ error: `Error fetching listings: ${error.message}` }, 500);
  }
});

// Get Farmer's Listings
app.get('/make-server-a71b7664/machinery/my-listings', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const farmerListings = await kv.getByPrefix(`listing:farmer:${user.id}:`);
    const listingIds = farmerListings.map(item => item.value);
    
    const listings = [];
    for (const listingId of listingIds) {
      const listing = await kv.get(`listing:${listingId}`);
      if (listing) {
        listings.push(listing);
      }
    }

    return c.json({ 
      success: true, 
      listings: listings.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });
  } catch (error) {
    console.error('Error fetching farmer listings:', error);
    return c.json({ error: `Error fetching your listings: ${error.message}` }, 500);
  }
});

// Delete Listing
app.delete('/make-server-a71b7664/machinery/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const listingId = c.req.param('id');
    const listing = await kv.get(`listing:${listingId}`);

    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }

    if (listing.farmerId !== user.id) {
      return c.json({ error: 'Not authorized to delete this listing' }, 403);
    }

    // Delete images from storage
    for (let i = 0; i < 4; i++) {
      const fileName = `${listingId}_image_${i}.jpg`;
      await supabase.storage.from(BUCKET_NAME).remove([fileName]);
    }

    // Delete listing
    await kv.del(`listing:${listingId}`);
    await kv.del(`listing:farmer:${user.id}:${listingId}`);

    // Update farmer's listing count
    const farmer = await kv.get(`farmer:${user.id}`);
    if (farmer) {
      farmer.listingsPosted = Math.max(0, (farmer.listingsPosted || 1) - 1);
      await kv.set(`farmer:${user.id}`, farmer);
    }

    return c.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return c.json({ error: `Error deleting listing: ${error.message}` }, 500);
  }
});

// ============================================================================
// USER PROFILE & SETTINGS
// ============================================================================

// Get User Profile
app.get('/make-server-a71b7664/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const farmer = await kv.get(`farmer:${user.id}`);
    if (!farmer) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    // Get user settings
    const settings = await kv.get(`settings:${user.id}`) || {
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      preferences: {
        language: farmer.language || 'en',
        theme: 'light',
      },
    };

    return c.json({ 
      success: true, 
      profile: farmer,
      settings,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return c.json({ error: `Error fetching profile: ${error.message}` }, 500);
  }
});

// Update User Profile
app.put('/make-server-a71b7664/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const updates = await c.req.json();
    const farmer = await kv.get(`farmer:${user.id}`);
    
    if (!farmer) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    // Update allowed fields
    if (updates.name) farmer.name = updates.name;
    if (updates.village) farmer.village = updates.village;
    if (updates.district) farmer.district = updates.district;
    if (updates.language) farmer.language = updates.language;

    farmer.updatedAt = new Date().toISOString();
    await kv.set(`farmer:${user.id}`, farmer);

    return c.json({ success: true, profile: farmer });
  } catch (error) {
    console.error('Error updating profile:', error);
    return c.json({ error: `Error updating profile: ${error.message}` }, 500);
  }
});

// Update User Settings
app.put('/make-server-a71b7664/settings', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const settings = await c.req.json();
    await kv.set(`settings:${user.id}`, settings);

    return c.json({ success: true, settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return c.json({ error: `Error updating settings: ${error.message}` }, 500);
  }
});

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

// Get All Farmers (Admin)
app.get('/make-server-a71b7664/admin/farmers', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const adminSession = await kv.get(`admin:token:${accessToken}`);
    if (!adminSession) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const allFarmers = await kv.getByPrefix('farmer:');
    const farmers = allFarmers
      .filter(item => item.key.split(':').length === 2 && !item.key.includes('phone'))
      .map(item => item.value)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ success: true, farmers });
  } catch (error) {
    console.error('Error fetching farmers:', error);
    return c.json({ error: `Error fetching farmers: ${error.message}` }, 500);
  }
});

// Get All Listings (Admin)
app.get('/make-server-a71b7664/admin/listings', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const adminSession = await kv.get(`admin:token:${accessToken}`);
    if (!adminSession) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const allListings = await kv.getByPrefix('listing:');
    const listings = allListings
      .filter(item => item.key.split(':').length === 2)
      .map(item => item.value)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ success: true, listings });
  } catch (error) {
    console.error('Error fetching admin listings:', error);
    return c.json({ error: `Error fetching listings: ${error.message}` }, 500);
  }
});

// Delete Listing (Admin)
app.delete('/make-server-a71b7664/admin/listing/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const adminSession = await kv.get(`admin:token:${accessToken}`);
    if (!adminSession) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const listingId = c.req.param('id');
    const listing = await kv.get(`listing:${listingId}`);

    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404);
    }

    // Delete images from storage
    for (let i = 0; i < 4; i++) {
      const fileName = `${listingId}_image_${i}.jpg`;
      await supabase.storage.from(BUCKET_NAME).remove([fileName]);
    }

    await kv.del(`listing:${listingId}`);
    await kv.del(`listing:farmer:${listing.farmerId}:${listingId}`);

    return c.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing (admin):', error);
    return c.json({ error: `Error deleting listing: ${error.message}` }, 500);
  }
});

// Get Dashboard Stats (Admin)
app.get('/make-server-a71b7664/admin/stats', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const adminSession = await kv.get(`admin:token:${accessToken}`);
    if (!adminSession) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const allFarmers = await kv.getByPrefix('farmer:');
    const farmers = allFarmers.filter(item => item.key.split(':').length === 2 && !item.key.includes('phone'));
    
    const allListings = await kv.getByPrefix('listing:');
    const listings = allListings.filter(item => item.key.split(':').length === 2);
    
    const allPayments = await kv.getByPrefix('payment:');
    const payments = allPayments.filter(item => item.key.split(':').length === 2);

    const totalRevenue = payments.reduce((sum, p) => sum + (p.value?.amount || 0), 0);
    const activeListings = listings.filter(l => l.value?.status === 'active').length;

    return c.json({ 
      success: true, 
      stats: {
        totalFarmers: farmers.length,
        totalListings: listings.length,
        activeListings,
        totalPayments: payments.length,
        totalRevenue,
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return c.json({ error: `Error fetching stats: ${error.message}` }, 500);
  }
});

console.log('Verdelina Hub server started successfully');

Deno.serve(app.fetch);
