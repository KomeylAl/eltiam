import { useAuthStore } from "@/stores/useAuthStore";
import { Stack, useRouter, usePathname } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import {
  Image,
  ImageSourcePropType,
  Text,
  View,
} from "react-native";

import "./globals.css";
import Toast from "react-native-toast-message";
import icons from "@/utils/icons";
import { initializeNotifications } from "@/lib/notifications";
import { useSetupNotificationsOnce } from "@/lib/notifications";
import { initializeDatabase, syncWithServer } from "@/utils/db";
import { isOnline } from "@/utils/netcheck";
import SplashLoader from "@/components/ui/SplashLoader";

export default function RootLayout() {
  useSetupNotificationsOnce();
  const { checkAuth, isLoading, token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const [fontsLoaded] = useFonts({
    Vazir: require("../assets/fonts/vazir.ttf"),
    VazirBold: require("../assets/fonts/vazir-bold.ttf"),
  });

  useEffect(() => {
    initializeNotifications();
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeDatabase();
      await checkAuth();

      if (await isOnline()) {
        const currentToken = useAuthStore.getState().token;
        if (currentToken) {
          await syncWithServer();
        }
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!fontsLoaded || isLoading) return;

    if (!token && pathname !== "/auth") {
      router.replace("/auth");
    } else if (token && pathname === "/auth") {
      router.replace("/");
    }
  }, [fontsLoaded, isLoading, token, pathname]);

  if (!fontsLoaded || isLoading) {
    return <SplashLoader />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast
        config={{
          success: ({ text1, text2 }) => (
            <View className="mx-4 px-4 py-3 bg-white rounded-2xl border-r-4 border-r-green-500 shadow-lg">
              <Text className="text-green-700 font-vazir-bold text-right text-base">
                {text1}
              </Text>
              {text2 ? (
                <Text className="text-textMuted font-vazir text-right text-sm mt-1">
                  {text2}
                </Text>
              ) : null}
            </View>
          ),
          error: ({ text1, text2 }) => (
            <View className="mx-4 px-4 py-3 bg-white rounded-2xl border-r-4 border-r-danger shadow-lg">
              <Text className="text-danger font-vazir-bold text-right text-base">
                {text1}
              </Text>
              {text2 ? (
                <Text className="text-textMuted font-vazir text-right text-sm mt-1">
                  {text2}
                </Text>
              ) : null}
            </View>
          ),
          info: ({ text1, text2 }) => (
            <View className="mx-4 px-4 py-3 bg-white rounded-2xl border-r-4 border-r-primary flex-row-reverse items-center gap-3 shadow-lg">
              <Image
                source={icons.info as ImageSourcePropType}
                style={{ width: 32, height: 32 }}
              />
              <View className="flex-1">
                <Text className="text-primary font-vazir-bold text-right text-base">
                  {text1}
                </Text>
                {text2 ? (
                  <Text className="text-textMuted font-vazir text-right text-sm mt-1">
                    {text2}
                  </Text>
                ) : null}
              </View>
            </View>
          ),
        }}
      />
    </>
  );
}
