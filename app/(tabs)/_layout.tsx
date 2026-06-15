import { View, Image, Pressable } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import icons, { iconFill } from "@/utils/icons";

const NavIcon = ({ icon }: any) => {
  return (
    <View className="min-w-[112px] min-h-16 flex-row gap-2 w-full flex-1 justify-center items-center overflow-hidden mt-6">
      <Image source={icon} className="size-7" />
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarButton: (props: any) => (
            <Pressable android_ripple={null} {...props} />
          ),
          tabBarItemStyle: {
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          },
          tabBarStyle: {
            direction: "rtl",
            backgroundColor: "#469173",
            borderRadius: 50,
            marginHorizontal: 20,
            marginBlock: 36,
            height: 60,
            position: "absolute",
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "transparent",
            shadowColor: "transparent",
          },
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="measurement"
          options={{
            headerShown: false,
            title: "Measurement",
            tabBarIcon: ({ focused }) => (
              <NavIcon
                icon={focused ? icons.measurement : iconFill.measurementFill}
                title="سنجش"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="intervention"
          options={{
            headerShown: false,
            title: "Intervention",
            tabBarIcon: ({ focused }) => (
              <NavIcon
                icon={focused ? iconFill.interventionFill : icons.intervention}
                title="مداخله"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            headerShown: false,
            title: "Settings",
            tabBarIcon: ({ focused }) => (
              <NavIcon
                icon={focused ? iconFill.settingFill : icons.setting}
                title="تنظیمات"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <NavIcon
                icon={focused ? iconFill.userFill : icons.user}
                title="پروفایل"
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
