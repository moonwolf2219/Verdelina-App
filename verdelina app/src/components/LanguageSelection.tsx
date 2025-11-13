import image_9727a3cc8f5049e6fbcace565cc716ba46708df4 from 'figma:asset/9727a3cc8f5049e6fbcace565cc716ba46708df4.png';
import { motion } from 'motion/react';
import { Languages, Tractor } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LanguageSelectionProps {
  onSelect: (language: 'english' | 'telugu') => void;
}

export default function LanguageSelection({ onSelect }: LanguageSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-white shadow-md">
              <ImageWithFallback 
                src={image_9727a3cc8f5049e6fbcace565cc716ba46708df4}
                alt="Verdelina Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Languages className="w-5 h-5" />
              <p>Select Your Language</p>
            </div>
            <p className="text-gray-600 mt-2">భాషను ఎంచుకోండి</p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => onSelect('english')}
              className="w-full h-16 bg-[#4CAF50] hover:bg-[#45A049] text-white text-xl rounded-xl shadow-lg transition-all hover:scale-105"
            >
              English
            </Button>

            <Button
              onClick={() => onSelect('telugu')}
              className="w-full h-16 bg-[#795548] hover:bg-[#6D4C41] text-white text-xl rounded-xl shadow-lg transition-all hover:scale-105"
            >
              తెలుగు (Telugu)
            </Button>
          </div>

          <p className="text-center text-gray-500 mt-6 text-sm">
            Choose your preferred language to continue
          </p>
        </div>
      </motion.div>
    </div>
  );
}
