import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { colors } from "@/utils/theme";

const SplashLoader = () => {
  return (
    <View
      className="flex-1 items-center justify-center bg-surface"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="w-20 h-20 rounded-3xl bg-primary items-center justify-center mb-6 shadow-lg">
        <Text className="text-white font-vazir-bold text-3xl">ا</Text>
      </View>
      <Text className="text-primary font-vazir-bold text-2xl mb-2">التیام</Text>
      <Text className="text-textMuted font-vazir text-base mb-8">
        در حال بارگذاری...
      </Text>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default SplashLoader;
