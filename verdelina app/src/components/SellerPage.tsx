import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Upload, X, Image as ImageIcon, Video, CheckCircle, AlertCircle, MapPin, DollarSign, FileText, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Language } from '../App';
import { toast } from 'sonner@2.0.3';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import UserSettings from './UserSettings';

interface SellerPageProps {
  language: Language;
  onBack: () => void;
  farmerName?: string;
}

const translations = {
  english: {
    title: 'List Your Machinery',
    subtitle: 'Sell to farmers across your region',
    machineName: 'Machine Name',
    machineType: 'Machine Type',
    condition: 'Condition',
    price: 'Price (₹)',
    description: 'Description',
    uploadImages: 'Upload Machine Images (All 4 Sides Required)',
    frontSide: 'Front Side',
    backSide: 'Back Side',
    leftSide: 'Left Side',
    rightSide: 'Right Side',
    uploadVideo: 'Upload Video (Optional)',
    preview: 'Preview',
    submit: 'List Machinery',
    success: 'Listing Created!',
    successMsg: 'Your machinery has been listed successfully',
    backToDashboard: 'Back to Dashboard',
    selectType: 'Select type',
    selectCondition: 'Select condition',
    tractor: 'Tractor',
    harvester: 'Harvester',
    tiller: 'Tiller',
    plough: 'Plough',
    seeder: 'Seeder',
    sprayer: 'Sprayer',
    other: 'Other',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    descPlaceholder: 'Describe your machinery, its features, usage history...',
    clickToUpload: 'Click to upload',
    allSidesRequired: 'All 4 sides are required'
  },
  telugu: {
    title: 'మీ యంత్రాన్ని జాబితా చేయండి',
    subtitle: 'మీ ప్రాంతంలోని రైతులకు అమ్మండి',
    machineName: 'యంత్ర పేరు',
    machineType: 'యంత్ర రకం',
    condition: 'స్థితి',
    price: 'ధర (₹)',
    description: 'వివరణ',
    uploadImages: 'యంత్ర చిత్రాలను అప్‌లోడ్ చేయండి (అన్ని 4 వైపులా అవసరం)',
    frontSide: 'ముందు వైపు',
    backSide: 'వెనుక వైపు',
    leftSide: 'ఎడమ వైపు',
    rightSide: 'కుడి వైపు',
    uploadVideo: 'వీడియోను అప్‌లోడ్ చేయండి (ఐచ్ఛికం)',
    preview: 'ప్రివ్యూ',
    submit: 'యంత్రాన్ని జాబితా చేయండి',
    success: 'జాబితా సృష్టించబడింది!',
    successMsg: 'మీ యంత్రం విజయవంతంగా జాబితా చేయబడింది',
    backToDashboard: 'డాష్‌బోర్డ్‌కు తిరిగి',
    selectType: 'రకాన్ని ఎంచుకోండి',
    selectCondition: 'స్థితిని ఎంచుకోండి',
    tractor: 'ట్రాక్టర్',
    harvester: 'హార్వెస్టర్',
    tiller: 'టిల్లర్',
    plough: 'నాగలి',
    seeder: 'విత్తన యంత్రం',
    sprayer: 'స్ప్రేయర్',
    other: 'ఇతర',
    excellent: 'అద్భుతమైన',
    good: 'మంచి',
    fair: 'సరైన',
    descPlaceholder: 'మీ యంత్రం, దాని లక్షణాలు, వినియోగ చరిత్రను వివరించండి...',
    clickToUpload: 'అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి',
    allSidesRequired: 'అన్ని 4 వైపులా అవసరం'
  }
};

interface MachineImages {
  front: string | null;
  back: string | null;
  left: string | null;
  right: string | null;
}

export default function SellerPage({ language, onBack, farmerName = 'Farmer' }: SellerPageProps) {
  const t = translations[language];
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    condition: '',
    price: '',
    description: '',
    location: ''
  });
  const [images, setImages] = useState<MachineImages>({
    front: null,
    back: null,
    left: null,
    right: null
  });
  const [video, setVideo] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Calculate form completion percentage
  const calculateProgress = () => {
    let completed = 0;
    const fields = 6; // name, type, condition, price, description, location
    const imageFields = 4; // 4 required images
    
    if (formData.name) completed++;
    if (formData.type) completed++;
    if (formData.condition) completed++;
    if (formData.price) completed++;
    if (formData.description) completed++;
    if (formData.location) completed++;
    
    const imageProgress = Object.values(images).filter(img => img !== null).length;
    
    return Math.round(((completed + imageProgress) / (fields + imageFields)) * 100);
  };

  const handleImageUpload = (side: keyof MachineImages, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => ({ ...prev, [side]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (side: keyof MachineImages) => {
    setImages(prev => ({ ...prev, [side]: null }));
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.type || !formData.condition || !formData.price || !formData.description) {
      toast.error(language === 'english' ? 'Please fill all required fields' : 'దయచేసి అన్ని అవసరమైన ఫీల్డ్‌లను పూరించండి');
      return;
    }

    if (!images.front || !images.back || !images.left || !images.right) {
      toast.error(language === 'english' ? 'Please upload all 4 side images of the machine' : 'దయచేసి యంత్రం యొక్క అన్ని 4 వైపుల చిత్రాలను అప్‌లోడ్ చేయండి');
      return;
    }

    // Mock submission
    setIsSuccess(true);
    
    // In a real app, you would send this data to your backend API
    console.log('Listing data:', { ...formData, images, video });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl text-[#2E7D32] mb-2">{t.success}</h2>
          <p className="text-gray-600 mb-6">{t.successMsg}</p>
          <Button
            onClick={onBack}
            className="w-full h-12 bg-[#4CAF50] hover:bg-[#45A049] text-white rounded-xl"
          >
            {t.backToDashboard}
          </Button>
        </motion.div>
      </div>
    );
  }

  const ImageUploadCard = ({ side, label }: { side: keyof MachineImages; label: string }) => (
    <div className="relative">
      <Label className="text-sm mb-2 block">{label}</Label>
      {!images[side] ? (
        <label
          htmlFor={`upload-${side}`}
          className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#4CAF50] transition-colors bg-gray-50"
        >
          <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">{t.clickToUpload}</span>
          <input
            id={`upload-${side}`}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(side, e)}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative h-32 rounded-xl overflow-hidden">
          <img src={images[side]!} alt={label} className="w-full h-full object-cover" />
          <button
            onClick={() => removeImage(side)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F1E8] pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#795548] to-[#6D4C41] text-white p-6 rounded-b-3xl shadow-lg mb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-white hover:bg-white/20 -ml-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {language === 'english' ? 'Back' : 'వెనుకకు'}
            </Button>
            <UserSettings 
              language={language} 
              farmerName={farmerName}
              onLogout={() => {
                toast.info(language === 'english' ? 'Logged out successfully' : 'విజయవంతంగా లాగ్ అవుట్ అయింది');
              }}
            />
          </div>
          <h1 className="text-2xl mb-1">{t.title}</h1>
          <p className="text-white/90">{t.subtitle}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>{t.machineName}</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 rounded-xl mt-2"
                placeholder={language === 'english' ? 'e.g., John Deere 5045D' : 'ఉదా., జాన్ డీరే 5045D'}
              />
            </div>

            <div>
              <Label>{t.machineType}</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="h-12 rounded-xl mt-2">
                  <SelectValue placeholder={t.selectType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tractor">{t.tractor}</SelectItem>
                  <SelectItem value="harvester">{t.harvester}</SelectItem>
                  <SelectItem value="tiller">{t.tiller}</SelectItem>
                  <SelectItem value="plough">{t.plough}</SelectItem>
                  <SelectItem value="seeder">{t.seeder}</SelectItem>
                  <SelectItem value="sprayer">{t.sprayer}</SelectItem>
                  <SelectItem value="other">{t.other}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t.condition}</Label>
              <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                <SelectTrigger className="h-12 rounded-xl mt-2">
                  <SelectValue placeholder={t.selectCondition} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">{t.excellent}</SelectItem>
                  <SelectItem value="good">{t.good}</SelectItem>
                  <SelectItem value="fair">{t.fair}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {t.price}
              </Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="h-12 rounded-xl mt-2"
                placeholder="50000"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {language === 'english' ? 'Location' : 'స్థానం'}
              </Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="h-12 rounded-xl mt-2"
                placeholder={language === 'english' ? 'Village, District, State' : 'గ్రామం, జిల్లా, రాష్ట్రం'}
              />
            </div>
          </div>

          <div>
            <Label>{t.description}</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="rounded-xl mt-2 min-h-24"
              placeholder={t.descPlaceholder}
            />
          </div>

          {/* Image Uploads - 4 Sides */}
          <div>
            <h3 className="text-lg text-[#2E7D32] mb-3">{t.uploadImages}</h3>
            <p className="text-sm text-gray-600 mb-4">{t.allSidesRequired}</p>
            <div className="grid grid-cols-2 gap-4">
              <ImageUploadCard side="front" label={t.frontSide} />
              <ImageUploadCard side="back" label={t.backSide} />
              <ImageUploadCard side="left" label={t.leftSide} />
              <ImageUploadCard side="right" label={t.rightSide} />
            </div>
          </div>

          {/* Video Upload */}
          <div>
            <Label className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              {t.uploadVideo}
            </Label>
            {!video ? (
              <label
                htmlFor="upload-video"
                className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#4CAF50] transition-colors bg-gray-50 mt-2"
              >
                <Video className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">{t.clickToUpload}</span>
                <input
                  id="upload-video"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative h-32 rounded-xl overflow-hidden mt-2">
                <video src={video} className="w-full h-full object-cover" />
                <button
                  onClick={removeVideo}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-14 bg-[#4CAF50] hover:bg-[#45A049] text-white text-xl rounded-xl shadow-lg transition-all hover:scale-105"
          >
            <Upload className="w-5 h-5 mr-2" />
            {t.submit}
          </Button>
        </form>
      </div>
    </div>
  );
}
