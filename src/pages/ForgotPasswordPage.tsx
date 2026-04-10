import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpeg';
import { Footer } from '../components/Footer';
import { ThemeToggle } from '../components/ThemeToggle';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await resetPassword(email);
      setIsSent(true);
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
            <Link to="/login" className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-glow mb-6 overflow-hidden border border-white/10 group">
              <img src={logo} alt="Code Vertex" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            </Link>
            <h1 className="text-3xl text-text-primary font-display tracking-tight heading-gradient">Reset Password</h1>
            <p className="text-text-muted text-sm mt-3 font-medium tracking-wide text-center px-4">
              {isSent 
                ? "If an account exists for this email, you will receive a password reset link shortly."
                : "Enter your email address and we'll send you a link to reset your password."
              }
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field w-full pl-12" 
                    placeholder="engineering@codevertex.solutions"
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
                  {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                  {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </span>
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
               <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-6">
                  <Mail className="text-success" size={32} />
               </div>
               <button 
                  onClick={() => setIsSent(false)}
                  className="text-primary hover:underline font-bold text-sm"
               >
                  Didn't receive an email? Try again
               </button>
            </div>
          )}

          <div className="mt-8 text-center pt-8 border-t border-white/5">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors font-bold">
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
      <Footer className="px-8 w-full" />
    </div>
  );
};

export default ForgotPasswordPage; 
