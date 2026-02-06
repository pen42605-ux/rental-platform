'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ListingImage } from '@/types';

interface PropertyGalleryProps {
  images: ListingImage[];
  title: string;
}

export default function PropertyGallery({
  images,
  title,
}: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-secondary-100 rounded-xl flex items-center justify-center">
        <p className="text-secondary-400">尚無圖片</p>
      </div>
    );
  }

  const goTo = (index: number) => {
    setCurrentIndex((index + images.length) % images.length);
  };

  return (
    <>
      <div className="relative group">
        {/* 主圖 */}
        <div
          className="relative aspect-[16/9] rounded-xl overflow-hidden cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={images[currentIndex].url}
            alt={`${title} - 圖片 ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority
          />

          {/* 展開按鈕 */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70">
              <Expand className="w-5 h-5" />
            </button>
          </div>

          {/* 圖片計數 */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* 左右箭頭 */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo(currentIndex - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => goTo(currentIndex + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* 縮圖列 */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {images.map((image, idx) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  'relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all',
                  idx === currentIndex
                    ? 'border-primary-500 ring-2 ring-primary-500/20'
                    : 'border-transparent opacity-70 hover:opacity-100'
                )}
              >
                <Image
                  src={image.url}
                  alt={`縮圖 ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black border-none">
          <DialogTitle className="sr-only">{title} - 圖片瀏覽</DialogTitle>
          <div className="relative aspect-[16/9]">
            <Image
              src={images[currentIndex].url}
              alt={`${title} - 圖片 ${currentIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={() => goTo(currentIndex - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full hover:bg-white/30"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => goTo(currentIndex + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full hover:bg-white/30"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
