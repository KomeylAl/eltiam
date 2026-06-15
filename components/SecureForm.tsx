import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import {
  getUserSetupData,
  isFirstTimeUser,
  markUserSetupComplete,
  saveUserSetupData,
} from "@/stores/formStore";

interface SecureFormProps {
  onSubmit: () => void;
}

const SecureForm = ({ onSubmit }: SecureFormProps) => {
  const [step, setStep] = useState(1);

  const [thinkingFeelings, setThinkingFeelings] = useState("");
  const [selfHelp, setSelfHelp] = useState("");
  const [othersHelp, setOthersHelp] = useState("");
  const [closePeopleList, setClosePeopleList] = useState("");
  const [friendThoughts, setFriendThoughts] = useState("");
  const [phoneCalls, setPhoneCalls] = useState("");
  const [protectedPlaces, setProtectedPlaces] = useState("");

  useEffect(() => {
    const checkData = async () => {
      const value = await isFirstTimeUser();
      if (!value) {
        const data = await getUserSetupData();
        setThinkingFeelings(data?.thinking_feelings ?? "");
        setSelfHelp(data?.self_help ?? "");
        setOthersHelp(data?.others_help ?? "");
        setClosePeopleList(data?.close_people_list ?? "");
        setFriendThoughts(data?.close_friends_thoughts ?? "");
        setPhoneCalls(data?.phone_calls ?? "");
        setProtectedPlaces(data?.protected_places ?? "");
      }
    };
    checkData();
  }, []);

  const canGoNext = () => {
    switch (step) {
      case 1:
        return thinkingFeelings.trim();
      case 2:
        return selfHelp.trim();
      case 3:
        return othersHelp.trim();
      case 4:
        return closePeopleList.trim();
      case 5:
        return friendThoughts.trim();
      case 6:
        return phoneCalls.trim();
      case 7:
        return protectedPlaces.trim();
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canGoNext()) setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 10 }}>
      <Text className="text-right font-vazir-bold text-2xl">مرحله {step}</Text>

      {step === 1 && (
        <>
          <Text className="text-right font-vazir text-lg">
            چه حسی داره وقتی افکار خودکشی هجوم میارن؟ علائم هشدار دهنده (مثلا
            افکار، تصاویر، هیجانات، خلق و یا رفتار ها) رو با استفاده از کلمات
            خودتون فهرست کنین.
          </Text>
          <TextInput
            multiline
            style={{
              height: 200,
              textAlignVertical: "top", // متن از بالا شروع شود
              borderColor: "#ccc",
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
            }}
            numberOfLines={5}
            value={thinkingFeelings}
            onChangeText={setThinkingFeelings}
            className="w-full border border-gray-300 rounded-lg font-vazir text-right"
          />
        </>
      )}

      {step === 2 && (
        <>
          <Text className="text-right font-vazir text-lg">
            خودتون به تنهایی چه کارهایی میتونین انجام بدین تا این افکار رو کاهش
            بدین؟ چه چیزی میتونه مانع استفاده شما از ابزار خودکشی بشه؟ از روش حل
            مسئله هم میتونین استفاده کنین.
          </Text>
          <TextInput
            multiline
            numberOfLines={5}
            style={{
              height: 200,
              textAlignVertical: "top", // متن از بالا شروع شود
              borderColor: "#ccc",
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
            }}
            value={selfHelp}
            onChangeText={setSelfHelp}
            className="w-full border border-gray-300 rounded-lg font-vazir text-right"
          />
        </>
      )}

      {step === 3 && (
        <>
          <Text className="text-right font-vazir text-lg">
            چه کسی بهتون کمک میکنه تا حداقل یا مدت کوتاهی حواستون رو از افکار و
            مشکلات پرت کنین؟ یا چه کسی هست که وقتی باهاش مشورت میکنین حس یهتری
            پیدا میکنین؟ به کجا ها میتونین برین که آدم هایی اطرافتون باشن؟
          </Text>
          <TextInput
            multiline
            numberOfLines={5}
            style={{
              height: 200,
              textAlignVertical: "top", // متن از بالا شروع شود
              borderColor: "#ccc",
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
            }}
            value={othersHelp}
            onChangeText={setOthersHelp}
            className="w-full border border-gray-300 rounded-lg font-vazir text-right"
          />
        </>
      )}

      {step === 4 && (
        <>
          <Text className="text-right font-vazir text-lg">
            لیستی از افراد معتمد دور و نزدیک خودتون رو فهرست کنین که به شما گوش
            میدن و میتونن کنارتون مونده و شمارو حمایت کنن. تو این مرحله باید
            بیان کنین که در خطر خودکشی هستین.
          </Text>
          <TextInput
            multiline
            numberOfLines={5}
            style={{
              height: 200,
              textAlignVertical: "top", // متن از بالا شروع شود
              borderColor: "#ccc",
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
            }}
            value={closePeopleList}
            onChangeText={setClosePeopleList}
            className="w-full border border-gray-300 rounded-lg font-vazir text-right"
          />
        </>
      )}

      {step === 5 && (
        <>
          <Text className="text-right font-vazir text-lg">
            اگه یکی از دوستای صمیمی تون فکر خودکشی داشته باشه چی بهش میگین؟ بقیه
            چه چیز هایی میتونن بگن که کمک کننده باشه؟
          </Text>
          <TextInput
            multiline
            numberOfLines={5}
            style={{
              height: 200,
              textAlignVertical: "top", // متن از بالا شروع شود
              borderColor: "#ccc",
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
            }}
            value={friendThoughts}
            onChangeText={setFriendThoughts}
            className="w-full border border-gray-300 rounded-lg font-vazir text-right"
          />
        </>
      )}

      {step === 6 && (
        <>
          <Text className="text-right font-vazir text-lg">
            به چه کسایی میتونین زنگ بزنین؟ (حتما شماره هارو هم بنویسین). برای
            مثال: اعضای خانواده و فامیل، متخصصین، تلفن های مشاوره رایگان، دوستان
            یا شخص دیگه ای (مجازی یا واقعی).
          </Text>
          <TextInput
            multiline
            numberOfLines={5}
            style={{
              height: 200,
              textAlignVertical: "top", // متن از بالا شروع شود
              borderColor: "#ccc",
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
            }}
            value={phoneCalls}
            onChangeText={setPhoneCalls}
            className="w-full border border-gray-300 rounded-lg font-vazir text-right"
          />
        </>
      )}

      {step === 7 && (
        <>
          <Text className="text-right font-vazir text-lg">
            لطفا مکان های امنی که میتونین برین رو یادداشت کنین.
          </Text>
          <TextInput
            multiline
            numberOfLines={5}
            style={{
              height: 200,
              textAlignVertical: "top", // متن از بالا شروع شود
              borderColor: "#ccc",
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
            }}
            value={protectedPlaces}
            onChangeText={setProtectedPlaces}
            className="w-full border border-gray-300 rounded-lg font-vazir text-right"
          />
        </>
      )}

      <View
        style={{
          flexDirection: "row-reverse",
          marginTop: 30,
          justifyContent: "space-between",
        }}
      >
        {step > 1 && (
          <TouchableOpacity onPress={handlePrev}>
            <Text
              className={`font-vazir text-white px-4 py-2 rounded-lg bg-[#5ba88a]`}
            >
              مرحله قبل
            </Text>
          </TouchableOpacity>
        )}

        {step < 7 && (
          <TouchableOpacity disabled={!canGoNext()} onPress={handleNext}>
            <Text
              className={`font-vazir text-white px-4 py-2 rounded-lg ${
                canGoNext() ? "bg-[#5ba88a]" : "bg-[#b0c5be]"
              }`}
            >
              مرحله بعد
            </Text>
          </TouchableOpacity>
        )}

        {step === 7 && (
          <TouchableOpacity
            disabled={!canGoNext()}
            onPress={async () => {
              await saveUserSetupData({
                thinking_feelings: thinkingFeelings,
                self_help: selfHelp,
                others_help: othersHelp,
                close_people_list: closePeopleList,
                close_friends_thoughts: friendThoughts,
                phone_calls: phoneCalls,
                protected_places: protectedPlaces,
              });
              await markUserSetupComplete();
              Toast.show({
                type: "success",
                text1: "با تشکر از شما",
                text2: "فرم ابتدایی با وفقت ثبت شد.",
              });
              onSubmit();
            }}
          >
            <Text
              className={`font-vazir text-white px-4 py-2 rounded-lg ${
                canGoNext() ? "bg-[#5ba88a]" : "bg-[#b0c5be]"
              }`}
            >
              پایان
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default SecureForm;
