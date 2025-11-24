import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import  UserInterface from '@/types/UserInterface';

interface AuthState {
  user: UserInterface | null;
  token: string | null;
  setUser: (user: UserInterface | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools((set, get) => ({
    user: null,
    token: null,
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    logout: () => {
      set({ user: null, token: null });
      // Очищаем куки при выходе
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    },
    isAuthenticated: () => !!get().token && !!get().user,
  }))
);