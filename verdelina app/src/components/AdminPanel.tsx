import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Users, 
  Package, 
  TrendingUp, 
  Search, 
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  Eye,
  Trash2,
  ShieldCheck,
  LogOut,
  Bell,
  Plus,
  Edit,
  DollarSign,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';

// Mock data for listings
const mockListings = [
  {
    id: 1,
    sellerName: 'Ramesh Kumar',
    phone: '9876543210',
    machineryType: 'Tractor',
    brand: 'John Deere',
    price: '₹8,50,000',
    status: 'pending',
    date: '2025-10-15',
    location: 'Guntur, AP'
  },
  {
    id: 2,
    sellerName: 'Sita Devi',
    phone: '9123456789',
    machineryType: 'Harvester',
    brand: 'Mahindra',
    price: '₹12,00,000',
    status: 'approved',
    date: '2025-10-14',
    location: 'Krishna, AP'
  },
  {
    id: 3,
    sellerName: 'Venkat Rao',
    phone: '9988776655',
    machineryType: 'Tiller',
    brand: 'VST',
    price: '₹45,000',
    status: 'rejected',
    date: '2025-10-13',
    location: 'Warangal, TS'
  },
  {
    id: 4,
    sellerName: 'Krishna Murthy',
    phone: '9445566778',
    machineryType: 'Seeder',
    brand: 'Fieldking',
    price: '₹75,000',
    status: 'approved',
    date: '2025-10-12',
    location: 'Kurnool, AP'
  },
  {
    id: 5,
    sellerName: 'Lakshmi Reddy',
    phone: '9334455667',
    machineryType: 'Sprayer',
    brand: 'KisanKraft',
    price: '₹35,000',
    status: 'pending',
    date: '2025-10-11',
    location: 'Nalgonda, TS'
  },
];

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: 'Ramesh Kumar',
    phone: '9876543210',
    address: 'Guntur, AP',
    joinDate: '2025-09-20',
    totalListings: 3,
    status: 'active'
  },
  {
    id: 2,
    name: 'Sita Devi',
    phone: '9123456789',
    address: 'Krishna, AP',
    joinDate: '2025-09-15',
    totalListings: 5,
    status: 'active'
  },
  {
    id: 3,
    name: 'Venkat Rao',
    phone: '9988776655',
    address: 'Warangal, TS',
    joinDate: '2025-10-01',
    totalListings: 1,
    status: 'suspended'
  },
];

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTab, setSelectedTab] = useState('listings');
  const [listings, setListings] = useState(mockListings);
  const [users, setUsers] = useState(mockUsers);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationCount, setNotificationCount] = useState(12);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300"><CheckCircle className="w-3 h-3 mr-1" /> Active</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300"><XCircle className="w-3 h-3 mr-1" /> Suspended</Badge>;
      default:
        return null;
    }
  };

  const filteredListings = mockListings.filter(listing => {
    const matchesSearch = 
      listing.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.machineryType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

  // Action handlers
  const handleApproveListing = (listing: any) => {
    setListings(listings.map(l => 
      l.id === listing.id ? { ...l, status: 'approved' } : l
    ));
    toast.success(`Listing #${listing.id} approved successfully!`);
    setIsDialogOpen(false);
  };

  const handleRejectListing = (listing: any) => {
    setListings(listings.map(l => 
      l.id === listing.id ? { ...l, status: 'rejected' } : l
    ));
    toast.error(`Listing #${listing.id} rejected`);
    setIsDialogOpen(false);
  };

  const handleDeleteListing = (listing: any) => {
    setListings(listings.filter(l => l.id !== listing.id));
    toast.success(`Listing #${listing.id} deleted`);
    setIsDialogOpen(false);
  };

  const handleSuspendUser = (user: any) => {
    setUsers(users.map(u => 
      u.id === user.id ? { ...u, status: 'suspended' } : u
    ));
    toast.warning(`User ${user.name} suspended`);
    setIsUserDialogOpen(false);
  };

  const handleActivateUser = (user: any) => {
    setUsers(users.map(u => 
      u.id === user.id ? { ...u, status: 'active' } : u
    ));
    toast.success(`User ${user.name} activated`);
    setIsUserDialogOpen(false);
  };

  const handleDeleteUser = (user: any) => {
    setUsers(users.filter(u => u.id !== user.id));
    toast.success(`User ${user.name} deleted`);
    setIsUserDialogOpen(false);
  };

  const handleExport = () => {
    toast.success('Data exported successfully!');
  };

  const handleRefresh = () => {
    toast.success('Data refreshed!');
  };

  const handleLogout = () => {
    toast.info('Logging out...');
    setTimeout(() => {
      onLogout();
    }, 500);
  };

  const stats = {
    totalListings: listings.length,
    pendingReview: listings.filter(l => l.status === 'pending').length,
    totalUsers: users.length,
    revenue: '₹1.56L'
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-2xl">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl">Admin Panel</h1>
                <p className="text-white/90 text-sm">Verdelina Agri Hub Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hidden sm:flex"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-red-600/90 border-red-500/30 text-white hover:bg-red-700"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-white rounded-2xl shadow-md border-l-4 border-l-[#4CAF50]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Listings</p>
                  <p className="text-3xl text-[#2E7D32]">{stats.totalListings}</p>
                  <p className="text-xs text-green-600 mt-1">+12 this week</p>
                </div>
                <Package className="w-10 h-10 text-[#4CAF50]" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-white rounded-2xl shadow-md border-l-4 border-l-[#FF9800]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Pending Review</p>
                  <p className="text-3xl text-[#2E7D32]">{stats.pendingReview}</p>
                  <p className="text-xs text-orange-600 mt-1">Needs attention</p>
                </div>
                <Clock className="w-10 h-10 text-[#FF9800]" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-white rounded-2xl shadow-md border-l-4 border-l-[#795548]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Users</p>
                  <p className="text-3xl text-[#2E7D32]">{stats.totalUsers}</p>
                  <p className="text-xs text-blue-600 mt-1">+48 this month</p>
                </div>
                <Users className="w-10 h-10 text-[#795548]" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-white rounded-2xl shadow-md border-l-4 border-l-[#2196F3]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Revenue</p>
                  <p className="text-3xl text-[#2E7D32]">{stats.revenue}</p>
                  <p className="text-xs text-green-600 mt-1">+24% vs last month</p>
                </div>
                <TrendingUp className="w-10 h-10 text-[#2196F3]" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6 h-auto">
                <TabsTrigger value="listings" className="text-sm md:text-lg py-3">
                  <Package className="w-4 h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Machinery Listings</span>
                  <span className="sm:hidden">Listings</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="text-sm md:text-lg py-3">
                  <Users className="w-4 h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">User Management</span>
                  <span className="sm:hidden">Users</span>
                </TabsTrigger>
              </TabsList>

              {/* Search and Filter Bar */}
              <div className="flex flex-col gap-3 mb-4 md:mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder={selectedTab === 'listings' ? "Search listings..." : "Search users..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 rounded-xl w-full"
                    />
                  </div>
                  {selectedTab === 'listings' && (
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button 
                    onClick={handleExport}
                    className="h-12 px-6 bg-[#4CAF50] hover:bg-[#45A049] text-white rounded-xl flex-1 sm:flex-none"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  {selectedTab === 'listings' && (
                    <Button 
                      onClick={() => toast.info('Add new listing feature coming soon')}
                      className="h-12 px-6 bg-[#795548] hover:bg-[#6D4C41] text-white rounded-xl flex-1 sm:flex-none"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Listing
                    </Button>
                  )}
                </div>
              </div>

              <TabsContent value="listings" className="mt-0">
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">ID</TableHead>
                          <TableHead className="whitespace-nowrap">Seller</TableHead>
                          <TableHead className="whitespace-nowrap">Machinery</TableHead>
                          <TableHead className="whitespace-nowrap">Brand</TableHead>
                          <TableHead className="whitespace-nowrap">Price</TableHead>
                          <TableHead className="whitespace-nowrap">Location</TableHead>
                          <TableHead className="whitespace-nowrap">Date</TableHead>
                          <TableHead className="whitespace-nowrap">Status</TableHead>
                          <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredListings.map((listing) => (
                          <TableRow key={listing.id}>
                            <TableCell className="whitespace-nowrap">#{listing.id}</TableCell>
                            <TableCell className="min-w-[150px]">
                              <div>
                                <p className="truncate max-w-[150px]">{listing.sellerName}</p>
                                <p className="text-sm text-gray-500 truncate max-w-[150px]">{listing.phone}</p>
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">{listing.machineryType}</TableCell>
                            <TableCell className="whitespace-nowrap">{listing.brand}</TableCell>
                            <TableCell className="whitespace-nowrap">{listing.price}</TableCell>
                            <TableCell className="whitespace-nowrap">{listing.location}</TableCell>
                            <TableCell className="text-sm text-gray-500 whitespace-nowrap">{listing.date}</TableCell>
                            <TableCell className="whitespace-nowrap">{getStatusBadge(listing.status)}</TableCell>
                            <TableCell className="whitespace-nowrap text-right">
                              <Dialog open={isDialogOpen && selectedListing?.id === listing.id} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (open) setSelectedListing(listing);
                              }}>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[90vw] sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Listing Actions</DialogTitle>
                                    <DialogDescription className="break-words">
                                      Manage listing #{listing.id} - {listing.machineryType}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-2 mt-4">
                                    <Button 
                                      onClick={() => {
                                        toast.info(`Viewing details for listing #${listing.id}`);
                                        setIsDialogOpen(false);
                                      }}
                                      className="w-full justify-start h-11" 
                                      variant="outline"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </Button>
                                    <Button 
                                      onClick={() => handleApproveListing(listing)}
                                      className="w-full justify-start bg-green-600 hover:bg-green-700 text-white h-11"
                                      disabled={listing.status === 'approved'}
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Approve Listing
                                    </Button>
                                    <Button 
                                      onClick={() => handleRejectListing(listing)}
                                      className="w-full justify-start bg-red-600 hover:bg-red-700 text-white h-11"
                                      disabled={listing.status === 'rejected'}
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Reject Listing
                                    </Button>
                                    <Button 
                                      onClick={() => handleDeleteListing(listing)}
                                      className="w-full justify-start bg-gray-600 hover:bg-gray-700 text-white h-11"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">ID</TableHead>
                          <TableHead className="whitespace-nowrap">Name</TableHead>
                          <TableHead className="whitespace-nowrap">Phone</TableHead>
                          <TableHead className="whitespace-nowrap">Address</TableHead>
                          <TableHead className="whitespace-nowrap">Join Date</TableHead>
                          <TableHead className="whitespace-nowrap">Listings</TableHead>
                          <TableHead className="whitespace-nowrap">Status</TableHead>
                          <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="whitespace-nowrap">#{user.id}</TableCell>
                            <TableCell className="whitespace-nowrap">{user.name}</TableCell>
                            <TableCell className="whitespace-nowrap">{user.phone}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{user.address}</TableCell>
                            <TableCell className="text-sm text-gray-500 whitespace-nowrap">{user.joinDate}</TableCell>
                            <TableCell className="whitespace-nowrap">{user.totalListings}</TableCell>
                            <TableCell className="whitespace-nowrap">{getStatusBadge(user.status)}</TableCell>
                            <TableCell className="whitespace-nowrap text-right">
                              <Dialog open={isUserDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                                setIsUserDialogOpen(open);
                                if (open) setSelectedUser(user);
                              }}>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[90vw] sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>User Actions</DialogTitle>
                                    <DialogDescription className="break-words">
                                      Manage user: {user.name}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-2 mt-4">
                                    <Button 
                                      onClick={() => {
                                        toast.info(`Viewing profile for ${user.name}`);
                                        setIsUserDialogOpen(false);
                                      }}
                                      className="w-full justify-start h-11" 
                                      variant="outline"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Profile
                                    </Button>
                                    {user.status === 'active' ? (
                                      <Button 
                                        onClick={() => handleSuspendUser(user)}
                                        className="w-full justify-start bg-yellow-600 hover:bg-yellow-700 text-white h-11"
                                      >
                                        <Clock className="w-4 h-4 mr-2" />
                                        Suspend User
                                      </Button>
                                    ) : (
                                      <Button 
                                        onClick={() => handleActivateUser(user)}
                                        className="w-full justify-start bg-green-600 hover:bg-green-700 text-white h-11"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Activate User
                                      </Button>
                                    )}
                                    <Button 
                                      onClick={() => handleDeleteUser(user)}
                                      className="w-full justify-start bg-red-600 hover:bg-red-700 text-white h-11"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete User
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
