/**
 * 地圖相關型別定義
 */
import type { Listing } from './index';

/** 地圖標記 */
export interface MapMarker {
  id: string;
  position: [number, number]; // [lat, lng]
  listing: Listing;
  isSelected?: boolean;
}

/** 地圖聚合標記 */
export interface ClusterMarker {
  id: string;
  position: [number, number];
  count: number;
  listings: Listing[];
}

/** 地圖事件 */
export interface MapEvent {
  center: [number, number];
  zoom: number;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

/** 地圖設定 */
export interface MapConfig {
  center: [number, number];
  zoom: number;
  minZoom: number;
  maxZoom: number;
  tileProvider: 'osm' | 'mapbox' | 'google';
}

/** 台灣主要城市座標 */
export const TAIWAN_CITY_COORDS: Record<string, [number, number]> = {
  '台北市': [25.0330, 121.5654],
  '新北市': [25.0118, 121.4651],
  '桃園市': [24.9936, 121.3010],
  '台中市': [24.1477, 120.6736],
  '台南市': [22.9997, 120.2270],
  '高雄市': [22.6273, 120.3014],
  '基隆市': [25.1276, 121.7392],
  '新竹市': [24.8038, 120.9675],
  '新竹縣': [24.8274, 121.0017],
  '苗栗縣': [24.5602, 120.8214],
  '彰化縣': [24.0518, 120.5161],
  '南投縣': [23.9611, 120.9719],
  '雲林縣': [23.7092, 120.4313],
  '嘉義市': [23.4801, 120.4491],
  '嘉義縣': [23.4519, 120.2554],
  '屏東縣': [22.5519, 120.5487],
  '宜蘭縣': [24.7570, 121.7533],
  '花蓮縣': [23.9871, 121.6011],
  '台東縣': [22.7583, 121.1444],
  '澎湖縣': [23.5711, 119.5793],
  '金門縣': [24.4493, 118.3767],
  '連江縣': [26.1505, 119.9499],
};
