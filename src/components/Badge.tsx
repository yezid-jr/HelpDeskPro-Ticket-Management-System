import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'open' | 'in_progress' | 'resolved' | 'closed' | 'low' | 'medium' | 'high';
}

export default function Badge({ children, variant = 'open' }: BadgeProps) {
  const variantStyles = {
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}