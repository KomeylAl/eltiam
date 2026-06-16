import { View, Text } from "react-native";
import React from "react";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const ScreenHeader = ({ title, subtitle, children }: ScreenHeaderProps) => {
  return (
    <View className="overflow-hidden rounded-b-[28px] bg-primary">
      <View className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10" />
      <View className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
      <View style={{ paddingTop: 56, paddingBottom: 20, paddingHorizontal: 16 }}>
        <Text className="text-3xl text-white font-vazir-bold text-center">
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-base text-white/85 font-vazir text-center mt-2">
            {subtitle}
          </Text>
        ) : null}
        {children}
      </View>
    </View>
  );
};

export default ScreenHeader;
