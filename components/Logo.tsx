'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'header' | 'footer' | 'auth' | 'dashboard';
  showText?: boolean;
  className?: string;
}

export default function Logo({ variant = 'header', showText = true, className = '' }: LogoProps) {
  const sizes = {
    header: 'w-12 h-12 md:w-16 md:h-16',
    footer: 'w-8 h-8',
    auth: 'w-20 h-20 md:w-24 md:h-24',
    dashboard: 'w-10 h-10'
  };

  const textSizes = {
    header: 'text-xl md:text-2xl',
    footer: 'text-lg',
    auth: 'text-2xl md:text-3xl',
    dashboard: 'text-lg'
  };

  return (
    <Link href="/" className={`flex items-center space-x-3 group ${className}`}>
      <div className="relative transition-transform duration-300 group-hover:scale-105">
        <Image
          src="/logo/upscalemedia-transformed.png"
          alt="Cuenca Hub"
          width={variant === 'auth' ? 96 : variant === 'header' ? 64 : variant === 'footer' ? 32 : 40}
          height={variant === 'auth' ? 96 : variant === 'header' ? 64 : variant === 'footer' ? 32 : 40}
          className={`${sizes[variant]} object-contain transition-all duration-300`}
          priority={variant === 'header' || variant === 'auth'}
        />
      </div>
      {showText && (
        <div className={variant !== 'footer' ? 'border-l-2 border-neutral pl-3' : ''}>
          <div className={`font-bold text-foreground tracking-tight transition-colors duration-300 group-hover:text-primary ${textSizes[variant]}`}>
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