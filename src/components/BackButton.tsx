'use client';

import Link from 'next/link';

interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export const BackButton = ({ 
  href, 
  label = '<< Назад к списку', 
  className = '' 
}: BackButtonProps) => {
  return (
    <Link 
      href={href} 
      className={`inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 ${className}`}
    >
      {label}
    </Link>
  );
};