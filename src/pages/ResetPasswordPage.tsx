import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpeg';
import { Footer } from '../components/Footer';
import { ThemeToggle } from '../components/ThemeToggle';
import toast from 'react-hot-toast';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updatePassword, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated via email link
  // Supabase automatically signs the user in when they click the reset link
  useEffect(() => {
    const checkAuth = async () => {
      // Small delay to allow session to initialize
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!isAuthenticated) {
        // If still not authenticated, they might have landed here without a valid link session
        // toast.error('Invalid or expired reset session. Please request a new link.');
        // navigate('/forgot-password');
      }
    };
    checkAuth();
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(password);
      navigate('/login');
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative flex flex-col items-center justify-center font-body py-8 overflow-y-auto">
      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle className="bg-surface/50 border border-white/5 backdrop-blur-md" />
      </div>
      <div className="relative z-10 w-full max-w-lg px-6 animate-in py-12 flex-1 flex flex-col justify-center">
        <div className="glass-card rounded-card border-white/10 shadow-glow relative">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-glow mb-6 overflow-hidden border border-white/10 group">
              <img src={logo} alt="Code Vertex" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            </div>
            <h1 className="text-3xl text-text-primary font-display tracking-tight heading-gradient">New Password</h1>
            <p className="text-text-muted text-sm mt-3 font-medium tracking-wide">Enter your new secure password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest">New Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full pl-12 pr-12" 
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field w-full pl-12 pr-12" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-glow group"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? 'Updating...' : 'Update Password'}
                {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>
        </div>
      </div>
      <Footer className="px-8 w-full" />
    </div>
  );
};

export default ResetPasswordPage; 
