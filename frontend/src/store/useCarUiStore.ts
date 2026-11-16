import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";

interface CarUiStore {
  searchTerm: string;
  showFavoritesOnly: boolean;
  favoritesByUser: Record<string, string[]>;
  setSearchTerm: (value: string) => void;
  setShowFavoritesOnly: (value: boolean) => void;
  toggleFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
}

export const useCarUiStore = create<CarUiStore>()(
  persist(
    (set) => ({
      searchTerm: "",
      showFavoritesOnly: false,
      favoritesByUser: {},
      setSearchTerm: (value) => set({ searchTerm: value }),
      setShowFavoritesOnly: (value) => set({ showFavoritesOnly: value }),

      toggleFavorite: (id) => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return;

        set((state) => {
          const userFavs = state.favoritesByUser[userEmail] || [];
          const updatedFavs = userFavs.includes(id)
            ? userFavs.filter((item) => item !== id)
            : [...userFavs, id];

          return {
            favoritesByUser: {
              ...state.favoritesByUser,
              [userEmail]: updatedFavs,
            },
          };
        });
      },

      removeFavorite: (id) => {
        const userEmail = useAuthStore.getState().user?.email;
        if (!userEmail) return;

        set((state) => {
          const userFavs = state.favoritesByUser[userEmail] || [];
          return {
            favoritesByUser: {
              ...state.favoritesByUser,
              [userEmail]: userFavs.filter((item) => item !== id),
            },
          };
        });
      },

      clearFavorites: () => set({ favoritesByUser: {} }),
    }),
    {
      name: "cars-ui-store",
      partialize: (state) => ({ favoritesByUser: state.favoritesByUser }),
    },
  ),
);
