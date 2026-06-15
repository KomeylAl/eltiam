import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import axios, { AxiosError } from "axios";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

const BASE_URL = "https://soheil.ebrazclinic.ir/api";

interface AuthState {
  user: null | {
    id: number;
    phone: string;
    name: string;
    national_code: string;
    created_at: string | number | Date;
  };
  token: string | null;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    phone: string,
    password: string,
    name: string,
    national_code: string
  ) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  login: async (phone, password) => {
    await axios
      .post(`${BASE_URL}/login`, {
        phone,
        password,
      })
      .then(async (response) => {
        if (response.status === 200) {
          const token = response.data.access_token;
          await SecureStore.setItemAsync("token", token);

          set({ token, user: response.data.user, isLoading: false });
          router.replace("/");
        }
      })
      .catch((error) => {
        if (error.status === 401) {
          Toast.show({
            type: "error",
            text1: "خطا!",
            text2: "نام کاربری یا رمز عبور اشتباه است.",
          });
          return;
        }
        Toast.show({
          type: "error",
          text1: "خطا!",
          text2: "اتصال به سرور برقرار نشد.",
        });
      });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("token");
    set({ token: null, user: null });
    router.replace("/auth");
  },

  register: async (phone, password, national_code, name) => {
    console.log(national_code);

    await axios
      .post(
        `${BASE_URL}/register`,
        {
          phone,
          password,
          national_code,
          name,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        if (response.status === 201) {
          const token = response.data.access_token;
          await SecureStore.setItemAsync("token", token);

          set({ token, user: response.data.user, isLoading: false });
        } else {
          Toast.show({
            type: "error",
            text1: "خطا!",
            text2: "خطا در ثبت نام.",
          });
        }
      })
      .catch((error: AxiosError) => {
        Toast.show({
          type: "error",
          text1: "خطا!",
          text2: "خطا در اتصال به سرور.",
        });
        console.log(error.response?.data);
      });
  },

  checkAuth: async () => {
    const token = await SecureStore.getItemAsync("token");

    if (!token) {
      return set({ isLoading: false, token: null, user: null });
    }

    try {
      const res = await axios.get(`${BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      set({ token, user: res.data, isLoading: false });
    } catch (err) {
      console.log("errrrr:" + err);
      await SecureStore.deleteItemAsync("token");
      set({ token: null, user: null, isLoading: false }); // 👈 حتما اینو ست کن
    }
  },
}));
