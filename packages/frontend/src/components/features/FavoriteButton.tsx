/**
 * 收藏按鈕組件 (Favorite Button Component)
 */

'use client';

import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  listingId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  showLabel?: boolean;
  className?: string;
}

export function FavoriteButton({
  listingId,
  size = 'md',
  variant = 'ghost',
  showLabel = false,
  className = '',
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(listingId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(listingId);
  };

  return (
    <Button
      variant={variant}
      size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
      onClick={handleClick}
      className={cn(
        'transition-all',
        favorited && 'text-red-500 hover:text-red-600',
        className
      )}
    >
      <Heart
        className={cn(
          'transition-all',
          size === 'sm' && 'h-4 w-4',
          size === 'md' && 'h-5 w-5',
          size === 'lg' && 'h-6 w-6',
          favorited && 'fill-current'
        )}
      />
      {showLabel && (
        <span className="ml-2">
          {favorited ? '已收藏' : '收藏'}
        </span>
      )}
    </Button>
  );
}
