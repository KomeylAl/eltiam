import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { Platform } from "react-native";

let Notifications: any = null;
let notificationsError: Error | null = null;

// Conditionally load notifications to handle Expo Go limitations
try {
  if (Platform.OS !== "web") {
    Notifications = require("expo-notifications");
  }
} catch (error) {
  notificationsError = error as Error;
  console.warn("Notifications unavailable:", (error as Error).message);
}

export const initializeNotifications = async () => {
  if (!Notifications) {
    console.warn("Notifications not available in this environment");
    return;
  }

  try {
    await Notifications.requestPermissionsAsync();
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: false,
        shouldShowList: true,
      }),
    });
  } catch (error) {
    console.warn("Failed to initialize notifications:", error);
  }
};

const NOTIF_SETUP_KEY = "notifications_initialized";

async function scheduleAllNotifications() {
  if (!Notifications) return;

  try {
    // این تابع چهارتا نوتیف با زمان مشخص تنظیم می‌کنه
    const times = [
      { hour: 8, minute: 0 },
      { hour: 10, minute: 0 },
      { hour: 14, minute: 0 },
      { hour: 16, minute: 0 },
    ];

    for (const t of times) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "یادآوری!",
          body: `نوتیف ساعت ${t.hour}:${
            t.minute < 10 ? "0" + t.minute : t.minute
          } - قراره یه پرسشنامه ساده پر کنی.`,
        },
        trigger: {
          hour: t.hour,
          minute: t.minute,
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
        },
      });
    }

    await SecureStore.setItemAsync(NOTIF_SETUP_KEY, "true");
  } catch (error) {
    console.warn("Failed to schedule notifications:", error);
  }
}

export function useSetupNotificationsOnce() {
  useEffect(() => {
    const setup = async () => {
      if (!Notifications) return;

      try {
        const alreadySet = await SecureStore.getItemAsync(NOTIF_SETUP_KEY);
        if (!alreadySet) {
          const { granted } = await Notifications.requestPermissionsAsync();
          if (granted) {
            await scheduleAllNotifications();
          }
        }
      } catch (error) {
        console.warn("Failed to setup notifications:", error);
      }
    };
    setup();
  }, []);
}
