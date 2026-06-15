import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { isFirstTimeUser } from "@/stores/formStore";
import { convertDate } from "@/utils/converts";
import { toJalaali } from "jalaali-js";
import { dates, questions } from "@/utils/constants";
import SurveyForm from "@/components/Form";
import CustomModal from "@/components/Modal";
import SecureForm from "@/components/SecureForm";

const Measurement = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const flatListRef = useRef<FlatList>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const checkFormStatus = async () => {
      const isDone = await isFirstTimeUser();
      setShowModal(isDone);
      setChecking(false);
    };
    checkFormStatus();
  }, []);

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
      {checking ? (
        <View className="h-screen flex-1 justify-center items-center">
          <Text className="text-black font-vazir">در حال بررسی...</Text>
        </View>
      ) : (
        <>
          <View
            className="w-full bg-[#469173] flex items-center justify-center"
            style={{ paddingTop: 50, height: 180 }}
          >
            <Text className="text-3xl text-white font-vazir-bold">سنجش</Text>
            <FlatList
              ref={flatListRef}
              data={dates}
              horizontal
              inverted
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.date}
              onScrollToIndexFailed={() => {}}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    item.date === selectedDate
                      ? setSelectedDate(item.date)
                      : null
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

          <View className="px-4 mt-6">
            <Text className="font-vazir text-black text-xl text-center">
              فرم روز: {date}
            </Text>
            <SurveyForm questions={questions} />
          </View>

          {/* مودال فرم اولیه */}
          <CustomModal isOpen={showModal} onClose={() => {}}>
            <View className="flex-1 justify-center items-center bg-black/50 p-4">
              <View className="bg-white p-6 rounded-xl w-full max-w-md shadow">
                <Text className="text-lg font-vazir-bold mb-4 text-right">
                  فرم اولیه
                </Text>
                <Text className="text-lg font-vazir mb-4 text-right">
                  لطفا چند دقیقه از وقتتون رو بگذارین و به چند سوال کوتاه پاسخ
                  بدین. این سوالات در روند مداخله تاثیر گذار خواهند بود.
                </Text>
                {/* فرم کاملت رو اینجا بذار */}

                <View className="mt-4 flex-row-reverse justify-between">
                  <TouchableOpacity
                    className="px-6 py-2 bg-[#5ba88a] rounded-md flex items-center justify-center"
                    onPress={() => {
                      setShowSecondModal(true);
                      setShowModal(false);
                    }}
                  >
                    <Text className="text-white font-vazir">ثبت فرم</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="px-6 py-3 bg-blue-500 rounded-md flex items-center justify-center"
                    onPress={() => setShowModal(false)}
                  >
                    <Text className="text-white font-vazir">فعلا بیخیال</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </CustomModal>

          <CustomModal isOpen={showSecondModal} onClose={() => {}}>
            <View className="min-h-[50%] max-h-[80%] bg-white rounded-lg">
              <SecureForm onSubmit={() => setShowSecondModal(false)} />
            </View>
          </CustomModal>
        </>
      )}
    </ScrollView>
  );
};

export default Measurement;
