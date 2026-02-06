'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
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

function createMarkerIcon(isSelected: boolean) {
  const color = isSelected ? '#da5716' : '#e97020';
  const scale = isSelected ? 1.15 : 1;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position:relative;transform:scale(${scale});transform-origin:bottom center;transition:transform 150ms ease;">
        <div style="width:40px;height:40px;background:${color};border-radius:9999px;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 24px rgba(0,0,0,.25);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        </div>
        <div style="position:absolute;left:50%;bottom:-2px;transform:translateX(-50%);width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ${color};"></div>
      </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -48],
  });
}

function FitBounds({
  bounds,
  enabled,
}: {
  bounds: L.LatLngBounds | null;
  enabled: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!enabled || !bounds || !bounds.isValid()) return;
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [bounds, enabled, map]);

  return null;
}

function PanToSelected({
  position,
}: {
  position: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;
    map.setView([position.lat, position.lng], 15, { animate: true });
  }, [map, position]);

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
  const [isReady, setIsReady] = useState(false);

  const listingsWithCoords = useMemo(
    () => listings.filter((l) => !!l.latitude && !!l.longitude),
    [listings]
  );

  const bounds = useMemo(() => {
    if (listingsWithCoords.length === 0) return null;
    const points = listingsWithCoords.map(
      (l) => [l.latitude as number, l.longitude as number] as [number, number]
    );
    const b = L.latLngBounds(points);
    return b.isValid() ? b : null;
  }, [listingsWithCoords]);

  const selectedPosition = useMemo(() => {
    if (!selectedId) return null;
    const selectedListing = listingsWithCoords.find((l) => l.id === selectedId);
    if (!selectedListing?.latitude || !selectedListing?.longitude) return null;
    return { lat: selectedListing.latitude, lng: selectedListing.longitude };
  }, [listingsWithCoords, selectedId]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-secondary-100">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom
        style={{ height, width: '100%' }}
        whenReady={() => setIsReady(true)}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds bounds={bounds} enabled={!selectedId} />
        <PanToSelected position={selectedPosition} />

        {listingsWithCoords.map((listing) => {
          const isSelected = listing.id === selectedId;
          const icon = createMarkerIcon(isSelected);

          return (
            <Marker
              key={listing.id}
              position={[listing.latitude as number, listing.longitude as number]}
              icon={icon}
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

      {!isReady && (
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






