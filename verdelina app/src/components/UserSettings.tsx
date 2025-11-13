import { useState } from 'react';
import { Settings, User, Bell, Globe, Info, LogOut, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Language } from '../App';
import { toast } from 'sonner@2.0.3';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface UserSettingsProps {
  language: Language;
  farmerName: string;
  onLanguageChange?: (lang: Language) => void;
  onLogout?: () => void;
  trigger?: React.ReactNode;
}

const translations = {
  english: {
    settings: 'Settings',
    profile: 'Profile',
    notifications: 'Notifications',
    preferences: 'Preferences',
    about: 'About',
    name: 'Name',
    phone: 'Phone Number',
    address: 'Address',
    language: 'Language',
    selectLanguage: 'Select Language',
    english: 'English',
    telugu: 'Telugu',
    pushNotifications: 'Push Notifications',
    pushDesc: 'Receive alerts for new listings and updates',
    emailNotifications: 'Email Notifications',
    emailDesc: 'Get email updates about your listings',
    smsAlerts: 'SMS Alerts',
    smsDesc: 'Receive SMS for important updates',
    appVersion: 'App Version',
    aboutApp: 'About Verdelina Hub',
    aboutDesc: 'Verdelina Hub is a farmer-friendly marketplace for buying and selling agricultural machinery across Telangana and Andhra Pradesh.',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    logout: 'Logout',
    changesSaved: 'Settings saved successfully!',
    logoutConfirm: 'Are you sure you want to logout?'
  },
  telugu: {
    settings: 'సెట్టింగ్స్',
    profile: 'ప్రొఫైల్',
    notifications: 'నోటిఫికేషన్లు',
    preferences: 'ప్రాధాన్యతలు',
    about: 'గురించి',
    name: 'పేరు',
    phone: 'ఫోన్ నంబర్',
    address: 'చిరునామా',
    language: 'భాష',
    selectLanguage: 'భాషను ఎంచుకోండి',
    english: 'ఇంగ్లీష్',
    telugu: 'తెలుగు',
    pushNotifications: 'పుష్ నోటిఫికేషన్లు',
    pushDesc: 'కొత్త జాబితాలు మరియు నవీకరణల కోసం హెచ్చరికలను స్వీకరించండి',
    emailNotifications: 'ఇమెయిల్ నోటిఫికేషన్లు',
    emailDesc: 'మీ జాబితాల గురించి ఇమెయిల్ నవీకరణలను పొందండి',
    smsAlerts: 'SMS హెచ్చరికలు',
    smsDesc: 'ముఖ్యమైన నవీకరణల కోసం SMS స్వీకరించండి',
    appVersion: 'యాప్ వెర్షన్',
    aboutApp: 'వెర్డెలినా హబ్ గురించి',
    aboutDesc: 'వెర్డెలినా హబ్ అనేది తెలంగాణ మరియు ఆంధ్రప్రదేశ్ అంతటా వ్యవసాయ యంత్రాలను కొనుగోలు చేయడానికి మరియు అమ్మడానికి రైతు-స్నేహపూర్వక మార్కెట్‌ప్లేస్.',
    saveChanges: 'మార్పులను సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    logout: 'లాగౌట్',
    changesSaved: 'సెట్టింగ్స్ విజయవంతంగా సేవ్ చేయబడ్డాయి!',
    logoutConfirm: 'మీరు ఖచ్చితంగా లాగౌట్ చేయాలనుకుంటున్నారా?'
  }
};

export default function UserSettings({ 
  language, 
  farmerName, 
  onLanguageChange,
  onLogout,
  trigger 
}: UserSettingsProps) {
  const t = translations[language];
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [userName, setUserName] = useState(farmerName);

  const handleSaveChanges = () => {
    if (selectedLanguage !== language && onLanguageChange) {
      onLanguageChange(selectedLanguage);
    }
    toast.success(t.changesSaved);
    setOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      const confirmed = window.confirm(t.logoutConfirm);
      if (confirmed) {
        toast.info(language === 'english' ? 'Logging out...' : 'లాగ్ అవుట్ చేస్తోంది...');
        setTimeout(() => {
          onLogout();
        }, 500);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
            <Settings className="w-5 h-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#4CAF50]" />
            {t.settings}
          </DialogTitle>
          <DialogDescription>
            {language === 'english' ? 'Manage your account settings and preferences' : 'మీ ఖాతా సెట్టింగ్స్ మరియు ప్రాధాన్యతలను నిర్వహించండి'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="text-xs">
              <User className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">{t.profile}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs">
              <Bell className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">{t.notifications}</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="text-xs">
              <Globe className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">{t.preferences}</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="text-xs">
              <Info className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">{t.about}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.name}</Label>
              <Input
                id="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t.phone}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">{t.address}</Label>
              <Input
                id="address"
                placeholder="Village, District"
                className="h-11 rounded-xl"
              />
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <p className="text-sm">{t.pushNotifications}</p>
                <p className="text-xs text-gray-500">{t.pushDesc}</p>
              </div>
              <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <p className="text-sm">{t.emailNotifications}</p>
                <p className="text-xs text-gray-500">{t.emailDesc}</p>
              </div>
              <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <p className="text-sm">{t.smsAlerts}</p>
                <p className="text-xs text-gray-500">{t.smsDesc}</p>
              </div>
              <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="language">{t.language}</Label>
              <Select value={selectedLanguage} onValueChange={(val) => setSelectedLanguage(val as Language)}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder={t.selectLanguage} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">{t.english}</SelectItem>
                  <SelectItem value="telugu">{t.telugu}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-4 mt-4">
            <div className="p-4 bg-[#E8F5E9] rounded-xl">
              <h3 className="text-[#2E7D32] mb-2">{t.aboutApp}</h3>
              <p className="text-sm text-gray-700">{t.aboutDesc}</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">{t.appVersion}</p>
              <p className="text-sm">v1.0.0</p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t.logout}
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={handleSaveChanges}
              className="flex-1 sm:flex-none bg-[#4CAF50] hover:bg-[#45A049] text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {t.saveChanges}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
