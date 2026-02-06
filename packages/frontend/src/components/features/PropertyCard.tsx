/**
 * 房源卡片組件 - 顯示房源縮略信息
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types';
import { formatPrice, formatArea, PROPERTY_TYPE_MAP } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images[0] || '/placeholder-property.jpg';

  return (
    <Link href={`/listing/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="default">
              {PROPERTY_TYPE_MAP[property.details.type]}
            </Badge>
          </div>
          {property.details.status === 'AVAILABLE' && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-emerald-500 text-white">
                可入住
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-secondary-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center text-sm text-secondary-600 mb-3">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="line-clamp-1">
              {property.location.city} {property.location.district}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(property.details.price)}
              </span>
              <span className="text-sm text-secondary-500 ml-1">/月</span>
            </div>
            {property.details.area && (
              <span className="text-sm text-secondary-600">
                {formatArea(property.details.area)}
              </span>
            )}
          </div>

          {property.details.rooms && (
            <div className="mt-3 flex items-center text-sm text-secondary-600">
              <span className="mr-4">🛏️ {property.details.rooms} 房</span>
              {property.details.bathrooms && (
                <span>🚿 {property.details.bathrooms} 衛</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
