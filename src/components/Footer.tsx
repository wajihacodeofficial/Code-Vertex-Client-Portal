import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
    className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
    return (
        <footer className={`w-full py-10 text-text-muted mt-auto border-t border-white/5 bg-background/50 backdrop-blur-md ${className}`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-8 max-w-[1400px] mx-auto">
                <div className="flex flex-col items-center md:items-start shrink-0">
                    <p className="text-[10px] text-text-primary font-black uppercase tracking-widest whitespace-nowrap">
                        © 2026 CODE VERTEX SOLUTIONS. ALL RIGHTS RESERVED.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest text-text-muted whitespace-nowrap">
                    <Link to="/policies" className="hover:text-primary transition-colors">Term Protocols</Link>
                    <Link to="/policies" className="hover:text-primary transition-colors">Privacy Shield</Link>
                    <Link to="/policies" className="hover:text-primary transition-colors">Service Standards</Link>
                    <Link to="/policies" className="hover:text-primary transition-colors">NDA Governance</Link>
                </div>

                <div className="text-right hidden xl:block shrink-0">
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest whitespace-nowrap">
                        BUILDING THE FUTURE.
                    </p>
                </div>
            </div>
        </footer>
    );
};
