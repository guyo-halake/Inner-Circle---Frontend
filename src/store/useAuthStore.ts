import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: number;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  aliasPhoneWhatsApp?: string;
  aliasPhoneTelegram?: string;
  country: string;
  currency: string;
  role: 'Investor' | 'Admin' | 'Developer';
  avatarUrl?: string;
  investmentStrategy?: string;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  mpesaNumber?: string;
  cryptoAddress?: string;
  wallets?: Array<{ type: string; balance: number | string }>;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
