import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { isOnline } from "@/utils/netcheck";
import { syncWithServer } from "@/utils/db";
import Toast from "react-native-toast-message";
import SecureForm from "@/components/SecureForm";
import CustomModal from "@/components/Modal";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SettingRow from "@/components/ui/SettingRow";

const Settings = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    setIsLoading(true);
    if (await isOnline()) {
      await syncWithServer({ showToast: true });
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
    <ScrollView
      className="bg-surface"
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <ScreenHeader
        title="تنظیمات"
        subtitle="انجام تنظیمات و پر کردن فرم‌های پیش‌فرض"
      />

      <View className="mt-6">
        <SettingRow
          label="ویرایش فرم اولیه"
          description="به‌روزرسانی اطلاعات ایمنی و حمایتی"
          icon="document-text-outline"
          onPress={() => setShowModal(true)}
        />
        <SettingRow
          label="همگام‌سازی با سرور"
          description="ارسال داده‌های ذخیره‌شده به سرور"
          icon="cloud-upload-outline"
          onPress={handlePress}
          loading={isLoading}
        />
      </View>

      <CustomModal isOpen={showModal} onClose={() => setShowModal(false)}>
        <View className="min-h-[50%] max-h-[80%] rounded-3xl bg-white overflow-hidden">
          <SecureForm onSubmit={() => setShowModal(false)} />
        </View>
      </CustomModal>
    </ScrollView>
  );
};

export default Settings;
