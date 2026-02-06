import { MapPin, Bed, Bath, Maximize, Building2, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PROPERTY_TYPE_LABELS } from '@/constants';
import { formatPrice, formatArea, formatDate } from '@/lib/utils';
import type { Listing } from '@/types';

interface PropertyInfoProps {
  listing: Listing;
}

export default function PropertyInfo({ listing }: PropertyInfoProps) {
  return (
    <div className="space-y-6">
      {/* 價格與標籤 */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="default">
            {PROPERTY_TYPE_LABELS[listing.propertyType] || listing.propertyType}
          </Badge>
          {listing.status === 'PUBLISHED' && (
            <Badge variant="success">上架中</Badge>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-2">
          {listing.title}
        </h1>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary-600">
            {formatPrice(listing.price)}
          </span>
          <span className="text-secondary-500">/月</span>
        </div>
      </div>

      <Separator />

      {/* 基本規格 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2 text-secondary-700">
          <Bed className="w-5 h-5 text-secondary-400" />
          <span>{listing.beds} 房</span>
        </div>
        <div className="flex items-center gap-2 text-secondary-700">
          <Bath className="w-5 h-5 text-secondary-400" />
          <span>{listing.baths} 衛</span>
        </div>
        {listing.area && (
          <div className="flex items-center gap-2 text-secondary-700">
            <Maximize className="w-5 h-5 text-secondary-400" />
            <span>{formatArea(listing.area)}</span>
          </div>
        )}
        {listing.floor && (
          <div className="flex items-center gap-2 text-secondary-700">
            <Building2 className="w-5 h-5 text-secondary-400" />
            <span>
              {listing.floor}F
              {listing.totalFloors ? `/${listing.totalFloors}F` : ''}
            </span>
          </div>
        )}
      </div>

      <Separator />

      {/* 地址 */}
      <div className="flex items-start gap-2">
        <MapPin className="w-5 h-5 text-secondary-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-secondary-700">
            {listing.city}
            {listing.district && ` ${listing.district}`}
          </p>
          {listing.address && (
            <p className="text-secondary-500 text-sm">{listing.address}</p>
          )}
        </div>
      </div>

      {/* 描述 */}
      {listing.description && (
        <>
          <Separator />
          <div>
            <h2 className="text-lg font-semibold text-secondary-900 mb-3">
              房源描述
            </h2>
            <p className="text-secondary-700 whitespace-pre-line leading-relaxed">
              {listing.description}
            </p>
          </div>
        </>
      )}

      {/* 設施 */}
      {listing.amenities && listing.amenities.length > 0 && (
        <>
          <Separator />
          <div>
            <h2 className="text-lg font-semibold text-secondary-900 mb-3">
              提供設施
            </h2>
            <div className="flex flex-wrap gap-2">
              {listing.amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 發布資訊 */}
      <Separator />
      <div className="flex items-center gap-2 text-sm text-secondary-400">
        <Calendar className="w-4 h-4" />
        <span>發布於 {formatDate(listing.createdAt)}</span>
        <span className="mx-2">|</span>
        <span>瀏覽 {listing.viewCount} 次</span>
      </div>
    </div>
  );
}
