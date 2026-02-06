/**
 * 物件類型定義 (Listing Types)
 */

export type PropertyType = 'apartment' | 'house' | 'studio' | 'share' | 'office' | 'store';
export type RentalType = 'entire' | 'room' | 'shared';
export type ListingStatus = 'available' | 'rented' | 'pending' | 'draft' | 'rejected';

export interface Location {
  city: string;
  district: string;
  address?: string;
  latitude: number;
  longitude: number;
}

export interface PropertyDetails {
  bedrooms: number;
  bathrooms: number;
  area: number; // 坪數
  floor: number;
  totalFloors: number;
  hasElevator: boolean;
  hasParking: boolean;
  hasBalcony: boolean;
  petsAllowed: boolean;
  smokingAllowed: boolean;
}

export interface RentalInfo {
  monthlyRent: number;
  deposit: number; // 押金
  managementFee: number; // 管理費
  minimumLease: number; // 最短租期 (月)
  availableFrom: string | Date;
}

export interface Facilities {
  airConditioner: boolean;
  washingMachine: boolean;
  refrigerator: boolean;
  waterHeater: boolean;
  tv: boolean;
  internet: boolean;
  bed: boolean;
  wardrobe: boolean;
  sofa: boolean;
  diningTable: boolean;
  [key: string]: boolean;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  rentalType: RentalType;
  status: ListingStatus;
  
  location: Location;
  propertyDetails: PropertyDetails;
  rentalInfo: RentalInfo;
  facilities: Facilities;
  
  images: string[];
  coverImage: string;
  
  landlordId: string;
  landlord?: {
    id: string;
    name: string;
    avatar?: string;
    phone?: string;
    email?: string;
    verified: boolean;
  };
  
  views: number;
  favorites: number;
  
  createdAt: string | Date;
  updatedAt: string | Date;
  publishedAt?: string | Date;
}

export interface ListingFormData {
  title: string;
  description: string;
  propertyType: PropertyType;
  rentalType: RentalType;
  
  city: string;
  district: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor: number;
  totalFloors: number;
  
  monthlyRent: number;
  deposit: number;
  managementFee: number;
  minimumLease: number;
  availableFrom: string;
  
  hasElevator: boolean;
  hasParking: boolean;
  hasBalcony: boolean;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  
  facilities: string[];
  images: File[];
}

export interface SearchFilters {
  keyword?: string;
  city?: string;
  district?: string;
  propertyType?: PropertyType[];
  rentalType?: RentalType[];
  
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  
  bedrooms?: number[];
  hasElevator?: boolean;
  hasParking?: boolean;
  petsAllowed?: boolean;
  
  facilities?: string[];
  
  sortBy?: 'latest' | 'price-asc' | 'price-desc' | 'area-asc' | 'area-desc' | 'popular';
}

export interface ListingResponse {
  listings: Listing[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
