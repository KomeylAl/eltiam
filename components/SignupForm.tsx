import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

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

  return (
    <View>
      <Text className="text-white font-vazir-bold text-3xl text-center">
        ثبت نام
      </Text>
      <Text className="text-white font-vazir text-lg text-center mt-5">
        برای ثبت نام اطلاعات خود را به طور کامل وارد کنید
      </Text>

      <TextInput
        placeholder="نام و نام خانوادگی"
        keyboardType="default"
        value={form.name}
        onChangeText={(text: string) =>
          setForm((prev) => ({ ...prev, name: text }))
        }
        placeholderTextColor={"#d1d5db"}
        className="font-vazir px-4 py-4 text-right border border-white rounded-lg mt-5 text-lg text-white"
      />

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
        placeholder="کد ملی"
        keyboardType="number-pad"
        value={form.national_code}
        onChangeText={(text: string) =>
          setForm((prev) => ({ ...prev, national_code: text }))
        }
        placeholderTextColor={"#d1d5db"}
        className="font-vazir px-4 py-4 text-right border border-white rounded-lg mt-5 text-lg text-white"
      />

      <TextInput
        placeholder="رمز عبور"
        keyboardType="visible-password"
        value={form.password}
        onChangeText={(text: string) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        placeholderTextColor={"#d1d5db"}
        className="font-vazir px-4 py-4 text-right border border-white rounded-lg mt-5 text-lg text-white"
      />

      <TextInput
        placeholder="تکرار رمز عبور"
        keyboardType="visible-password"
        value={form.pass_confirm}
        onChangeText={(text: string) =>
          setForm((prev) => ({ ...prev, pass_confirm: text }))
        }
        placeholderTextColor={"#d1d5db"}
        className="font-vazir px-4 py-4 text-right border border-white rounded-lg mt-5 text-lg text-white"
      />

      <TouchableOpacity
        className="bg-[#fff] p-4 rounded-lg mt-5"
        onPress={handleRegister}
      >
        <Text className="text-center text-[#469173] font-vazir text-lg">
          ثبت نام
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="p-4 rounded-lg mt-5"
        onPress={onLoginPressed}
      >
        <Text className="text-center text-white font-vazir text-lg">
          حساب کاربری دارید؟ وارد شوید
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupForm;
