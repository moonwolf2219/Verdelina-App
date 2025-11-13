import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, User, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import * as api from '../utils/api';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBack }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await api.adminLogin(credentials.username, credentials.password);
      
      if (result.success && result.accessToken) {
        toast.success('Login successful! Welcome Admin');
        localStorage.setItem('adminToken', result.accessToken);
        onLoginSuccess();
      } else {
        toast.error(result.error || 'Invalid credentials. Try: admin / admin123');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl text-[#2E7D32] mb-2">Admin Access</h1>
            <p className="text-gray-600">Verdelina Agri Hub Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                Username
              </Label>
              <Input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="h-12 rounded-xl"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="h-12 rounded-xl"
                placeholder="Enter password"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-sm text-blue-800">
                <strong>Demo Credentials:</strong><br />
                Username: admin<br />
                Password: admin123
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] hover:from-[#1B5E20] hover:to-[#2E7D32] text-white text-xl rounded-xl shadow-lg"
            >
              {isLoading ? 'Logging in...' : 'Login as Admin'}
            </Button>

            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to App
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}