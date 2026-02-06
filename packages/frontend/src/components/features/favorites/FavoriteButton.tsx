'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FavoriteButtonProps {
  listingId: string;
  isFavorited?: boolean;
  onToggle?: (listingId: string, isFavorited: boolean) => void;
  variant?: 'icon' | 'button';
  className?: string;
}

/**
 * 收藏按鈕元件 - 支援圖示模式和按鈕模式
 */
export default function FavoriteButton({
  listingId,
  isFavorited = false,
  onToggle,
  variant = 'icon',
  className,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [animating, setAnimating] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setAnimating(true);
    setFavorited(!favorited);
    onToggle?.(listingId, !favorited);

    setTimeout(() => setAnimating(false), 300);
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          'w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110',
          className
        )}
        aria-label={favorited ? '取消收藏' : '加入收藏'}
      >
        <Heart
          className={cn(
            'w-5 h-5 transition-all',
            favorited ? 'fill-red-500 text-red-500' : 'text-gray-600',
            animating && 'scale-125'
          )}
        />
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleToggle}
      className={cn('gap-2', className)}
    >
      <Heart
        className={cn(
          'w-4 h-4',
          favorited ? 'fill-red-500 text-red-500' : '',
          animating && 'scale-125'
        )}
      />
      {favorited ? '已收藏' : '收藏'}
    </Button>
  );
}
