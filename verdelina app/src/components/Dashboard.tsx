import { motion } from 'motion/react';
import { ShoppingCart, Store, TrendingUp, Users, Tractor, ChevronLeft, ChevronRight, Bell, Settings, HelpCircle, LogOut, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Language } from '../App';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import UserSettings from './UserSettings';

interface DashboardProps {
  language: Language;
  farmerName: string;
  onNavigate: (screen: 'buyer' | 'seller') => void;
}

const translations = {
  english: {
    welcome: 'Welcome',
    subtitle: 'Your farming machinery marketplace',
    buyer: 'Browse & Buy',
    buyerDesc: 'Find machinery for your farm',
    seller: 'List & Sell',
    sellerDesc: 'Sell your machinery',
    stats: {
      listings: 'Active Listings',
      buyers: 'Active Buyers',
      sold: 'Sold This Month'
    },
    featured: 'Featured Machinery'
  },
  telugu: {
    welcome: 'స్వాగతం',
    subtitle: 'మీ వ్యవసాయ యంత్ర మార్కెట్‌ప్లేస్',
    buyer: 'బ్రౌజ్ & కొనండి',
    buyerDesc: 'మీ పొలానికి యంత్రాలను కనుగొనండి',
    seller: 'లిస్ట్ & అమ్మండి',
    sellerDesc: 'మీ యంత్రాలను అమ్మండి',
    stats: {
      listings: 'క్రియాశీల జాబితాలు',
      buyers: 'క్రియాశీల కొనుగోలుదారులు',
      sold: 'ఈ నెలలో అమ్ముడైనవి'
    },
    featured: 'ఫీచర్ చేయబడిన యంత్రాలు'
  }
};

const machineryImages = [
  'https://images.unsplash.com/photo-1695566775365-0a2fb08ee4e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZmFybWluZ3xlbnwxfHx8fDE3NTk5NDc2Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMG1hY2hpbmVyeXxlbnwxfHx8fDE3NTk5NDc2Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1696441567861-6761b9e503a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwZXF1aXBtZW50fGVufDF8fHx8MTc1OTkyNDg2NHww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1706862609885-7771b001daa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVkZXIlMjBtYWNoaW5lfGVufDF8fHx8MTc1OTk0NzY3MHww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1532929900024-6413d2ed39c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWxsZXIlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzU5OTQ3NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080'
];

export default function Dashboard({ language, farmerName, onNavigate }: DashboardProps) {
  const t = translations[language];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [notificationCount, setNotificationCount] = useState(3);

  // Auto-scroll carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % machineryImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % machineryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + machineryImages.length) % machineryImages.length);
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] text-white p-6 rounded-b-3xl shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl mb-1">{t.welcome}, {farmerName}!</h1>
            <p className="text-white/90">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  toast.info(language === 'english' ? 'You have 3 new notifications' : 'మీకు 3 కొత్త నోటిఫికేషన్లు ఉన్నాయి');
                  setNotificationCount(0);
                }}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <Bell className="w-5 h-5" />
              </Button>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </div>
            <UserSettings 
              language={language} 
              farmerName={farmerName}
              onLogout={() => {
                // Implement logout logic here
                toast.info(language === 'english' ? 'Logged out successfully' : 'విజయవంతంగా లాగ్ అవుట్ అయింది');
              }}
            />
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer h-[110px]">
              <div className="flex flex-col items-center justify-center text-center h-full">
                <div className="bg-[#E8F5E9] p-2 rounded-full mb-2">
                  <TrendingUp className="w-5 h-5 text-[#4CAF50]" />
                </div>
                <p className="text-xl text-[#2E7D32] mb-0.5 leading-tight">156</p>
                <p className="text-xs text-gray-600 leading-tight">{t.stats.listings}</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer h-[110px]">
              <div className="flex flex-col items-center justify-center text-center h-full">
                <div className="bg-[#EFEBE9] p-2 rounded-full mb-2">
                  <Users className="w-5 h-5 text-[#795548]" />
                </div>
                <p className="text-xl text-[#2E7D32] mb-0.5 leading-tight">1,248</p>
                <p className="text-xs text-gray-600 leading-tight">{t.stats.buyers}</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer h-[110px]">
              <div className="flex flex-col items-center justify-center text-center h-full">
                <div className="bg-[#FFF3E0] p-2 rounded-full mb-2">
                  <Tractor className="w-5 h-5 text-[#FF9800]" />
                </div>
                <p className="text-xl text-[#2E7D32] mb-0.5 leading-tight">42</p>
                <p className="text-xs text-gray-600 leading-tight">{t.stats.sold}</p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Featured Machinery Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h2 className="text-xl text-[#2E7D32] mb-3">{t.featured}</h2>
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-64">
              <ImageWithFallback
                src={machineryImages[currentImageIndex]}
                alt="Featured machinery"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-[#2E7D32]" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            >
              <ChevronRight className="w-6 h-6 text-[#2E7D32]" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {machineryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={() => onNavigate('buyer')}
              className="w-full h-32 bg-gradient-to-br from-[#4CAF50] to-[#45A049] hover:from-[#45A049] hover:to-[#4CAF50] text-white rounded-2xl shadow-xl transition-all hover:scale-105 flex flex-col items-center justify-center gap-3"
            >
              <ShoppingCart className="w-12 h-12" />
              <div>
                <p className="text-2xl mb-1">{t.buyer}</p>
                <p className="text-sm text-white/90">{t.buyerDesc}</p>
              </div>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={() => onNavigate('seller')}
              className="w-full h-32 bg-gradient-to-br from-[#795548] to-[#6D4C41] hover:from-[#6D4C41] hover:to-[#795548] text-white rounded-2xl shadow-xl transition-all hover:scale-105 flex flex-col items-center justify-center gap-3"
            >
              <Store className="w-12 h-12" />
              <div>
                <p className="text-2xl mb-1">{t.seller}</p>
                <p className="text-sm text-white/90">{t.sellerDesc}</p>
              </div>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
