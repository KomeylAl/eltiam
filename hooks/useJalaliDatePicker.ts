import { useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";
import { toJalaali } from "jalaali-js";
import { dates } from "@/utils/constants";

export function useJalaliDatePicker() {
  const [selectedDate, setSelectedDate] = useState("");
  const flatListRef = useRef<FlatList<{ date: string }>>(null);

  useEffect(() => {
    const now = new Date();
    const j = toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const todayJalali = `${j.jy}-${String(j.jm).padStart(2, "0")}-${String(
      j.jd
    ).padStart(2, "0")}`;
    setSelectedDate(todayJalali);

    const index = dates.findIndex((d) => d.date === todayJalali);
    if (index !== -1) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
      }, 100);
    }
  }, []);

  return { selectedDate, setSelectedDate, flatListRef };
}
