'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
  aspectRatio?: 'video' | 'square' | 'wide';
  className?: string;
  showThumbnails?: boolean;
}

export default function ImageCarousel({
  images,
  alt = '房源圖片',
  aspectRatio = 'video',
  className,
  showThumbnails = false,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const aspectRatioClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[16/9]',
  };

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  }, [images.length]);

  if (!images || images.length === 0) {
    return (
      <div
        className={cn(
          'bg-gray-200 flex items-center justify-center',
          aspectRatioClass[aspectRatio],
          className
        )}
      >
        <span className="text-gray-400 text-sm">暫無圖片</span>
      </div>
    );
  }

  return (
    <div className={cn('relative group', className)}>
      <div className={cn('relative overflow-hidden rounded-lg', aspectRatioClass[aspectRatio])}>
        <Image
          src={images[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          fill
          className="object-cover transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* 圖片計數 */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* 前後按鈕 */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* 縮圖列表 */}
      {showThumbnails && images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all',
                index === currentIndex
                  ? 'border-primary-500 ring-2 ring-primary-500/20'
                  : 'border-transparent opacity-60 hover:opacity-100'
              )}
            >
              <Image
                src={image}
                alt={`${alt} 縮圖 ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
