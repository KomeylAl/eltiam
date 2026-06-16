import { FlatList, Text, TouchableOpacity, View } from "react-native";
import React, { RefObject } from "react";

interface DateItem {
  date: string;
}

interface DatePickerStripProps {
  dates: DateItem[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  flatListRef?: RefObject<FlatList<DateItem> | null>;
}

const DatePickerStrip = ({
  dates,
  selectedDate,
  onSelectDate,
  flatListRef,
}: DatePickerStripProps) => {
  return (
    <FlatList
      ref={flatListRef}
      data={dates}
      horizontal
      inverted
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.date}
      onScrollToIndexFailed={() => {}}
      contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 20 }}
      renderItem={({ item }) => {
        const isSelected = item.date === selectedDate;
        return (
          <TouchableOpacity
            onPress={() => onSelectDate(item.date)}
            activeOpacity={0.75}
            className={`mx-1.5 px-4 h-10 rounded-full justify-center items-center border ${
              isSelected
                ? "bg-white border-white"
                : "bg-white/15 border-white/40"
            }`}
          >
            <Text
              className={`font-vazir text-sm ${
                isSelected ? "text-primary font-vazir-bold" : "text-white"
              }`}
            >
              {item.date}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default DatePickerStrip;
