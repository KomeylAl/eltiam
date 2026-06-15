import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import { isOnline } from "@/utils/netcheck";
import { syncWithServer } from "@/utils/db";
import Toast from "react-native-toast-message";
import SecureForm from "@/components/SecureForm";
import CustomModal from "@/components/Modal";

const Settings = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    setIsLoading(true);
    if (await isOnline()) {
      await syncWithServer();
    } else {
      Toast.show({
        type: "error",
        text1: "خطا",
        text2: "اتصال به اینترنت برقرار نیست.",
      });
    }
    setIsLoading(false);
  };

  return (
    <ScrollView className="bg-white text-black" style={{ height: "100%" }}>
      <View
        className="w-full bg-[#469173] flex items-center justify-center"
        style={{ paddingTop: 50, height: 180 }}
      >
        <Text className="text-3xl text-white font-vazir-bold">تنظیمات</Text>
        <Text className="text-xl text-white font-vazir mt-6">
          انجام تنظیمات و پر کردن فرم های پیشفرض
        </Text>
      </View>

      <TouchableOpacity
        className="bg-white p-4 rounded-lg mt-5 mx-5 border border-[#469173]"
        onPress={() => setShowModal(true)}
      >
        <Text className="text-center text-[#469173] font-vazir text-lg">
          ویرایش فرم اولیه
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-white p-4 rounded-lg mt-5 mx-5 border border-[#469173]"
        onPress={handlePress}
        disabled={isLoading}
      >
        <Text className="text-center text-[#469173] font-vazir text-lg">
          {isLoading ? "در حال همگام سازی..." : "همگام سازی اطلاعات با سرور"}
        </Text>
      </TouchableOpacity>

      <CustomModal isOpen={showModal} onClose={() => setShowModal(false)}>
        <View className="min-h-[50%] max-h-[80%] rounded-lg bg-white">
          <SecureForm onSubmit={() => setShowModal(false)} />
        </View>
      </CustomModal>
    </ScrollView>
  );
};

export default Settings;
