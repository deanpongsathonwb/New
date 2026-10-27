import { create } from 'zustand';
import { User } from '../types/common.types.ts';
import { STORAGE_KEYS } from '../constants/storage.ts';
import { storageService } from '../storage/localStorage/localStorage.service.ts';
import initialUsers from '../seed/users.json';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const getStoredUser = (): User | null => {
  const stored = storageService.getItem<User>(STORAGE_KEYS.AUTH_USER);
  if (stored) return stored;
  // Default to first user for seamless initial load
  return (initialUsers[0] as User) || null;
};

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: getStoredUser(),
  isAuthenticated: Boolean(getStoredUser()),
  login: (user: User) => {
    storageService.setItem(STORAGE_KEYS.AUTH_USER, user);
    set({ currentUser: user, isAuthenticated: true });
  },
  logout: () => {
    storageService.removeItem(STORAGE_KEYS.AUTH_USER);
    set({ currentUser: null, isAuthenticated: false });
  }
}));
