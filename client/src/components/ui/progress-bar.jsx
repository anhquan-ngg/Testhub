import React from 'react';
import { cn } from '@/lib/utils';

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  className,
  showLabel = true,
  variant = 'default',
  size = 'default'
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const variants = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  };
  
  const sizes = {
    sm: 'h-2',
    default: 'h-3',
    lg: 'h-4'
  };

  const getVariantByScore = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    if (score >= 40) return 'default';
    return 'danger';
  };

  const currentVariant = variant === 'default' ? getVariantByScore(percentage) : variant;

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'w-full bg-gray-200 rounded-full overflow-hidden',
        sizes[size]
      )}>
        <div
          className={cn(
            'h-full transition-all duration-300 ease-in-out rounded-full',
            variants[currentVariant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1 text-sm text-gray-600">
          <span>{value}/{max}</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
};

export { ProgressBar };