import { create } from "zustand";
import { AxiosError } from "axios";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import {
  api,
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "@/lib/api";
import type { User } from "@/types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  hydrateToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,

  hydrateToken: async () => {
    const token = await getStoredToken();
    set({ token });
  },

  login: async (phone, password) => {
    try {
      const response = await api.post("/auth/login", { phone, password });

      const token = response.data.token as string;
      const user = response.data.user as User;

      await setStoredToken(token);
      set({ token, user, isLoading: false });
      router.replace("/");
      return true;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const status = axiosError.response?.status;

      if (status === 422 || status === 401) {
        Toast.show({
          type: "error",
          text1: "خطا!",
          text2: "شماره تلفن یا رمز عبور اشتباه است.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "خطا!",
          text2: "اتصال به سرور برقرار نشد.",
        });
      }
      return false;
    }
  },

  logout: async () => {
    const token = get().token ?? (await getStoredToken());

    if (token) {
      try {
        await api.post("/auth/logout");
      } catch {
        // Local logout even if server revoke fails
      }
    }

    await clearStoredToken();
    set({ token: null, user: null });
    router.replace("/auth");
  },

  checkAuth: async () => {
    const token = await getStoredToken();

    if (!token) {
      set({ isLoading: false, token: null, user: null });
      return;
    }

    try {
      const res = await api.get("/auth/me");
      const user = res.data.data as User;
      set({ token, user, isLoading: false });
    } catch {
      await clearStoredToken();
      set({ token: null, user: null, isLoading: false });
    }
  },
}));
