/**
 * Zustand 狀態管理
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ==================== 認證狀態 ====================

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (user, tokens) =>
        set({
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
      checkAuth: async () => {
        const state = get();
        if (state.accessToken && state.user) {
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false, user: null, accessToken: null, refreshToken: null });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ==================== 搜尋篩選狀態 ====================

interface FilterState {
  q: string;
  minPrice: number | null;
  maxPrice: number | null;
  propertyType: string | null;
  beds: number | null;
  city: string | null;
  district: string | null;
  amenities: string[];
  sort: string;
  setFilter: (key: string, value: any) => void;
  resetFilters: () => void;
}

const defaultFilters = {
  q: '',
  minPrice: null,
  maxPrice: null,
  propertyType: null,
  beds: null,
  city: null,
  district: null,
  amenities: [],
  sort: 'newest',
};

export const useFilterStore = create<FilterState>((set) => ({
  ...defaultFilters,
  setFilter: (key, value) => set((state) => ({ ...state, [key]: value })),
  resetFilters: () => set(defaultFilters),
}));

// ==================== 地圖狀態 ====================

interface MapState {
  center: { lat: number; lng: number };
  zoom: number;
  selectedListingId: string | null;
  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  setSelectedListing: (id: string | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: { lat: 25.033, lng: 121.565 }, // 台北
  zoom: 13,
  selectedListingId: null,
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setSelectedListing: (id) => set({ selectedListingId: id }),
}));


