import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpeg';
import { ThemeToggle } from '../components/ThemeToggle';
import toast from 'react-hot-toast';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const token = queryParams.get('token');

  useEffect(() => {
    if (!email || !token) {
      toast.error('Invalid or missing reset token.');
      navigate('/login');
    }
  }, [email, token, navigate]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !token) return;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email, token, password);
      // Wait a moment for success toast then redirect
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password.');
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
            <Link to="/" className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-glow mb-6 overflow-hidden border border-white/10 group">
              <img src={logo} alt="Code Vertex" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            </Link>
            <h1 className="text-3xl text-text-primary font-display tracking-tight heading-gradient">Set New Password</h1>
            <p className="text-text-muted text-sm mt-3 font-medium tracking-wide">Enter a new secure password for your account</p>
          </div>

          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest px-1">New Password</label>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full pr-12" 
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
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Confirm Password</label>
              <div className="relative group">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field w-full pr-12" 
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-glow group mt-8"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? 'Updating...' : 'Update Password'}
                {!isLoading && <ShieldCheck size={18} className="group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
