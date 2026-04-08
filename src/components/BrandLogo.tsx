import React from 'react';
import logo from '../assets/logo.jpeg';

export const BrandLogo: React.FC<{
  collapsed?: boolean;
  subtitle?: string;
  subtitleClassName?: string;
}> = ({
  collapsed,
  subtitle = 'Digital Innovation',
  subtitleClassName = 'text-gray-500',
}) => {
  return (
    <div className="flex items-center gap-3 w-full">
      {/* The logo icon block using actual image */}
      <div className="w-[38px] h-[38px] rounded-lg flex items-center justify-center shadow-glow shrink-0 overflow-hidden border border-white/10 bg-surface">
        <img src={logo} alt="Logo" className="w-full h-full object-cover" />
      </div>

      {!collapsed && (
        <div className="flex flex-col justify-center animate-in fade-in zoom-in duration-300 overflow-hidden">
          <div className="flex items-baseline leading-none mb-1 whitespace-nowrap">
            <span
              style={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 1000,
                color: 'var(--text-primary)',
                fontSize: '1.3rem',
                letterSpacing: '-0.03em',
              }}
            >
              CODE <span style={{ color: '#ffc300' }}>VERTEX</span>
            </span>
          </div>
          <div
            className={`text-[8.5px] uppercase tracking-widest font-bold truncate w-full ${subtitleClassName}`}
          >
            {subtitle}
          </div>
        </div>
      )}
    </div>
  );
};
