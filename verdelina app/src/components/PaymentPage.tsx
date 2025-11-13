import { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, CheckCircle, Loader2, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { Language } from '../App';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import * as api from '../utils/api';

interface PaymentPageProps {
  language: Language;
  onPaymentSuccess: () => void;
}

const translations = {
  english: {
    title: 'Payment',
    subtitle: 'Complete your registration',
    fee: 'Registration Fee',
    amount: '₹125',
    description: 'Access fee for 10 machinery listings',
    selectPayment: 'Select Payment Method',
    payWith: 'Pay with',
    payNow: 'Pay Now',
    processing: 'Processing Payment...',
    success: 'Payment Successful!',
    redirect: 'Redirecting to dashboard...',
    phonepe: 'PhonePe',
    gpay: 'Google Pay',
    paytm: 'Paytm'
  },
  telugu: {
    title: 'చెల్లింపు',
    subtitle: 'మీ నమోదును పూర్తి చేయండి',
    fee: 'నమోదు రుసుము',
    amount: '₹125',
    description: '10 యంత్ర జాబితాల కోసం యాక్సెస్ రుసుము',
    selectPayment: 'చెల్లింపు పద్ధతిని ఎంచుకోండి',
    payWith: 'దీనితో చెల్లించండి',
    payNow: 'ఇప్పుడు చెల్లించండి',
    processing: 'చెల్లింపు ప్రాసెస్ అవుతోంది...',
    success: 'చెల్లింపు విజయవంతం!',
    redirect: 'డాష్‌బోర్డ్‌కు మళ్లిస్తోంది...',
    phonepe: 'PhonePe',
    gpay: 'Google Pay',
    paytm: 'Paytm'
  }
};

export default function PaymentPage({ language, onPaymentSuccess }: PaymentPageProps) {
  const t = translations[language];
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('phonepe');

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Simulate Razorpay payment processing
      // In production, you would initialize Razorpay here and get actual payment details
      
      // Simulating successful payment response
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockPaymentData = {
        paymentId: `pay_${Date.now()}`,
        orderId: `order_${Date.now()}`,
        signature: `sig_${Date.now()}`,
      };

      // Verify payment with backend
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error(language === 'english' ? 'Please log in again' : 'దయచేసి మళ్లీ లాగిన్ చేయండి');
        return;
      }

      const result = await api.verifyPayment(accessToken, mockPaymentData);

      if (result.success) {
        setIsProcessing(false);
        setIsSuccess(true);
        
        toast.success(language === 'english' ? 'Payment successful! You can now post 10 listings.' : 'చెల్లింపు విజయవంతం! మీరు ఇప్పుడు 10 జాబితాలను పోస్ట్ చేయవచ్చు.');

        // Redirect to dashboard after success (2 seconds)
        setTimeout(() => {
          onPaymentSuccess();
        }, 2000);
      } else {
        setIsProcessing(false);
        toast.error(result.error || (language === 'english' ? 'Payment verification failed' : 'చెల్లింపు ధృవీకరణ విఫలమైంది'));
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setIsProcessing(false);
      toast.error(language === 'english' ? 'Payment failed. Please try again.' : 'చెల్లింపు విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {!isSuccess ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto bg-[#4CAF50] rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl text-[#2E7D32] mb-2">{t.title}</h1>
                <p className="text-gray-600">{t.subtitle}</p>
              </div>

              <div className="bg-gradient-to-br from-[#4CAF50]/10 to-[#2E7D32]/10 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">{t.fee}</span>
                  <span className="text-3xl text-[#2E7D32]">{t.amount}</span>
                </div>
                <p className="text-gray-600 text-sm">{t.description}</p>
              </div>

              <div className="mb-6">
                <Label className="mb-3 block">{t.selectPayment}</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <div className="flex items-center space-x-2 p-4 rounded-xl border-2 border-gray-200 hover:border-[#4CAF50] transition-colors cursor-pointer">
                    <RadioGroupItem value="phonepe" id="phonepe" />
                    <Label htmlFor="phonepe" className="flex items-center gap-2 cursor-pointer flex-1">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <span>{t.phonepe}</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 rounded-xl border-2 border-gray-200 hover:border-[#4CAF50] transition-colors cursor-pointer">
                    <RadioGroupItem value="gpay" id="gpay" />
                    <Label htmlFor="gpay" className="flex items-center gap-2 cursor-pointer flex-1">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <span>{t.gpay}</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 rounded-xl border-2 border-gray-200 hover:border-[#4CAF50] transition-colors cursor-pointer">
                    <RadioGroupItem value="paytm" id="paytm" />
                    <Label htmlFor="paytm" className="flex items-center gap-2 cursor-pointer flex-1">
                      <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <span>{t.paytm}</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    {language === 'english' 
                      ? 'View 10 machinery listings' 
                      : '10 యంత్ర జాబితాలను చూడండి'}
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    {language === 'english' 
                      ? 'Each listing has 4 images + 1 video' 
                      : 'ప్రతి జాబితాలో 4 చిత్రాలు + 1 వీడియో ఉంటుంది'}
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    {language === 'english' 
                      ? 'Pay ₹125 again to view 10 more' 
                      : 'మరో 10 చూడటానికి మళ్లీ ₹125 చెల్లించండి'}
                  </p>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full h-14 bg-[#4CAF50] hover:bg-[#45A049] text-white text-xl rounded-xl shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t.processing}
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    {t.payNow}
                  </>
                )}
              </Button>

              <p className="text-center text-gray-500 text-xs mt-4">
                {language === 'english' 
                  ? '🔒 Powered by Razorpay (Mock for demo)' 
                  : '🔒 Razorpay ద్వారా శక్తివంతం (డెమో కోసం మాక్)'}
              </p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl text-[#2E7D32] mb-2">{t.success}</h2>
              <p className="text-gray-600 mb-6">{t.redirect}</p>
              <div className="w-12 h-12 mx-auto border-4 border-[#4CAF50]/30 border-t-[#4CAF50] rounded-full animate-spin"></div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}