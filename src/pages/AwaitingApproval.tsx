import React from 'react';
import { ShieldAlert, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';

const AwaitingApproval: React.FC = () => {
    return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center font-body py-8 overflow-y-auto">
      <div className="relative z-10 w-full max-w-lg px-6 animate-in py-12 flex-1 flex flex-col justify-center">
        <div className="glass-card p-10 rounded-card border-white/10 shadow-glow relative text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-glow mb-8 mx-auto border border-white/10 bg-primary/10">
            <Clock className="text-primary w-10 h-10 animate-pulse" />
          </div>
          
          <h1 className="text-3xl text-text-primary font-display tracking-tight heading-gradient mb-4">Registration Received!</h1>
          <p className="text-text-muted text-base mb-8 leading-relaxed">
            To maintain project security and quality, all new accounts are manually reviewed by our engineering team. 
            <br/><br/>
            You'll receive an email confirmation once your portal access is approved.
          </p>

          <div className="flex flex-col gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-left">
              <div className="flex items-center gap-3">
                <ShieldAlert size={18} className="text-primary" />
                <span className="text-sm font-bold text-text-primary uppercase tracking-widest">Next Steps</span>
              </div>
              <ul className="mt-3 space-y-2 text-xs text-text-muted">
                <li>• Admin review typically takes 2-4 hours.</li>
                <li>• We may contact you for project verification.</li>
                <li>• Check your inbox (including spam) for updates.</li>
              </ul>
            </div>

            <Link to="/login" className="btn-secondary flex items-center justify-center gap-2 mt-4 py-3 rounded-full font-bold uppercase tracking-widest text-xs">
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
      <Footer className="px-8 w-full" />
    </div>
    );
};

export default AwaitingApproval;
