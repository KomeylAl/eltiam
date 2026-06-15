import { useState } from "react";

import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

interface LoginFormProps {
  onSignupPressed: () => void;
}

const LoginForm = ({ onSignupPressed }: LoginFormProps) => {
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
        text2: "لطفا همه فیلد هارا پر کنید",
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
      <Text className="text-white font-vazir text-lg text-center mt-5">
        برای ورود به برنامه شماره تلفن و رمز عبور خود را وارد کنید
      </Text>

      <TextInput
        placeholder="شماره تلفن"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(text: string) =>
          setForm((prev) => ({ ...prev, phone: text }))
        }
        placeholderTextColor={"#d1d5db"}
        className="font-vazir px-4 py-4 text-right border border-white rounded-lg mt-5 text-lg text-white"
      />

      <TextInput
        placeholder="رمز عبور"
        keyboardType="visible-password"
        secureTextEntry
        value={form.password}
        onChangeText={(text: string) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        placeholderTextColor={"#d1d5db"}
        className="font-vazir px-4 py-4 text-right border border-white rounded-lg mt-5 text-lg text-white"
      />

      <TouchableOpacity
        className={`p-4 rounded-lg mt-5 ${isLoading ? "bg-white/30" : "bg-white "}`}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text className={`text-center font-vazir text-lg ${isLoading ? "text-white" : "text-[#469173]"}`}>
          {isLoading ? "در حال ورود" : "ورود"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="p-4 rounded-lg mt-5"
        onPress={onSignupPressed}
      >
        <Text className="text-center text-white font-vazir text-lg">
          حساب کاربری ندارید؟ ثبت نام کنید
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
