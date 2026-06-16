import React from "react";
import { View, Text, ScrollView } from "react-native";
import { convertDate } from "@/utils/converts";
import InterventionForm from "@/components/InterventionForm";
import { dates } from "@/utils/constants";
import ScreenHeader from "@/components/ui/ScreenHeader";
import DatePickerStrip from "@/components/ui/DatePickerStrip";
import { useJalaliDatePicker } from "@/hooks/useJalaliDatePicker";

const questions = [
  "از زمان آخرین پاسخدهی تا به این لحظه، آیا احساس میکردید باری بر دوش دیگرانید؟",
  "از زمان آخرین پاسخدهی تا به این لحظه، آیا احساس میکردید به هیچ چیز تعلق ندارید؟",
  "از زمان آخرین پاسخدهی تا به این لحظه، آیا می خواستید خودکشی کنید؟",
];

const Intervention = () => {
  const { selectedDate, setSelectedDate, flatListRef } = useJalaliDatePicker();
  const date = convertDate(new Date());

  return (
    <ScrollView
      className="bg-surface"
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <ScreenHeader title="مداخله">
        <DatePickerStrip
          dates={dates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          flatListRef={flatListRef}
        />
      </ScreenHeader>

      <View className="px-5 mt-6">
        <View className="bg-white rounded-2xl px-4 py-3 mb-4 border border-border shadow-sm">
          <Text className="font-vazir text-textMuted text-sm text-center">
            فرم امروز
          </Text>
          <Text className="font-vazir-bold text-primary text-xl text-center mt-1">
            {date}
          </Text>
        </View>
        <InterventionForm questions={questions} />
      </View>
    </ScrollView>
  );
};

export default Intervention;
