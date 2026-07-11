'use client';

import { create } from "zustand";

type User = {
  username?: string;
  email: string;
};

type UserState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user: User) => set({ user, error: null }),

  clearUser: () => set({ user: null, error: null }),

  fetchUser: async () => {
    set({ loading: true, error: null });

    try {
      const res = await fetch('/api/fetchuser', {  // Better to have a dedicated /api/user endpoint
        method: 'GET',
        credentials: 'include', // Important for cookies/session
      
      });

      if (!res.ok) {
         console.log("res was not feeling ok")
        throw new Error(`HTTP ${res.status}: Failed to fetch user`);
      }

      const data: User = await res.json();

      set({
        user: data,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load user',
        loading: false,
      });
    }
  },
}));