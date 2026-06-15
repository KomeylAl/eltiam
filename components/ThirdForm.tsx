import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getUserSetupData, UserSetupData } from "@/stores/formStore";
import { Checkbox } from "react-native-paper";
import { useAuthStore } from "@/stores/useAuthStore";
import { insertSafteyPlan } from "@/utils/db";

const ThirdForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useAuthStore();

  const [isSelected, setSelection] = useState(false);
  const [isSecondSelected, setSecondSelection] = useState(false);
  const [data, setData] = useState<UserSetupData | null>(null);

  const [thinkingFeelings, setThinkingFeelings] = useState("");
  const [selfHelp, setSelfHelp] = useState("");
  const [othersHelp, setOthersHelp] = useState("");
  const [closePeopleList, setClosePeopleList] = useState("");
  const [friendThoughts, setFriendThoughts] = useState("");
  const [phoneCalls, setPhoneCalls] = useState("");
  const [protectedPlaces, setProtectedPlaces] = useState("");

  useEffect(() => {
    const getData = async () => {
      const data = await getUserSetupData();
      setData(data);
      setThinkingFeelings(data?.thinking_feelings ?? "");
      setSelfHelp(data?.self_help ?? "");
      setOthersHelp(data?.others_help ?? "");
      setClosePeopleList(data?.close_people_list ?? "");
      setFriendThoughts(data?.close_friends_thoughts ?? "");
      setPhoneCalls(data?.phone_calls ?? "");
      setProtectedPlaces(data?.protected_places ?? "");
    };
    getData();
  }, []);

  const onSubmit = async () => {
    try {
      await insertSafteyPlan(
        new Date().toISOString().slice(0, 10),
        `${new Date().getHours()}:${new Date().getMinutes()}`,
        user?.id ?? 0,
        user?.name ?? "",
        isSelected ? 1 : 0,
        isSecondSelected ? 1 : 0,
        thinkingFeelings,
        selfHelp,
        othersHelp,
        closePeopleList,
        friendThoughts,
        phoneCalls,
        protectedPlaces
      );
      onSuccess();
    } catch (e) {
      console.log("error:" + e);
    }
  };

  return (
    <ScrollView className="w-full min-h-[50%] max-h-[80%] bg-white rounded-lg p-6">
      <View className="pb-10">
        <Text className="font-vazir-bold text-right text-xl">
          برنامه ایمنی خودکشی
        </Text>
        <Checkbox.Item
          label="مطمئنم که همه لوازم خطرناک از من دور هستند"
          style={{
            marginTop: 14,
            paddingRight: 0,
            alignItems: "flex-start",
          }}
          labelStyle={{
            fontFamily: "Vazir",
            textAlign: "right",
          }}
          status={isSelected ? "checked" : "unchecked"}
          onPress={() => setSelection(!isSelected)}
        />

        <Checkbox.Item
          label="بعد از اتمام این بحران، باید به روانشناس ا مشاور مراجعه کنم"
          style={{
            marginTop: 14,
            paddingRight: 0,
            alignItems: "flex-start",
          }}
          labelStyle={{
            fontFamily: "Vazir",
            textAlign: "right",
          }}
          status={isSecondSelected ? "checked" : "unchecked"}
          onPress={() => setSecondSelection(!isSecondSelected)}
        />

        <Text className="font-vazir text-right text-xl mt-4">
          پاسخ های پیشین شما به دیگر سوالات این فرم: (در صورت تمایل میتونین پاسخ
          هارو تغییر بدین و در نهایت ثبت کنین)
        </Text>

        <Text className="text-right font-vazir mt-4">
          چه حسی داره وقتی افکار خودکشی هجوم میارن؟ علائم هشدار دهنده (مثلا
          افکار، تصاویر، هیجانات، خلق و یا رفتار ها) رو با استفاده از کلمات
          خودتون فهرست کنین.
        </Text>

        <TextInput
          multiline
          style={{
            height: 120,
            textAlignVertical: "top", // متن از بالا شروع شود
            borderColor: "#ccc",
            borderWidth: 1,
            padding: 10,
            borderRadius: 8,
          }}
          numberOfLines={3}
          value={thinkingFeelings}
          onChangeText={setThinkingFeelings}
          className="w-full border border-gray-300 mt-2 rounded-lg font-vazir text-right"
        />

        <Text className="text-right font-vazir mt-4">
          خودتون به تنهایی چه کارهایی میتونین انجام بدین تا این افکار رو کاهش
          بدین؟ چه چیزی میتونه مانع استفاده شما از ابزار خودکشی بشه؟ از روش حل
          مسئله هم میتونین استفاده کنین.
        </Text>

        <TextInput
          multiline
          style={{
            height: 120,
            textAlignVertical: "top", // متن از بالا شروع شود
            borderColor: "#ccc",
            borderWidth: 1,
            padding: 10,
            borderRadius: 8,
          }}
          numberOfLines={3}
          value={selfHelp}
          onChangeText={setSelfHelp}
          className="w-full border border-gray-300 mt-2 rounded-lg font-vazir text-right"
        />

        <Text className="text-right font-vazir mt-4">
          چه کسی بهتون کمک میکنه تا حداقل یا مدت کوتاهی حواستون رو از افکار و
          مشکلات پرت کنین؟ یا چه کسی هست که وقتی باهاش مشورت میکنین حس یهتری
          پیدا میکنین؟ به کجا ها میتونین برین که آدم هایی اطرافتون باشن؟
        </Text>

        <TextInput
          multiline
          style={{
            height: 120,
            textAlignVertical: "top", // متن از بالا شروع شود
            borderColor: "#ccc",
            borderWidth: 1,
            padding: 10,
            borderRadius: 8,
          }}
          numberOfLines={3}
          value={othersHelp}
          onChangeText={setOthersHelp}
          className="w-full border border-gray-300 mt-2 rounded-lg font-vazir text-right"
        />

        <Text className="text-right font-vazir mt-4">
          لیستی از افراد معتمد دور و نزدیک خودتون رو فهرست کنین که به شما گوش
          میدن و میتونن کنارتون مونده و شمارو حمایت کنن. تو این مرحله باید بیان
          کنین که در خطر خودکشی هستین.
        </Text>

        <TextInput
          multiline
          style={{
            height: 120,
            textAlignVertical: "top", // متن از بالا شروع شود
            borderColor: "#ccc",
            borderWidth: 1,
            padding: 10,
            borderRadius: 8,
          }}
          numberOfLines={3}
          value={closePeopleList}
          onChangeText={setClosePeopleList}
          className="w-full border border-gray-300 mt-2 rounded-lg font-vazir text-right"
        />

        <Text className="text-right font-vazir mt-4">
          گه یکی از دوستای صمیمی تون فکر خودکشی داشته باشه چی بهش میگین؟ بقیه چه
          چیز هایی میتونن بگن که کمک کننده باشه؟
        </Text>

        <TextInput
          multiline
          style={{
            height: 120,
            textAlignVertical: "top", // متن از بالا شروع شود
            borderColor: "#ccc",
            borderWidth: 1,
            padding: 10,
            borderRadius: 8,
          }}
          numberOfLines={3}
          value={friendThoughts}
          onChangeText={setFriendThoughts}
          className="w-full border border-gray-300 mt-2 rounded-lg font-vazir text-right"
        />

        <Text className="text-right font-vazir mt-4">
          به چه کسایی میتونین زنگ بزنین؟ (حتما شماره هارو هم بنویسین). برای
          مثال: اعضای خانواده و فامیل، متخصصین، تلفن های مشاوره رایگان، دوستان
          یا شخص دیگه ای (مجازی یا واقعی).
        </Text>

        <TextInput
          multiline
          style={{
            height: 120,
            textAlignVertical: "top", // متن از بالا شروع شود
            borderColor: "#ccc",
            borderWidth: 1,
            padding: 10,
            borderRadius: 8,
          }}
          numberOfLines={3}
          value={phoneCalls}
          onChangeText={setPhoneCalls}
          className="w-full border border-gray-300 mt-2 rounded-lg font-vazir text-right"
        />

        <Text className="text-right font-vazir mt-4">
          لطفا مکان های امنی که میتونین برین رو یادداشت کنین.
        </Text>

        <TextInput
          multiline
          style={{
            height: 120,
            textAlignVertical: "top", // متن از بالا شروع شود
            borderColor: "#ccc",
            borderWidth: 1,
            padding: 10,
            borderRadius: 8,
          }}
          numberOfLines={3}
          value={protectedPlaces}
          onChangeText={setProtectedPlaces}
          className="w-full border border-gray-300 mt-2 rounded-lg font-vazir text-right"
        />

        <TouchableOpacity
          className="bg-white p-4 rounded-lg mt-5 mx-5 border border-[#469173]"
          onPress={onSubmit}
          disabled={
            !thinkingFeelings ||
            !selfHelp ||
            !othersHelp ||
            !closePeopleList ||
            !friendThoughts ||
            !phoneCalls ||
            !protectedPlaces
          }
        >
          <Text className="text-center text-[#469173] font-vazir text-lg">
            ثبت اطلاعات
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ThirdForm;
