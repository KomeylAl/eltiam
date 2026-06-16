import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { isFirstTimeUser } from "@/stores/formStore";
import { convertDate } from "@/utils/converts";
import { dates, questions } from "@/utils/constants";
import SurveyForm from "@/components/Form";
import CustomModal from "@/components/Modal";
import SecureForm from "@/components/SecureForm";
import ScreenHeader from "@/components/ui/ScreenHeader";
import DatePickerStrip from "@/components/ui/DatePickerStrip";
import Button from "@/components/ui/Button";
import { useJalaliDatePicker } from "@/hooks/useJalaliDatePicker";

const Measurement = () => {
  const { selectedDate, setSelectedDate, flatListRef } = useJalaliDatePicker();
  const [showModal, setShowModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkFormStatus = async () => {
      const isDone = await isFirstTimeUser();
      setShowModal(isDone);
      setChecking(false);
    };
    checkFormStatus();
  }, []);

  const date = convertDate(new Date());

  return (
    <ScrollView
      className="bg-surface"
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {checking ? (
        <View className="h-screen flex-1 justify-center items-center">
          <Text className="text-textMuted font-vazir">در حال بررسی...</Text>
        </View>
      ) : (
        <>
          <ScreenHeader title="سنجش">
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
            <SurveyForm questions={questions} />
          </View>

          <CustomModal isOpen={showModal} onClose={() => {}}>
            <View className="bg-white p-6 rounded-3xl w-full max-w-md border border-border">
              <View className="w-12 h-12 rounded-2xl bg-surfaceAlt items-center justify-center self-center mb-4">
                <Text className="text-primary font-vazir-bold text-xl">📋</Text>
              </View>
              <Text className="text-xl font-vazir-bold mb-3 text-right text-text">
                فرم اولیه
              </Text>
              <Text className="text-base font-vazir mb-6 text-right text-textMuted leading-7">
                لطفا چند دقیقه از وقتتون رو بگذارین و به چند سوال کوتاه پاسخ
                بدین. این سوالات در روند مداخله تاثیر گذار خواهند بود.
              </Text>

              <View className="gap-3">
                <Button
                  label="ثبت فرم"
                  onPress={() => {
                    setShowSecondModal(true);
                    setShowModal(false);
                  }}
                />
                <Button
                  label="فعلا بیخیال"
                  onPress={() => setShowModal(false)}
                  variant="outline"
                />
              </View>
            </View>
          </CustomModal>

          <CustomModal isOpen={showSecondModal} onClose={() => {}}>
            <View className="min-h-[50%] max-h-[80%] bg-white rounded-3xl overflow-hidden">
              <SecureForm onSubmit={() => setShowSecondModal(false)} />
            </View>
          </CustomModal>
        </>
      )}
    </ScrollView>
  );
};

export default Measurement;
