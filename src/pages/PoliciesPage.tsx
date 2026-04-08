import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileText, Lock, Clock, HelpCircle, ChevronRight, CheckCircle2 } from 'lucide-react';

const policies = [
  {
    id: 'tos',
    icon: FileText,
    title: 'Terms of Service',
    description: 'Guidelines and rules for using the Code Vertex platform and services.',
    content: (
      <div className="space-y-4 text-text-muted">
        <p>By accessing our client portal, you agree to these terms of service. This portal is designed exclusively for Code Vertex clients to manage their ongoing projects.</p>
        <h4 className="text-text-primary font-medium mt-4">1. Scope of Services</h4>
        <p>The scope of each project is defined in mutually agreed proposals and contracts. Any additional requests outside the scope are subject to review and may incur extra costs.</p>
        <h4 className="text-text-primary font-medium mt-4">2. Usage Rules</h4>
        <p>Clients must maintain the confidentiality of their portal access credentials. You are responsible for all activities occurring under your account.</p>
        <h4 className="text-text-primary font-medium mt-4">3. Termination</h4>
        <p>We reserve the right to suspend access if any terms are broken or if accounts are inactive for prolonged periods following project completion.</p>
      </div>
    )
  },
  {
    id: 'privacy',
    icon: Lock,
    title: 'Privacy Policy',
    description: 'How we collect, store, and protect your data.',
    content: (
      <div className="space-y-4 text-text-muted">
        <p>Your privacy is important to us. Here is how we handle your data within the Code Vertex infrastructure.</p>
        <h4 className="text-text-primary font-medium mt-4">Data Collection</h4>
        <p>We collect information necessary for project execution, including contact details, billing information, and technical requirements.</p>
        <h4 className="text-text-primary font-medium mt-4">Storage & Security</h4>
        <p>All client data is isolated via multi-tenant DB architecture and stored securely. We utilize industry-standard encryption for data at rest and in transit.</p>
        <h4 className="text-text-primary font-medium mt-4">Third-Party Tools</h4>
        <p>We may share limited logistical data with secure 3rd-party integrations (like payment gateways) strictly for processing operations.</p>
      </div>
    )
  },
  {
    id: 'nda',
    icon: Shield,
    title: 'Non-Disclosure Agreement (NDA)',
    description: 'Mutual data protection for sensitive project information.',
    content: (
      <div className="space-y-4 text-text-muted">
        <p>This Mutual NDA is designed to protect both your proprietary business information and our internal technical processes.</p>
        <ul className="space-y-2 mt-4">
          <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> We will not publicly share your project details before launch without consent.</li>
          <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> You will not reproduce or sell the underlying foundational architectures or source codes not explicitly transferred to you.</li>
          <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> All discussions in this portal remain confidential.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'sla',
    icon: Clock,
    title: 'Service Level Agreement (SLA)',
    description: 'Our commitments regarding communication and delivery times.',
    content: (
      <div className="space-y-4 text-text-muted">
        <p>To ensure high quality, we adhere to the following SLAs during active engagements:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-background-dark p-4 rounded-lg border border-white/5">
            <div className="text-primary font-bold">24-48 Hours</div>
            <div className="text-sm">Standard Query Response Time</div>
          </div>
          <div className="bg-background-dark p-4 rounded-lg border border-white/5">
            <div className="text-accent font-bold">1-2 Weeks</div>
            <div className="text-sm">Standard Sprint Iteration Delivery</div>
          </div>
          <div className="bg-background-dark p-4 rounded-lg border border-white/5">
            <div className="text-red-400 font-bold">4 Hours</div>
            <div className="text-sm">Critical Bug Response (Post-Launch)</div>
          </div>
          <div className="bg-background-dark p-4 rounded-lg border border-white/5">
            <div className="text-blue-400 font-bold">99.9%</div>
            <div className="text-sm">Portal Uptime Guarantee</div>
          </div>
        </div>
      </div>
    )
  }
];

const PoliciesPage = () => {
  const [activePolicy, setActivePolicy] = useState(policies[0]);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Policies & Guidelines</h1>
          <p className="text-text-muted mt-2">Enterprise-grade security, transparency, and operational protocols.</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span>Verified Secure Workspace</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          {policies.map((policy) => {
            const isActive = activePolicy.id === policy.id;
            const Icon = policy.icon;
            
            return (
              <button
                key={policy.id}
                onClick={() => setActivePolicy(policy)}
                className={`w-full text-left transition-all duration-300 rounded-xl p-4 border flex items-start gap-4 ${
                  isActive 
                    ? 'bg-primary/10 border-primary/30 shadow-[0_0_15px_rgba(var(--color-primary),0.1)]' 
                    : 'bg-surface border-white/5 hover:border-white/10 hover:bg-white/2'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/20 text-primary' : 'bg-background-lighter text-text-muted'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {policy.title}
                  </h3>
                  <p className="text-xs text-text-muted mt-1 line-clamp-2">
                    {policy.description}
                  </p>
                </div>
                <ChevronRight className={`w-5 h-5 mt-2 transition-transform ${isActive ? 'text-primary translate-x-1' : 'text-text-muted opacity-0'}`} />
              </button>
            );
          })}
          
          <div className="mt-8 p-6 glass-card rounded-xl border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <HelpCircle className="w-5 h-5 text-accent" />
              <h4 className="text-text-primary font-medium">Need Help?</h4>
            </div>
            <p className="text-sm text-text-muted mb-4">If you have specific questions about these policies or your contract, please reach out to our team.</p>
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-text-primary rounded-lg text-sm font-medium transition-colors border border-white/10">
              Contact Support
            </button>
          </div>
        </div>

        {/* Content Details */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePolicy.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-2xl border border-white/10 p-6 md:p-8 relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary glow-primary">
                    <activePolicy.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-1">{activePolicy.title}</h2>
                    <p className="text-text-muted text-sm border-l-2 border-primary/50 pl-3">
                      Last Updated: Oct 24, 2024
                    </p>
                  </div>
                </div>
                
                <div className="prose prose-invert prose-p:leading-relaxed max-w-none">
                  {activePolicy.content}
                </div>
                
                {/* Acknowledgment block for Admin/Client dynamics could go here later */}
                <div className="mt-12 p-4 bg-background-dark/50 border border-white/5 rounded-xl flex items-center justify-between">
                  <span className="text-sm text-text-muted">Document Hash: <span className="font-mono text-xs opacity-70">cv_pol_{activePolicy.id}_v2.4</span></span>
                  <button className="text-sm text-primary hover:text-primary-light transition-colors font-medium">Download PDF</button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default PoliciesPage;
