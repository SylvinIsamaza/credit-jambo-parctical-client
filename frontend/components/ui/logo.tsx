import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn(
        'rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold',
        sizeClasses[size]
      )}>
        <span className={cn(
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-lg' : 'text-xl'
        )}>
          CI
        </span>
      </div>
    </div>
  );
}