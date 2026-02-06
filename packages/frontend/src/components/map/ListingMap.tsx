'use client';

import { useEffect, useMemo, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Listing } from '@/lib/api';
import { formatPrice, PROPERTY_TYPE_MAP } from '@/lib/utils';

interface MapProps {
  listings: Listing[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (listing: Listing) => void;
  selectedId?: string | null;
  height?: string;
}

function MapViewportController({
  listings,
  selectedId,
}: {
  listings: Listing[];
  selectedId?: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // 若有選取的房源，移動到該位置
    if (selectedId) {
      const selectedListing = listings.find((l) => l.id === selectedId);
      if (selectedListing?.latitude && selectedListing?.longitude) {
        map.setView([selectedListing.latitude, selectedListing.longitude], 15, {
          animate: true,
        });
      }
      return;
    }

    // 沒有選取房源時，自動調整視野至所有標記
    const bounds: [number, number][] = [];
    listings.forEach((listing) => {
      if (!listing.latitude || !listing.longitude) return;
      bounds.push([listing.latitude, listing.longitude]);
    });

    if (bounds.length > 0) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [50, 50] });
    }
  }, [listings, selectedId, map]);

  return null;
}

export default function ListingMap({
  listings,
  center = { lat: 25.033, lng: 121.565 },
  zoom = 13,
  onMarkerClick,
  selectedId,
  height = '500px',
}: MapProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const createIcon = useMemo(
    () => (isSelected: boolean) =>
      L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="relative">
            <div class="w-10 h-10 ${isSelected ? 'bg-primary-600 scale-125' : 'bg-primary-500'} rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            </div>
            <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] ${isSelected ? 'border-t-primary-600' : 'border-t-primary-500'} border-l-transparent border-r-transparent"></div>
          </div>
        `,
        iconSize: [40, 48],
        iconAnchor: [20, 48],
        popupAnchor: [0, -48],
      }),
    []
  );

  return (
    <div className="relative rounded-xl overflow-hidden border border-secondary-100">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height, width: '100%' }}
        scrollWheelZoom
        whenReady={() => setIsLoaded(true)}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapViewportController listings={listings} selectedId={selectedId} />

        {listings.map((listing) => {
          if (!listing.latitude || !listing.longitude) return null;
          const isSelected = listing.id === selectedId;

          return (
            <Marker
              key={listing.id}
              position={[listing.latitude, listing.longitude]}
              icon={createIcon(isSelected)}
              eventHandlers={{
                click: () => onMarkerClick?.(listing),
              }}
            >
              <Popup className="custom-popup" maxWidth={300}>
                <div className="min-w-[200px] p-2">
                  <h3 className="font-semibold text-secondary-900 mb-1">
                    {listing.title}
                  </h3>
                  <p className="text-primary-600 font-bold">
                    {formatPrice(listing.price)}/月
                  </p>
                  <p className="text-sm text-secondary-500">
                    {PROPERTY_TYPE_MAP[listing.propertyType]}
                  </p>
                  <p className="text-sm text-secondary-500">
                    {listing.beds} 房 · {listing.baths} 衛
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {!isLoaded && (
        <div className="absolute inset-0 bg-secondary-100 flex items-center justify-center">
          <div className="text-secondary-500">載入地圖中...</div>
        </div>
      )}
      <style jsx global>{`
        .custom-marker {
          background: transparent;
          border: none;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }
        .custom-popup .leaflet-popup-tip {
          display: none;
        }
      `}</style>
    </div>
  );
}






