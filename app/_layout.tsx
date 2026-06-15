import { useAuthStore } from "@/stores/useAuthStore";
import { Stack, useRouter, usePathname } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import {
  ActivityIndicator,
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
    const runCheck = async () => {
      await initializeDatabase();

      if (await isOnline()) {
        if (token) {
          await syncWithServer();
        }
        await checkAuth();
      }
    };
    runCheck();
  }, []);

  // useEffect(() => {
  //   if (token) {
  //     router.replace("/(tabs)/measurement");
  //   }
  // }, [token]);

  useEffect(() => {
    if (!isLoading && !token && pathname !== "/auth") {
      router.replace("/auth");
    }
  }, [isLoading, token, pathname]);

  if (!fontsLoaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast
        config={{
          success: ({ text1, text2 }) => (
            <View
              style={{
                padding: 16,
                backgroundColor: "#4BB543",
                borderRadius: 8,
              }}
            >
              <Text className="text-white font-vazir-bold text-right">
                {text1}
              </Text>
              <Text className="text-white font-vazir text-right">{text2}</Text>
            </View>
          ),
          error: ({ text1, text2 }) => (
            <View className="bg-amber-600 p-3 rounded-md">
              <Text className="text-white font-vazir-bold text-right">
                {text1}
              </Text>
              <Text className="text-white font-vazir text-right">{text2}</Text>
            </View>
          ),
          info: ({ text1, text2 }) => (
            <View
              style={{
                padding: 16,
                backgroundColor: "#4294FF",
                borderRadius: 8,
                flexDirection: "row-reverse",
                alignItems: "center",
                gap: 20,
              }}
            >
              <Image
                source={icons.info as ImageSourcePropType}
                style={{ width: 40, height: 40 }}
              />
              <View>
                <Text className="text-white font-vazir-bold text-right">
                  {text1}
                </Text>
                <Text className="text-white font-vazir text-right">
                  {text2}
                </Text>
              </View>
            </View>
          ),
        }}
      />
    </>
  );
}
