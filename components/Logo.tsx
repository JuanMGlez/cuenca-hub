'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'header' | 'footer' | 'auth' | 'dashboard';
  showText?: boolean;
  className?: string;
}

export default function Logo({ variant = 'header', showText = true, className = '' }: LogoProps) {
  const getSize = () => {
    switch (variant) {
      case 'auth': return { w: 96, h: 96, class: 'w-20 h-20 md:w-24 md:h-24' };
      case 'footer': return { w: 32, h: 32, class: 'w-8 h-8' };
      case 'dashboard': return { w: 40, h: 40, class: 'w-10 h-10' };
      default: return { w: 64, h: 64, class: 'w-12 h-12 md:w-16 md:h-16' };
    }
  };

  const getTextSize = () => {
    switch (variant) {
      case 'auth': return 'text-2xl md:text-3xl';
      case 'footer': return 'text-lg';
      case 'dashboard': return 'text-lg';
      default: return 'text-xl md:text-2xl';
    }
  };

  const size = getSize();

  return (
    <Link href="/" className={`flex items-center space-x-3 ${className}`}>
      <img
        src="/logo/upscalemedia-transformed.png"
        alt="Cuenca Hub"
        width={size.w}
        height={size.h}
        className={`${size.class} object-contain logo-hover`}
      />
      {showText && (
        <div className={variant !== 'footer' ? 'border-l-2 border-neutral pl-3' : ''}>
          <div className={`font-bold tracking-tight ${getTextSize()}`} style={{color: variant === 'header' ? '#161a1d' : '#e6d194'}}>
            Cuenca Hub
          </div>
          {variant === 'header' && (
            <div className="text-xs md:text-sm text-neutral font-medium">
              Ciencia y Tecnología para la Restauración de Cuencas
            </div>
          )}
        </div>
      )}
    </Link>
  );
}