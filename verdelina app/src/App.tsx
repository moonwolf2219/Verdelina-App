import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import LanguageSelection from './components/LanguageSelection';
import FarmerRegistration from './components/FarmerRegistration';
import PaymentPage from './components/PaymentPage';
import Dashboard from './components/Dashboard';
import BuyerPage from './components/BuyerPage';
import SellerPage from './components/SellerPage';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import { Toaster } from './components/ui/sonner';

export type Language = 'english' | 'telugu';

export interface FarmerData {
  name: string;
  phone: string;
  address: string;
  machineryType: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'language' | 'registration' | 'payment' | 'dashboard' | 'buyer' | 'seller' | 'adminLogin' | 'admin'>('splash');
  const [language, setLanguage] = useState<Language>('english');
  const [farmerData, setFarmerData] = useState<FarmerData | null>(null);
  const [viewableListings, setViewableListings] = useState<number>(10); // Start with 10 after first payment
  const [needsPayment, setNeedsPayment] = useState<boolean>(false);
  const [showAdminAccess, setShowAdminAccess] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Auto-navigate from splash to language selection after 3 seconds
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('language');
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Admin access: Click anywhere 5 times quickly on language screen
    let clickCount = 0;
    let clickTimer: NodeJS.Timeout;

    const handleAdminClick = () => {
      clickCount++;
      clearTimeout(clickTimer);
      
      if (clickCount === 5) {
        setShowAdminAccess(true);
        clickCount = 0;
      }
      
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 2000);
    };

    if (currentScreen === 'language') {
      window.addEventListener('click', handleAdminClick);
      return () => {
        window.removeEventListener('click', handleAdminClick);
        clearTimeout(clickTimer);
      };
    }
  }, [currentScreen]);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setCurrentScreen('registration');
  };

  const handleRegistrationComplete = (data: FarmerData) => {
    setFarmerData(data);
    setCurrentScreen('payment');
  };

  const handlePaymentSuccess = () => {
    setViewableListings(prev => prev + 10);
    setNeedsPayment(false);
    setCurrentScreen('dashboard');
  };

  const navigateTo = (screen: 'dashboard' | 'buyer' | 'seller' | 'adminLogin' | 'admin') => {
    setCurrentScreen(screen);
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setCurrentScreen('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setShowAdminAccess(false);
    setCurrentScreen('language');
  };

  const handleRequestMoreListings = () => {
    setNeedsPayment(true);
    setCurrentScreen('payment');
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {currentScreen === 'splash' && <SplashScreen />}
      {currentScreen === 'language' && (
        <>
          <LanguageSelection onSelect={handleLanguageSelect} />
          {showAdminAccess && (
            <div className="fixed bottom-6 right-6 z-50 animate-bounce">
              <button
                onClick={() => setCurrentScreen('adminLogin')}
                className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                🔐 Admin Access
              </button>
            </div>
          )}
        </>
      )}
      {currentScreen === 'registration' && (
        <FarmerRegistration 
          language={language} 
          onComplete={handleRegistrationComplete} 
        />
      )}
      {currentScreen === 'payment' && (
        <PaymentPage 
          language={language} 
          onPaymentSuccess={handlePaymentSuccess} 
        />
      )}
      {currentScreen === 'dashboard' && (
        <Dashboard 
          language={language}
          farmerName={farmerData?.name || 'Farmer'} 
          onNavigate={navigateTo} 
        />
      )}
      {currentScreen === 'buyer' && (
        <BuyerPage 
          language={language}
          viewableListings={viewableListings}
          onRequestMore={handleRequestMoreListings}
          onBack={() => navigateTo('dashboard')}
          farmerName={farmerData?.name || 'Farmer'} 
        />
      )}
      {currentScreen === 'seller' && (
        <SellerPage 
          language={language}
          onBack={() => navigateTo('dashboard')}
          farmerName={farmerData?.name || 'Farmer'} 
        />
      )}
      {currentScreen === 'adminLogin' && (
        <AdminLogin 
          onLoginSuccess={handleAdminLogin}
          onBack={() => setCurrentScreen('language')}
        />
      )}
      {currentScreen === 'admin' && (
        <AdminPanel onLogout={handleAdminLogout} />
      )}
      <Toaster />
    </div>
  );
}