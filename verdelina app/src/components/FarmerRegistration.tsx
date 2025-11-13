import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Phone, MapPin, Tractor, ArrowRight, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FarmerData, Language } from '../App';
import { toast } from 'sonner@2.0.3';
import * as api from '../utils/api';

interface FarmerRegistrationProps {
  language: Language;
  onComplete: (data: FarmerData) => void;
}

const translations = {
  english: {
    title: 'Farmer Registration',
    subtitle: 'Join the Verdelina marketplace',
    fullName: 'Full Name',
    phone: 'Phone Number',
    village: 'Village',
    district: 'District',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    continue: 'Register & Continue',
    enterPassword: 'Create a secure password',
    confirmPasswordPlaceholder: 'Confirm your password',
    village_placeholder: 'Enter your village name',
    district_placeholder: 'Enter your district',
  },
  telugu: {
    title: 'రైతు నమోదు',
    subtitle: 'వెర్డెలినా మార్కెట్‌ప్లేస్‌లో చేరండి',
    fullName: 'పూర్తి పేరు',
    phone: 'ఫోన్ నంబర్',
    village: 'గ్రామం',
    district: 'జిల్లా',
    password: 'పాస్‌వర్డ్',
    confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
    continue: 'నమోదు & కొనసాగండి',
    enterPassword: 'సురక్షిత పాస్‌వర్డ్‌ను సృష్టించండి',
    confirmPasswordPlaceholder: 'మీ పాస్‌వర్డ్‌ను నిర్ధారించండి',
    village_placeholder: 'మీ గ్రామ పేరు నమోదు చేయండి',
    district_placeholder: 'మీ జిల్లాను నమోదు చేయండి',
  }
};

export default function FarmerRegistration({ language, onComplete }: FarmerRegistrationProps) {
  const t = translations[language];
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    village: '',
    district: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.village || !formData.district || !formData.password || !formData.confirmPassword) {
      toast.error(language === 'english' ? 'Please fill all fields' : 'దయచేసి అన్ని ఫీల్డ్‌లను పూరించండి');
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error(language === 'english' ? 'Please enter a valid 10-digit phone number' : 'దయచేసి చెల్లుబాటు అయ్యే 10-అంకెల ఫోన్ నంబర్‌ను నమోదు చేయండి');
      return;
    }

    if (formData.password.length < 6) {
      toast.error(language === 'english' ? 'Password must be at least 6 characters' : 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(language === 'english' ? 'Passwords do not match' : 'పాస్‌వర్డ్‌లు సరిపోలలేదు');
      return;
    }

    setLoading(true);

    try {
      const result = await api.signup({
        name: formData.name,
        phone: formData.phone,
        village: formData.village,
        district: formData.district,
        language: language === 'english' ? 'en' : 'te',
        password: formData.password,
      });

      if (result.success) {
        toast.success(language === 'english' ? 'Registration successful!' : 'నమోదు విజయవంతమైంది!');
        
        // Auto-login after registration
        const loginResult = await api.login(formData.phone, formData.password);
        
        if (loginResult.success && loginResult.farmer && loginResult.accessToken) {
          // Store access token
          localStorage.setItem('accessToken', loginResult.accessToken);
          localStorage.setItem('farmerId', loginResult.farmer.id);
          
          onComplete({
            name: formData.name,
            phone: formData.phone,
            address: `${formData.village}, ${formData.district}`,
            machineryType: ''
          });
        }
      } else {
        toast.error(result.error || (language === 'english' ? 'Registration failed' : 'నమోదు విఫలమైంది'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(language === 'english' ? 'An error occurred during registration' : 'నమోదు సమయంలో లోపం సంభవించింది');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-[#4CAF50] rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl text-[#2E7D32] mb-2">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                {t.fullName}
              </Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 rounded-xl"
                placeholder={language === 'english' ? 'Enter your full name' : 'మీ పూర్తి పేరు నమోదు చేయండి'}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4" />
                {t.phone}
              </Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                className="h-12 rounded-xl"
                placeholder={language === 'english' ? '10-digit mobile number' : '10-అంకెల మొబైల్ నంబర్'}
                maxLength={10}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                {t.village}
              </Label>
              <Input
                type="text"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="h-12 rounded-xl"
                placeholder={t.village_placeholder}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                {t.district}
              </Label>
              <Input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="h-12 rounded-xl"
                placeholder={t.district_placeholder}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4" />
                {t.password}
              </Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-12 rounded-xl"
                placeholder={t.enterPassword}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4" />
                {t.confirmPassword}
              </Label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="h-12 rounded-xl"
                placeholder={t.confirmPasswordPlaceholder}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#4CAF50] hover:bg-[#45A049] text-white text-xl rounded-xl shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (language === 'english' ? 'Registering...' : 'నమోదు చేస్తోంది...') : t.continue}
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}