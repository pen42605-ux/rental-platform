import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';

interface PriceTagProps {
  price: number;
  currency?: string;
  period?: string; // '月' | '總價'
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * 價格標籤元件
 */
export default function PriceTag({
  price,
  currency = 'TWD',
  period,
  size = 'md',
  className,
}: PriceTagProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={cn('flex items-baseline gap-1', className)}>
      <span className={cn('font-bold text-primary-600', sizeClasses[size])}>
        {formatPrice(price, currency)}
      </span>
      {period && (
        <span className="text-muted-foreground text-sm">/{period}</span>
      )}
    </div>
  );
}
