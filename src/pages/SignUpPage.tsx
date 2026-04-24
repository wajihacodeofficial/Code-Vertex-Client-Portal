import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Globe, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpeg';
import { countryCodes } from '../data/countries';
import { Footer } from '../components/Footer';
import { ThemeToggle } from '../components/ThemeToggle';

const SignUpPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [portalType, setPortalType] = useState<'client' | 'team'>('client');
    const [countryCode, setCountryCode] = useState('+1');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { signup, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (isAuthenticated) {
            toast.error('Active session detected. Please log out first to create a new account.', {
                id: 'auth-session-warning',
                duration: 5000,
            });
            const target = user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'team' ? '/team/dashboard' : '/dashboard';
            navigate(target, { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (password.length < 8) {
            toast.error('Password must be at least 8 characters.');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            const fullPhone = phone ? `${countryCode} ${phone}` : undefined;
            const signupData = await signup(name, email, password, portalType, fullPhone);
            
            const userId = signupData.userId || signupData.id; // Backend returns id in signup


            // Store registration data to be submitted AFTER email verification
            const registrationData = {
                userId,
                role: portalType
            };

            setIsLoading(false);
            // Redirect to OTP verification page, passing email AND registration data in state
            navigate('/verify-email', { 
                state: { 
                    email,
                    registrationData
                } 
            });
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
            toast.error(message || 'Registration failed. Please try again.');
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
                    <div className="flex flex-col items-center mb-8 text-center">
                        <Link to="/" className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-glow mb-6 overflow-hidden border border-white/10 group">
                            <img src={logo} alt="Code Vertex" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </Link>
                        <a
                            href="https://codevertex.solutions/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary hover:bg-white/10 transition-all mb-4 group"
                        >
                            <Globe size={12} className="group-hover:text-primary transition-colors" />
                            Visit Main Website
                        </a>
                        <h1 className="text-3xl text-text-primary font-display tracking-tight heading-gradient">Create Account</h1>
                        <p className="text-text-muted text-sm mt-3 font-medium tracking-wide">Enter your details to register for your portal</p>
                    </div>

                    <div className="flex bg-white/5 p-1 rounded-xl mb-8 border border-white/5">
                        {(['client', 'team'] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setPortalType(type)}
                                className={`flex-1 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${portalType === type ? 'bg-primary text-black shadow-glow' : 'text-text-muted hover:text-text-primary'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-5">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field w-full"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field w-full"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Password</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field w-full pr-12"
                                    placeholder="Min. 8 characters"
                                    required
                                    minLength={8}
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

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Confirm Password</label>
                            <div className="relative group">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-field w-full pr-12"
                                    placeholder="Re-enter password"
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
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-red-400 text-[11px] px-1 font-semibold">Passwords do not match</p>
                            )}
                        </div>

                        {/* Phone (Optional) */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Phone Number <span className="normal-case font-normal">(Optional)</span></label>
                            <div className="flex gap-2">
                                <select
                                    className="bg-white/5 border border-white/10 rounded-lg px-2 text-xs text-text-primary outline-none focus:border-primary/50 transition-colors w-48 appearance-none cursor-pointer"
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                >
                                    {countryCodes.map((c, i) => (
                                        <option key={`${c.code}-${i}`} value={c.code} className="bg-surface text-text-primary px-2 py-1">
                                            {c.flag} {c.name} ({c.code})
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="input-field grow"
                                    placeholder="300 1234567"
                                />
                            </div>
                        </div>


                        <button
                            type="submit"
                            disabled={isLoading || (!!confirmPassword && password !== confirmPassword)}
                            className="btn-primary w-full py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-glow group"
                        >
                            <span className="flex items-center justify-center gap-2">
                                {isLoading ? 'Creating account...' : `Register as ${portalType}`}
                                {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                            </span>
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-white/5">
                        <p className="text-sm text-text-muted">
                            Already have an account? <Link to="/login" className="text-primary hover:underline font-bold transition-all ml-1">Log in</Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                                <span className="bg-surface px-4 text-text-muted">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <a
                                href="https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Dsignin%26oq%3Dsignin%26gs_lcrp%3DEgZjaHJvbWUyBggAEEUYOTIHCAEQABiPAjIHCAIQABiPAjIGCAMQLhhA0gEIMTc4MWowajGoAgCwAgA%26sourceid%3Dchrome%26ie%3DUTF-8%26sei%3DO_jQaaXCNLS69u8PmcOnuQE&dsh=S-1491538570%3A1775302717950035&ec=futura_srp_og_si_72236_p&hl=en&passive=true&flowName=GlifWebSignIn&flowEntry=ServiceLogin&ifkv=AT1y2_W4bWA3IbXsAHj8fhWHL0t-30PrKtDo-Irgp_HIA-GT5Us67xPVyOqDEcUzTZYsEyVbIQlc"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-xs font-bold text-text-primary group"
                                style={{ borderColor: 'var(--border-color)' }}
                            >
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Google
                            </a>

                            <a
                                href="https://account.apple.com/sign-in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-xs font-bold text-text-primary group"
                                style={{ borderColor: 'var(--border-color)' }}
                            >
                                <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                    <path d="M16.636 12.012c0-2.73 2.213-4.048 2.308-4.108-1.265-1.854-3.232-2.106-3.928-2.14-1.666-.17-3.251.983-4.1.983-.848 0-2.145-.964-3.528-.938-1.785.025-3.435 1.042-4.35 2.636-1.852 3.228-.474 8.01 1.332 10.638.887 1.284 1.933 2.73 3.284 2.68 1.303-.05 1.802-.843 3.376-.843 1.571 0 2.02.843 3.374.843 1.401.025 2.32-.1282 3.155-2.548.988-1.448 1.398-2.85 1.423-2.924-.033-.016-2.746-1.054-2.748-4.28" />
                                    <path d="M14.61 9.489c.712-.865 1.193-2.072 1.062-3.271-1.037.042-2.296.696-3.031 1.578-.655.787-1.229 2.016-1.074 3.197 1.162.09 2.33-.6 3.043-1.504" />
                                </svg>
                                Apple
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer className="px-8 w-full" />
        </div>
    );
};

export default SignUpPage;
