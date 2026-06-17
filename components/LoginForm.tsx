import { useState } from "react";
import { View, Text, TextInput } from "react-native";
import React from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import Toast from "react-native-toast-message";
import Button from "@/components/ui/Button";

const LoginForm = () => {
  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.phone || !form.password) {
      Toast.show({
        type: "error",
        text1: "خطا!",
        text2: "لطفا همه فیلدها را پر کنید",
      });
      return;
    }
    setIsLoading(true);
    await login(form.phone, form.password);
    setIsLoading(false);
  };

  return (
    <View>
      <Text className="text-white font-vazir-bold text-3xl text-center">
        ورود به برنامه
      </Text>
      <Text className="text-white/90 font-vazir text-base text-center mt-3 leading-7">
        شماره تلفن و رمز عبور را که تراپیست به شما داده وارد کنید
      </Text>

      <TextInput
        placeholder="شماره تلفن"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(text: string) =>
          setForm((prev) => ({ ...prev, phone: text }))
        }
        placeholderTextColor="#ffffff99"
        className="font-vazir px-4 py-4 text-right border border-white/50 rounded-2xl mt-6 text-lg text-white bg-white/10"
      />

      <TextInput
        placeholder="رمز عبور"
        keyboardType="visible-password"
        secureTextEntry
        value={form.password}
        onChangeText={(text: string) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        placeholderTextColor="#ffffff99"
        className="font-vazir px-4 py-4 text-right border border-white/50 rounded-2xl mt-4 text-lg text-white bg-white/10"
      />

      <View className="mt-6">
        <Button
          label={isLoading ? "در حال ورود..." : "ورود"}
          onPress={handleLogin}
          disabled={isLoading}
          loading={isLoading}
          variant="light"
        />
      </View>

      <Text className="text-white/70 font-vazir text-sm text-center mt-4 leading-6">
        ثبت‌نام در اپ امکان‌پذیر نیست. در صورت نداشتن حساب، با تراپیست خود تماس
        بگیرید.
      </Text>
    </View>
  );
};

export default LoginForm;
