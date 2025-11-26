'use client';

import { useEffect, useRef, useState } from 'react';
import { Listing } from '@/lib/api';
import { formatPrice, PROPERTY_TYPE_MAP } from '@/lib/utils';

// 動態載入 Leaflet（避免 SSR 問題）
interface MapProps {
  listings: Listing[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (listing: Listing) => void;
  selectedId?: string | null;
  height?: string;
}

export default function ListingMap({
  listings,
  center = { lat: 25.033, lng: 121.565 },
  zoom = 13,
  onMarkerClick,
  selectedId,
  height = '500px',
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 動態載入 Leaflet
    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;

      // 載入 CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // 載入 JS
      const L = (await import('leaflet')).default;

      if (!mapRef.current || mapInstanceRef.current) return;

      // 初始化地圖
      const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom);

      // 使用 OpenStreetMap 圖層
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
      setIsLoaded(true);
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 更新標記
  useEffect(() => {
    const updateMarkers = async () => {
      if (!mapInstanceRef.current || !isLoaded) return;

      const L = (await import('leaflet')).default;

      // 清除舊標記
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // 自訂 marker icon
      const createIcon = (isSelected: boolean) =>
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
        });

      // 添加標記
      const bounds: [number, number][] = [];

      listings.forEach((listing) => {
        if (!listing.latitude || !listing.longitude) return;

        const isSelected = listing.id === selectedId;
        const marker = L.marker([listing.latitude, listing.longitude], {
          icon: createIcon(isSelected),
        });

        // Popup 內容
        const popupContent = `
          <div class="min-w-[200px] p-2">
            <h3 class="font-semibold text-secondary-900 mb-1">${listing.title}</h3>
            <p class="text-primary-600 font-bold">${formatPrice(listing.price)}/月</p>
            <p class="text-sm text-secondary-500">${PROPERTY_TYPE_MAP[listing.propertyType]}</p>
            <p class="text-sm text-secondary-500">${listing.beds} 房 · ${listing.baths} 衛</p>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'custom-popup',
        });

        marker.on('click', () => {
          onMarkerClick?.(listing);
        });

        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
        bounds.push([listing.latitude, listing.longitude]);
      });

      // 自動調整視野
      if (bounds.length > 0 && !selectedId) {
        const leafletBounds = L.latLngBounds(bounds);
        mapInstanceRef.current.fitBounds(leafletBounds, { padding: [50, 50] });
      }
    };

    updateMarkers();
  }, [listings, selectedId, isLoaded, onMarkerClick]);

  // 當選中的房源改變時，移動到該位置
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedId) return;

    const selectedListing = listings.find((l) => l.id === selectedId);
    if (selectedListing?.latitude && selectedListing?.longitude) {
      mapInstanceRef.current.setView(
        [selectedListing.latitude, selectedListing.longitude],
        15,
        { animate: true }
      );
    }
  }, [selectedId, listings]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-secondary-100">
      <div ref={mapRef} style={{ height, width: '100%' }} />
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






