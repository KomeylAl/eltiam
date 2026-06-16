import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { convertDate } from "@/utils/converts";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SettingRow from "@/components/ui/SettingRow";
import { Ionicons } from "@expo/vector-icons";

const ProfileInfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => (
  <View className="w-full flex-row items-center justify-end gap-3 py-3">
    <Text className="text-primary text-right font-vazir-bold text-base flex-shrink">
      {value ?? "—"}
    </Text>
    <Text className="text-textMuted text-right font-vazir text-base">
      {label}
    </Text>
  </View>
);

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
    <ScrollView
      className="bg-surface"
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <ScreenHeader title="حساب کاربری" subtitle="اطلاعات و تنظیمات پروفایل" />

      <View className="mx-5 -mt-2 bg-white rounded-3xl border border-border p-6 shadow-sm">
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-surfaceAlt items-center justify-center border-2 border-primary/20">
            <Ionicons name="person" size={36} color="#469173" />
          </View>
          <Text className="text-text font-vazir-bold text-xl mt-3">
            {user?.name}
          </Text>
          <Text className="text-textMuted font-vazir text-sm mt-1">
            {user?.phone}
          </Text>
        </View>

        <View className="border-t border-border pt-2">
          <ProfileInfoRow label="نام و نام خانوادگی:" value={user?.name} />
          <View className="h-px bg-border" />
          <ProfileInfoRow label="کد ملی:" value={user?.national_code} />
          <View className="h-px bg-border" />
          <ProfileInfoRow label="شماره تلفن:" value={user?.phone} />
          <View className="h-px bg-border" />
          <ProfileInfoRow label="تاریخ عضویت:" value={jalaliDate} />
        </View>
      </View>

      <View className="mt-6">
        <SettingRow
          label="ویرایش اطلاعات"
          description="به‌زودی در دسترس خواهد بود"
          icon="create-outline"
          onPress={() => {}}
        />
        <SettingRow
          label="خروج از حساب"
          description="خروج امن از برنامه"
          icon="log-out-outline"
          variant="danger"
          onPress={handleLogout}
        />
      </View>
    </ScrollView>
  );
};

export default Profile;
