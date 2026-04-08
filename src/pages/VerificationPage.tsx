import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MailCheck, ArrowRight } from 'lucide-react';
import { Footer } from '../components/Footer';

const VerificationPage: React.FC = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Focus first input on mount
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace auto focus
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
        if (pastedData.some(char => !/^\d+$/.test(char))) return;

        const newOtp = [...otp];
        pastedData.forEach((char, i) => {
            if (i < 6) newOtp[i] = char;
        });
        setOtp(newOtp);
        
        // Focus last filled input
        const focusIndex = Math.min(pastedData.length, 5);
        inputRefs.current[focusIndex]?.focus();
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length !== 6) return;

        setIsVerifying(true);
        // Mock verification delay
        setTimeout(() => {
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background relative flex flex-col items-center justify-center font-body py-8 overflow-y-auto">
      <div className="relative z-10 w-full max-w-lg px-6 animate-in py-12 flex-1 flex flex-col justify-center">
        <div className="glass-card p-10 rounded-card border-white/10 shadow-glow relative">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-glow mb-6 border border-primary/20">
              <MailCheck className="text-primary w-10 h-10" />
            </div>
            <h1 className="text-3xl text-text-primary font-display tracking-tight heading-gradient">Verify Email</h1>
            <p className="text-text-muted text-sm mt-3 font-medium tracking-wide">
              We've sent a 6-digit code to <br />
              <span className="text-text-primary font-bold">{location.state?.email || 'your email'}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-8">
            <div className="flex justify-between gap-2 max-w-xs mx-auto">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-bold text-text-primary focus:border-primary/50 focus:bg-white/10 transition-all outline-none"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isVerifying || otp.some((d) => d === '')}
              className="btn-primary w-full py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-glow group"
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Confirm Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <p className="text-sm text-text-muted">
              Didn't receive the code? <button className="text-primary hover:underline font-bold transition-all ml-1">Click to resend</button>
            </p>
          </div>
        </div>
      </div>
      <Footer className="px-8 w-full" />
    </div>
    );
};

export default VerificationPage;
