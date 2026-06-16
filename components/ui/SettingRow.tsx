import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface SettingRowProps {
  label: string;
  description?: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "default" | "danger";
  loading?: boolean;
}

const SettingRow = ({
  label,
  description,
  onPress,
  icon = "chevron-back",
  variant = "default",
  loading = false,
}: SettingRowProps) => {
  const isDanger = variant === "danger";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.75}
      className={`bg-white mx-5 mb-3 p-4 rounded-2xl border flex-row-reverse items-center gap-3 shadow-sm ${
        isDanger ? "border-danger/30" : "border-border"
      } ${loading ? "opacity-60" : ""}`}
    >
      <View
        className={`w-10 h-10 rounded-xl items-center justify-center ${
          isDanger ? "bg-dangerLight" : "bg-surfaceAlt"
        }`}
      >
        <Ionicons
          name={icon}
          size={20}
          color={isDanger ? "#e11d48" : "#469173"}
        />
      </View>
      <View className="flex-1 items-end">
        <Text
          className={`font-vazir-bold text-lg text-right ${
            isDanger ? "text-danger" : "text-text"
          }`}
        >
          {loading ? "در حال پردازش..." : label}
        </Text>
        {description ? (
          <Text className="font-vazir text-sm text-textMuted text-right mt-1">
            {description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default SettingRow;
