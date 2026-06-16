import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost" | "light";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const variantStyles: Record<
  ButtonVariant,
  { container: string; text: string; loadingColor: string }
> = {
  primary: {
    container: "bg-primary shadow-sm",
    text: "text-white",
    loadingColor: "#ffffff",
  },
  secondary: {
    container: "bg-primary-light shadow-sm",
    text: "text-white",
    loadingColor: "#ffffff",
  },
  outline: {
    container: "bg-white border border-primary",
    text: "text-primary",
    loadingColor: "#469173",
  },
  danger: {
    container: "bg-white border border-danger",
    text: "text-danger",
    loadingColor: "#e11d48",
  },
  ghost: {
    container: "bg-transparent",
    text: "text-white",
    loadingColor: "#ffffff",
  },
  light: {
    container: "bg-white shadow-sm",
    text: "text-primary",
    loadingColor: "#469173",
  },
};

const Button = ({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
}: ButtonProps) => {
  const styles = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      className={`py-4 px-6 rounded-2xl items-center justify-center flex-row gap-2 ${
        styles.container
      } ${isDisabled ? "opacity-60" : ""} ${className}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={styles.loadingColor} />
      ) : null}
      <Text className={`font-vazir text-lg text-center ${styles.text}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
