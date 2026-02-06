'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Maximize } from 'lucide-react';

interface MapPopupProps {
  id: string;
  title: string;
  price: number;
  address: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  image?: string;
}

/**
 * 地圖彈出視窗組件 (React 版本)
 * 用於更複雜的彈出視窗需求
 */
export default function MapPopup({
  id,
  title,
  price,
  address,
  propertyType,
  bedrooms,
  bathrooms,
  area,
  image,
}: MapPopupProps) {
  return (
    <Link href={`/listing/${id}`} className="block min-w-[240px] group">
      {image && (
        <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="240px"
          />
        </div>
      )}

      <h3 className="font-semibold text-sm text-foreground group-hover:text-primary-600 transition-colors line-clamp-1">
        {title}
      </h3>

      <p className="text-lg font-bold text-primary-600 my-1">
        {formatPrice(price)}/月
      </p>

      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
        <MapPin className="h-3 w-3" />
        <span className="line-clamp-1">{address}</span>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
          {propertyType}
        </Badge>
        {bedrooms !== undefined && (
          <span className="flex items-center gap-0.5">
            <Bed className="h-3 w-3" /> {bedrooms}房
          </span>
        )}
        {bathrooms !== undefined && (
          <span className="flex items-center gap-0.5">
            <Bath className="h-3 w-3" /> {bathrooms}衛
          </span>
        )}
        {area !== undefined && (
          <span className="flex items-center gap-0.5">
            <Maximize className="h-3 w-3" /> {area}坪
          </span>
        )}
      </div>
    </Link>
  );
}
