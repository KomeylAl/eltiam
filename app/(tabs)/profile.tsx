import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { convertDate } from "@/utils/converts";

const Profile = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  const registerDate = new Date(
    user?.created_at ? user?.created_at : Date.now()
  );
  const jalaliDate = convertDate(registerDate);

  return (
    <ScrollView className="bg-white text-black" style={{ height: "100%" }}>
      <View
        className="w-full bg-[#469173] flex items-center justify-center"
        style={{ paddingTop: 50, height: 180 }}
      >
        <Text className="text-3xl text-white font-vazir-bold">حساب کاربری</Text>
        <Text className="text-xl text-white font-vazir mt-6">
          تنظیمات حساب کاربری
        </Text>
      </View>

      <View className="mx-5 mt-5 rounded-lg border border-gray-300 p-6 flex-col items-end justify-center gap-6">
        <View className="w-full flex-row items-center justify-end gap-4">
          <Text className="text-[#469173] text-right font-vazir-bold text-lg">
            {user?.name}
          </Text>
          <Text className="text-gray-900 text-right font-vazir-bold text-lg">
            نام ونام خانوادگی:
          </Text>
        </View>
        <View className="w-full h-[1px] bg-gray-300" />
        <View className="w-full flex-row items-center justify-end gap-4">
          <Text className="text-[#469173] text-right font-vazir-bold text-lg">
            {user?.national_code}
          </Text>
          <Text className="text-gray-900 text-right font-vazir-bold text-lg">
            کد ملی:
          </Text>
        </View>
        <View className="w-full h-[1px] bg-gray-300" />
        <View className="w-full flex-row items-center justify-end gap-4">
          <Text className="text-[#469173] text-right font-vazir-bold text-lg">
            {user?.phone}
          </Text>
          <Text className="text-gray-900 text-right font-vazir-bold text-lg">
            شماره تلفن:
          </Text>
        </View>
        <View className="w-full h-[1px] bg-gray-300" />
        <View className="w-full flex-row items-center justify-end gap-4">
          <Text className="text-[#469173] font-vazir-bold text-lg text-left">
            {jalaliDate}
          </Text>
          <Text className="text-gray-900 text-right font-vazir-bold text-lg">
            تاریخ عضویت:
          </Text>
        </View>
      </View>

      <TouchableOpacity
        className="bg-white p-4 rounded-lg mt-5 mx-5 border border-[#469173]"
        // onPress={handleLogout}
      >
        <Text className="text-center text-[#469173] font-vazir text-lg">
          ویرایش اطلاعات
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-white p-4 rounded-lg mt-5 mx-5 border border-rose-500"
        onPress={handleLogout}
      >
        <Text className="text-center text-rose-500 font-vazir text-lg">
          خروج
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;
