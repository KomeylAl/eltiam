import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { toJalaali } from "jalaali-js";
import { convertDate } from "@/utils/converts";
import InterventionForm from "@/components/InterventionForm";
import { dates } from "@/utils/constants";

const questions = [
  "از زمان آخرین پاسخدهی تا به این لحظه، آیا احساس میکردید باری بر دوش دیگرانید؟",
  "از زمان آخرین پاسخدهی تا به این لحظه، آیا احساس میکردید به هیچ چیز تعلق ندارید؟",
  "از زمان آخرین پاسخدهی تا به این لحظه، آیا می خواستید خودکشی کنید؟",
];

const Intervention = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const flatListRef = useRef<FlatList>(null);

  const now = new Date();
  const date = convertDate(now);

  useEffect(() => {
    const now = new Date();
    const j = toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const todayJalali = `${j.jy}-${String(j.jm).padStart(2, "0")}-${String(
      j.jd
    ).padStart(2, "0")}`;
    setSelectedDate(todayJalali);

    // Scroll to selected index
    const index = dates.findIndex((d) => d.date === todayJalali);
    if (index !== -1) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
      }, 100);
    }
  }, []);

  return (
    <ScrollView className="bg-white text-black" style={{ height: "100%" }}>
      <View
        className="w-full bg-[#469173] flex items-center justify-center"
        style={{ paddingTop: 50, height: 180 }}
      >
        <Text className="text-3xl text-white font-vazir-bold">مداخله</Text>
        <FlatList
          ref={flatListRef}
          data={dates}
          horizontal
          inverted
          showsHorizontalScrollIndicator={false}
          onScrollToIndexFailed={() => {}}
          keyExtractor={(item) => item.date}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                item.date === selectedDate ? setSelectedDate(item.date) : null
              }
              style={{
                marginHorizontal: 10,
                marginTop: 25,
                borderRadius: 10,
                backgroundColor:
                  item.date === selectedDate ? "#fff" : "transparent",
                borderColor: "#fff",
                borderWidth: 1,
                paddingHorizontal: 16,
                height: 40,
                justifyContent: "center",
              }}
            >
              <Text
                className="text-white font-vazir"
                style={{
                  color: item.date === selectedDate ? "#469173" : "#fff",
                }}
              >
                {item.date}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* فرم روز انتخاب‌شده رو اینجا نشون بده */}
      {/* {dates.includes({ date: selectedDate }) ? ( */}
      <View className="px-4 mt-6">
        <Text className="font-vazir text-black text-xl text-center">
          فرم روز: {date}
        </Text>
        <InterventionForm questions={questions} />
      </View>
    </ScrollView>
  );
};

export default Intervention;
