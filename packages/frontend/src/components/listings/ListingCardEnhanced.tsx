/**
 * 增強版物件卡片組件 (Enhanced Listing Card Component)
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/features/FavoriteButton';
import { MapPin, Bed, Bath, Maximize, Calendar } from 'lucide-react';
import type { Listing } from '@/types';

interface ListingCardEnhancedProps {
  listing: Listing;
  className?: string;
}

export function ListingCardEnhanced({ listing, className = '' }: ListingCardEnhancedProps) {
  const {
    id,
    title,
    coverImage,
    location,
    propertyDetails,
    rentalInfo,
    propertyType,
    status,
  } = listing;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const propertyTypeLabels: Record<string, string> = {
    apartment: '公寓',
    house: '透天厝',
    studio: '套房',
    share: '雅房',
    office: '辦公室',
    store: '店面',
  };

  return (
    <Card className={`group overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <Link href={`/listing/${id}`}>
        {/* Image Section */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200">
              <span className="text-gray-400 text-sm">無圖片</span>
            </div>
          )}
          
          {/* Status Badge */}
          {status !== 'available' && (
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-black/60 text-white">
                {status === 'rented' ? '已出租' : status === 'pending' ? '審核中' : '草稿'}
              </Badge>
            </div>
          )}
          
          {/* Property Type Badge */}
          <div className="absolute top-3 right-14">
            <Badge variant="default">
              {propertyTypeLabels[propertyType] || propertyType}
            </Badge>
          </div>
          
          {/* Favorite Button */}
          <div className="absolute top-2 right-2">
            <FavoriteButton 
              listingId={id} 
              variant="ghost" 
              className="bg-white/80 hover:bg-white"
            />
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-4 space-y-3">
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(rentalInfo.monthlyRent)}
              </span>
              <span className="text-sm text-muted-foreground ml-1">/月</span>
            </div>
            {rentalInfo.managementFee > 0 && (
              <span className="text-xs text-muted-foreground">
                管理費 {formatPrice(rentalInfo.managementFee)}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">
              {location.city} {location.district}
            </span>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {propertyDetails.bedrooms > 0 && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{propertyDetails.bedrooms}房</span>
              </div>
            )}
            {propertyDetails.bathrooms > 0 && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{propertyDetails.bathrooms}衛</span>
              </div>
            )}
            <div className="flex items-center">
              <Maximize className="h-4 w-4 mr-1" />
              <span>{propertyDetails.area}坪</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {propertyDetails.hasElevator && (
              <Badge variant="outline" className="text-xs">電梯</Badge>
            )}
            {propertyDetails.hasParking && (
              <Badge variant="outline" className="text-xs">車位</Badge>
            )}
            {propertyDetails.petsAllowed && (
              <Badge variant="outline" className="text-xs">可養寵物</Badge>
            )}
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="px-4 py-3 bg-muted/50 text-xs text-muted-foreground border-t">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>
              可入住: {new Date(rentalInfo.availableFrom).toLocaleDateString('zh-TW')}
            </span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
