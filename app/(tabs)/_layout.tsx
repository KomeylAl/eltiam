import { View, Image, Pressable, Platform, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import icons, { iconFill } from "@/utils/icons";

const ICON_SIZE = 22;

const NavIcon = ({ icon, focused }: { icon: any; focused: boolean }) => (
  <View
    style={{ width: 28, height: 28, alignItems: "center", justifyContent: "center" }}
    className={focused ? "rounded-xl bg-white/25" : ""}
  >
    <Image
      source={icon}
      style={{ width: ICON_SIZE, height: ICON_SIZE }}
      resizeMode="contain"
    />
  </View>
);

const TabLabel = ({ label, focused }: { label: string; focused: boolean }) => (
  <Text
    numberOfLines={1}
    adjustsFontSizeToFit
    minimumFontScale={0.75}
    style={{
      fontFamily: focused ? "VazirBold" : "Vazir",
      fontSize: 10,
      lineHeight: 14,
      color: focused ? "#ffffff" : "rgba(255,255,255,0.65)",
      textAlign: "center",
      width: "100%",
      paddingHorizontal: 2,
      includeFontPadding: false,
    }}
  >
    {label}
  </Text>
);

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarButton: (props: any) => (
          <Pressable android_ripple={null} {...props} />
        ),
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 4,
        },
        tabBarStyle: {
          direction: "rtl",
          backgroundColor: "#469173",
          borderRadius: 28,
          marginHorizontal: 16,
          marginBottom: Platform.OS === "ios" ? 28 : 20,
          height: 76,
          position: "absolute",
          paddingTop: 6,
          paddingBottom: Platform.OS === "ios" ? 10 : 8,
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: "#357a5f",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="measurement"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <NavIcon
              icon={focused ? icons.measurement : iconFill.measurementFill}
              focused={focused}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="سنجش" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="intervention"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <NavIcon
              icon={
                focused ? iconFill.interventionFill : icons.intervention
              }
              focused={focused}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="مداخله" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <NavIcon
              icon={focused ? iconFill.settingFill : icons.setting}
              focused={focused}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="تنظیمات" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <NavIcon
              icon={focused ? iconFill.userFill : icons.user}
              focused={focused}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="پروفایل" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
