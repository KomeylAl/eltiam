import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import Button from "@/components/ui/Button";

interface SignupFormProps {
  onLoginPressed: () => void;
}

const SignupForm = ({ onLoginPressed }: SignupFormProps) => {
  const [form, setForm] = useState({
    phone: "",
    password: "",
    name: "",
    national_code: "",
    pass_confirm: "",
  });

  const { register, isLoading } = useAuthStore();

  const handleRegister = async () => {
    if (
      !form.phone ||
      !form.password ||
      !form.name ||
      !form.national_code ||
      !form.pass_confirm
    ) {
      Toast.show({
        type: "error",
        text1: "خطا!",
        text2: "لطفا همه فیلد هارا پر کنید",
      });
      return;
    }

    if (form.password !== form.pass_confirm) {
      Toast.show({
        type: "error",
        text1: "خطا!",
        text2: "رمز عبور با تکرار آن مطابقت ندارد",
      });
      return;
    }

    await register(form.phone, form.password, form.national_code, form.name);
    router.replace("/");
  };

  const inputClass =
    "font-vazir px-4 py-4 text-right border border-white/50 rounded-2xl text-lg text-white bg-white/10";

  return (
    <View>
      <Text className="text-white font-vazir-bold text-3xl text-center">
        ثبت نام
      </Text>
      <Text className="text-white/90 font-vazir text-base text-center mt-3 leading-7">
        برای ثبت نام اطلاعات خود را به طور کامل وارد کنید
      </Text>

      <TextInput
        placeholder="نام و نام خانوادگی"
        keyboardType="default"
        value={form.name}
        onChangeText={(text: string) =>
          setForm((prev) => ({ ...prev, name: text }))
        }
        placeholderTextColor="#ffffff99"
        className={`${inputClass} mt-6`}
      />

      <TextInput
        placeholder="شماره تلفن"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(text: string) =>
          setForm((prev) => ({ ...prev, phone: text }))
        }
        placeholderTextColor="#ffffff99"
        className={`${inputClass} mt-4`}
      />

      <TextInput
        placeholder="کد ملی"
        keyboardType="number-pad"
        value={form.national_code}
        onChangeText={(text: string) =>
          setForm((prev) => ({ ...prev, national_code: text }))
        }
        placeholderTextColor="#ffffff99"
        className={`${inputClass} mt-4`}
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
        className={`${inputClass} mt-4`}
      />

      <TextInput
        placeholder="تکرار رمز عبور"
        keyboardType="visible-password"
        secureTextEntry
        value={form.pass_confirm}
        onChangeText={(text: string) =>
          setForm((prev) => ({ ...prev, pass_confirm: text }))
        }
        placeholderTextColor="#ffffff99"
        className={`${inputClass} mt-4`}
      />

      <View className="mt-6">
        <Button
          label="ثبت نام"
          onPress={handleRegister}
          loading={isLoading}
          disabled={isLoading}
          variant="light"
        />
      </View>

      <View className="mt-3">
        <Button
          label="حساب کاربری دارید؟ وارد شوید"
          onPress={onLoginPressed}
          variant="ghost"
          className="py-3"
        />
      </View>
    </View>
  );
};

export default SignupForm;
