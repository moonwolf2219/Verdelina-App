# Verdelina Hub - Backend Integration Guide

## ✅ Completed Backend Integration

### Infrastructure
- **Supabase Server** (`/supabase/functions/server/index.tsx`) 
  - Hono web server with CORS enabled
  - Supabase Auth integration
  - KV store for data persistence
  - File storage for machinery images
  - Comprehensive error logging

- **API Utility** (`/utils/api.ts`)
  - All API functions for frontend integration
  - TypeScript interfaces for type safety
  - Error handling and logging

### Completed Features

#### 1. Authentication System ✅
- **Farmer Registration** - `/make-server-a71b7664/signup`
  - Creates Supabase Auth user
  - Stores farmer data in KV store
  - Auto-login after registration
  - `FarmerRegistration.tsx` integrated

- **Farmer Login** - `/make-server-a71b7664/login`
  - Supabase Auth signin
  - Returns access token and farmer data
  - Session management via localStorage

- **Admin Login** - `/make-server-a71b7664/admin/login`
  - Admin credentials: `admin / admin123`
  - Token-based authentication
  - `AdminLogin.tsx` integrated

#### 2. Payment System ✅
- **Payment Verification** - `/make-server-a71b7664/payment/verify`
  - Verifies Razorpay payment (mock for prototype)
  - Updates farmer's payment status
  - Grants 10 listing slots per ₹125 payment
  - `PaymentPage.tsx` integrated

#### 3. Machinery Listings
- **Create Listing** - `/make-server-a71b7664/machinery/create`
  - Validates listing limit (10 per payment)
  - Uploads 4 images to Supabase Storage
  - Creates signed URLs for secure access
  - Stores listing in KV store
  
- **Get All Listings** - `/make-server-a71b7664/machinery/all`
  - Returns all active listings
  - Sorted by most recent first
  - Public access (no auth required)

- **Get My Listings** - `/make-server-a71b7664/machinery/my-listings`
  - Returns farmer's own listings
  - Requires authentication

- **Delete Listing** - `/make-server-a71b7664/machinery/:id`
  - Deletes images from storage
  - Removes listing from KV store
  - Updates farmer's listing count

#### 4. User Profile & Settings
- **Get Profile** - `/make-server-a71b7664/profile`
  - Returns farmer data and settings
  
- **Update Profile** - `/make-server-a71b7664/profile`
  - Updates name, village, district, language
  
- **Update Settings** - `/make-server-a71b7664/settings`
  - Saves notification preferences
  - Saves language and theme preferences

#### 5. Admin Endpoints
- **Get All Farmers** - `/make-server-a71b7664/admin/farmers`
  - Returns all registered farmers
  - Requires admin authentication

- **Get All Listings** - `/make-server-a71b7664/admin/listings`
  - Returns all listings (active and inactive)
  - Requires admin authentication

- **Delete Listing (Admin)** - `/make-server-a71b7664/admin/listing/:id`
  - Admin can delete any listing
  - Cleans up storage

- **Get Dashboard Stats** - `/make-server-a71b7664/admin/stats`
  - Total farmers, listings, payments
  - Revenue calculation

## 🔄 Pending Frontend Integration

The following components need to be updated to use the backend APIs:

### Priority 1: Core Features

#### BuyerPage.tsx
**Current State:** Uses mock data with `viewableListings` prop
**Needs:**
```typescript
import * as api from '../utils/api';

// On component mount, load all listings
useEffect(() => {
  const loadListings = async () => {
    const result = await api.getAllListings();
    if (result.success && result.listings) {
      setMachineryData(result.listings);
    }
  };
  loadListings();
}, []);
```

#### SellerPage.tsx
**Current State:** Simulates listing creation
**Needs:**
```typescript
import * as api from '../utils/api';

const handleSubmit = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const result = await api.createListing(accessToken, {
    machineName,
    brand,
    model,
    year,
    price,
    condition,
    description,
    images: uploadedImages // base64 array
  });
  
  if (result.success) {
    toast.success('Listing created!');
    // Refresh my listings
  }
};

// Load farmer's listings
const loadMyListings = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const result = await api.getMyListings(accessToken);
  if (result.success) {
    setMyListings(result.listings);
  }
};
```

#### AdminPanel.tsx
**Current State:** Uses mock data
**Needs:**
```typescript
import * as api from '../utils/api';

// Load admin data
useEffect(() => {
  const loadAdminData = async () => {
    const adminToken = localStorage.getItem('adminToken');
    
    const [farmersRes, listingsRes, statsRes] = await Promise.all([
      api.adminGetFarmers(adminToken),
      api.adminGetListings(adminToken),
      api.adminGetStats(adminToken)
    ]);
    
    if (farmersRes.success) setFarmers(farmersRes.farmers);
    if (listingsRes.success) setListings(listingsRes.listings);
    if (statsRes.success) setStats(statsRes.stats);
  };
  
  loadAdminData();
}, []);

// Delete listing
const handleDeleteListing = async (listingId) => {
  const adminToken = localStorage.getItem('adminToken');
  const result = await api.adminDeleteListing(adminToken, listingId);
  if (result.success) {
    toast.success('Listing deleted');
    // Refresh listings
  }
};
```

#### UserSettings.tsx
**Current State:** Stores settings in localStorage
**Needs:**
```typescript
import * as api from '../utils/api';

// Load settings on mount
useEffect(() => {
  const loadProfile = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const result = await api.getProfile(accessToken);
    if (result.success) {
      setProfile(result.profile);
      setSettings(result.settings);
    }
  };
  loadProfile();
}, []);

// Save profile changes
const handleSaveProfile = async (updates) => {
  const accessToken = localStorage.getItem('accessToken');
  const result = await api.updateProfile(accessToken, updates);
  if (result.success) {
    toast.success('Profile updated!');
  }
};

// Save settings
const handleSaveSettings = async (newSettings) => {
  const accessToken = localStorage.getItem('accessToken');
  const result = await api.updateSettings(accessToken, newSettings);
  if (result.success) {
    toast.success('Settings saved!');
  }
};
```

### Priority 2: Dashboard Enhancement

#### Dashboard.tsx
**Current State:** Shows static welcome screen
**Needs:**
```typescript
// Load farmer profile to show personalized info
const accessToken = localStorage.getItem('accessToken');
const result = await api.getProfile(accessToken);
if (result.success) {
  // Display farmer name, village, listing stats
  // Show "You have posted X of Y listings"
}
```

## 🔐 Authentication Flow

### New User Registration
1. User fills form on `FarmerRegistration.tsx`
2. Frontend calls `api.signup()` 
3. Backend creates Supabase Auth user
4. Backend stores farmer data in KV store
5. Frontend auto-logs in user
6. Access token stored in `localStorage`
7. User redirected to `PaymentPage`

### Returning User Login
1. Add login form (can be on LanguageSelection or new LoginPage)
2. Call `api.login(phone, password)`
3. Store accessToken in localStorage
4. Check if `farmer.hasPayment` is true
5. If yes → Dashboard, if no → PaymentPage

### Session Management
- Access tokens stored in `localStorage.getItem('accessToken')`
- Admin tokens stored in `localStorage.getItem('adminToken')`
- Tokens persist across page refreshes
- Add logout functionality to clear tokens

## 📦 Data Storage Structure

### KV Store Keys
```
farmer:{id} → FarmerData object
farmer:phone:{phone} → farmerId (for login lookup)
listing:{id} → MachineryListing object
listing:farmer:{farmerId}:{listingId} → listingId (for farmer's listings)
payment:{id} → Payment object
payment:farmer:{farmerId}:{paymentId} → Payment object
settings:{farmerId} → UserSettings object
admin:token:{token} → Admin session data
```

### Supabase Storage
- Bucket: `make-a71b7664-machinery-images`
- Files: `{listingId}_image_{0-3}.jpg`
- Access: Private bucket with signed URLs (1 year expiry)

## 🚀 Next Steps

1. **Update BuyerPage** to load real listings from backend
2. **Update SellerPage** to create and upload listings
3. **Update AdminPanel** to show real data and enable management
4. **Update UserSettings** to persist to backend
5. **Add Login Page** for returning farmers
6. **Add Logout** buttons to all pages
7. **Session Restoration** - Check for existing token on app load
8. **Error Handling** - Show user-friendly messages for network errors

## 🎯 Testing Checklist

- [ ] Register new farmer → Should create auth user + KV entry
- [ ] Login with existing farmer → Should return access token
- [ ] Make payment → Should increase maxListings to 10
- [ ] Create listing with 4 images → Should upload to storage
- [ ] View listings on BuyerPage → Should show all active listings
- [ ] Delete own listing → Should remove from KV and storage
- [ ] Admin login → Should grant access to admin panel
- [ ] Admin view all farmers → Should show all registered farmers
- [ ] Admin view all listings → Should show all listings
- [ ] Admin delete listing → Should work for any listing
- [ ] Update profile → Should persist changes
- [ ] Update settings → Should persist preferences

## 💡 Important Notes

### For Production
- Replace mock Razorpay with real Razorpay integration
- Add proper signature verification for payments
- Implement real email/SMS verification for auth
- Add rate limiting to prevent abuse
- Implement proper data backup strategy
- Add image compression before upload
- Implement CDN for image delivery
- Add pagination for large listings
- Implement search indexing for better performance

### Security
- Access tokens validate user identity
- Admin tokens separate from user tokens
- Private storage bucket with signed URLs
- Row-level security (implicit via KV keys)
- Never expose SUPABASE_SERVICE_ROLE_KEY to frontend

### Performance
- Signed URLs cached for 1 year
- KV store provides fast key-value lookup
- Prefix queries for efficient farmer listings
- Images uploaded in sequence (consider parallel upload)

## 📞 Support

If backend integration fails:
1. Check browser console for error logs
2. Check server logs in Supabase Functions dashboard
3. Verify `projectId` and `publicAnonKey` in `/utils/supabase/info`
4. Ensure Supabase connection is active
5. Test API endpoints manually using curl or Postman
