import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
    className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-full hover:bg-white/5 text-text-muted hover:text-text-primary transition-all group relative ${className}`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <div className="relative w-5 h-5">
                <Sun 
                    size={20} 
                    className={`absolute inset-0 transition-all duration-500 transform ${
                        theme === 'light' 
                            ? 'scale-0 rotate-90 opacity-0' 
                            : 'scale-100 rotate-0 opacity-100'
                    }`} 
                />
                <Moon 
                    size={20} 
                    className={`absolute inset-0 transition-all duration-500 transform ${
                        theme === 'light' 
                            ? 'scale-100 rotate-0 opacity-100' 
                            : 'scale-0 -rotate-90 opacity-0'
                    }`} 
                />
            </div>
            
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-surface border border-white/10 rounded text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {theme === 'light' ? 'Dark' : 'Light'} Mode
            </span>
        </button>
    );
};
