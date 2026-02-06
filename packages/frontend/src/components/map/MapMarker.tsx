'use client';

import { formatPrice } from '@/lib/utils';

/**
 * 地圖標記 - 自定義價格標記
 * 配合 react-leaflet 使用 (L.divIcon)
 */

export interface MapMarkerData {
  id: string;
  title: string;
  price: number;
  latitude: number;
  longitude: number;
  propertyType: string;
  image?: string;
}

/**
 * 建立價格標記的 HTML 內容
 * 用於 Leaflet DivIcon
 */
export function createPriceMarkerHtml(price: number, isSelected: boolean = false): string {
  const formattedPrice = price >= 10000
    ? `${(price / 10000).toFixed(0)}萬`
    : `${price.toLocaleString()}`;

  const bgColor = isSelected ? '#e97020' : '#3b82f6';
  const shadowColor = isSelected ? 'rgba(233,112,32,0.4)' : 'rgba(59,130,246,0.4)';

  return `
    <div style="
      background: ${bgColor};
      color: white;
      padding: 4px 8px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      box-shadow: 0 2px 8px ${shadowColor};
      cursor: pointer;
      transform: translate(-50%, -100%);
    ">
      ${formattedPrice}
      <div style="
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid ${bgColor};
      "></div>
    </div>
  `;
}

/**
 * 地圖標記彈出視窗 HTML
 */
export function createPopupHtml(data: MapMarkerData): string {
  return `
    <div style="min-width: 220px; font-family: 'Noto Sans TC', sans-serif;">
      ${data.image ? `
        <img
          src="${data.image}"
          alt="${data.title}"
          style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;"
        />
      ` : ''}
      <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 4px 0; color: #1a1a1a;">
        ${data.title}
      </h3>
      <p style="font-size: 16px; font-weight: 700; color: #e97020; margin: 0 0 4px 0;">
        ${formatPrice(data.price)}/月
      </p>
      <p style="font-size: 12px; color: #666; margin: 0;">
        ${data.propertyType}
      </p>
    </div>
  `;
}
