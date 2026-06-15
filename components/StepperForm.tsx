// فرم چندمرحله‌ای حل مسئله اجتماعی با useState و بدون react-hook-form
import { insertSocialProblem } from "@/utils/db";
import { useAuthStore } from "@/stores/useAuthStore";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";

interface StepFormProps {
  onSubmit: () => void;
}

const StepForm = ({ onSubmit }: StepFormProps) => {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);

  const [problem, setProblem] = useState("");
  const [reason, setReason] = useState("");

  const [solutions, setSolutions]: any = useState([
    { text: "" },
    { text: "" },
    { text: "" },
  ]);
  const [evaluations, setEvaluations]: any = useState([]); // [{ strengths, weaknesses }]

  const [bestIndex, setBestIndex] = useState(null);
  const [plan, setPlan] = useState("");

  const handleAddSolution = () => {
    setSolutions([...solutions, { text: "" }]);
  };

  const canGoNext = () => {
    switch (step) {
      case 1:
        return problem.trim() && reason.trim();
      case 2:
        return solutions.filter((s: any) => s.text.trim()).length >= 3;
      case 3:
        return (
          evaluations.length === solutions.length &&
          evaluations.every((e: any) => e.strengths && e.weaknesses)
        );
      case 4:
        return bestIndex !== null;
      case 5:
        return plan.trim();
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
          <Text className="text-right font-vazir text-lg">مشکلتون چیه؟</Text>
          <TextInput
            value={problem}
            onChangeText={setProblem}
            placeholder="شرح مشکل"
            className="w-full border border-gray-300 rounded-lg font-vazir text-right"
          />
          <Text className="text-right font-vazir text-lg">
            چه چیزی باعث این فکر شده؟
          </Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="دلیل فکر خودکشی"
            className="w-full border border-gray-300 rounded-lg font-vazir text-right"
          />
        </>
      )}

      {step === 2 && (
        <>
          <Text className="text-right font-vazir text-lg">
            چه راه‌حل‌هایی به ذهنت می‌رسه؟ (حداقل ۳ مورد)
          </Text>
          {solutions.map((s: any, i: number) => (
            <TextInput
              key={i}
              value={s.text}
              onChangeText={(text) => {
                const newSolutions = [...solutions];
                newSolutions[i].text = text;
                setSolutions(newSolutions);
              }}
              className="w-full border border-gray-300 rounded-lg font-vazir text-right"
              placeholder={`راه‌حل ${i + 1}`}
            />
          ))}
          <TouchableOpacity onPress={handleAddSolution}>
            <Text style={{ color: "blue" }} className="font-vazir">
              افزودن راه‌حل جدید
            </Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <Text className="text-right font-vazir text-lg">
            نقاط قوت و ضعف هر راه‌حل:
          </Text>
          {solutions.map((s: any, i: number) => (
            <View key={i} style={{ marginBottom: 15 }}>
              <Text className="text-right font-vazir-bold">
                <Text className="text-[#5ba88a]">{i + 1 + "-"}</Text> {s.text}
              </Text>
              <TextInput
                placeholder="نقاط قوت"
                value={evaluations[i]?.strengths || ""}
                onChangeText={(text) => {
                  const newEvals = [...evaluations];
                  newEvals[i] = {
                    ...(newEvals[i] || {}),
                    strengths: text,
                  };
                  setEvaluations(newEvals);
                }}
                className="w-full border border-gray-300 rounded-lg font-vazir text-right"
              />
              <TextInput
                placeholder="نقاط ضعف"
                value={evaluations[i]?.weaknesses || ""}
                onChangeText={(text) => {
                  const newEvals = [...evaluations];
                  newEvals[i] = {
                    ...(newEvals[i] || {}),
                    weaknesses: text,
                  };
                  setEvaluations(newEvals);
                }}
                className="w-full border border-gray-300 rounded-lg font-vazir text-right mt-4"
              />
            </View>
          ))}
        </>
      )}

      {step === 4 && (
        <>
          <Text className="text-right font-vazir text-lg">
            کدام راه‌حل را بهترین می‌دانی؟
          </Text>
          {solutions.map((s: any, i: any) => (
            <TouchableOpacity key={i} onPress={() => setBestIndex(i)}>
              <Text
                className={`text-right font-vazir ${
                  bestIndex === i ? "text-white" : "text-gray-900"
                } rounded-lg`}
                style={{
                  padding: 10,
                  backgroundColor: bestIndex === i ? "#5ba88a" : "#eee",
                  marginVertical: 5,
                }}
              >
                {s.text}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {step === 5 && (
        <>
          <Text className="text-right font-vazir text-lg">
            چطور می‌خواهی این راه‌حل را اجرا کنی؟
          </Text>
          <TextInput
            value={plan}
            onChangeText={setPlan}
            placeholder="برنامه اجرای راه‌حل"
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

        {step < 5 && (
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

        {step === 5 && (
          <TouchableOpacity
            disabled={!canGoNext()}
            onPress={async () => {
              Toast.show({
                type: "success",
                text1: "موفق",
                text2: "فرم با موفقیت ثبت شد.",
              });
              const so = solutions.map((item: any) => item.text).join(", ");
              const ev = evaluations
                .map(
                  (item: any, index: any) =>
                    `نقاط قوت راه حل ${index + 1} : ${
                      item.strengths
                    } - نقاط ضعف راه حل ${index + 1} : ${item.weaknesses}`
                )
                .join(", ");
              try {
                await insertSocialProblem(
                  new Date().toISOString().slice(0, 10),
                  `${new Date().getHours()}:${new Date().getMinutes()}`,
                  user?.id ?? 0,
                  user?.name ?? "",
                  problem,
                  reason,
                  so,
                  ev,
                  bestIndex ? solutions[bestIndex].text : "",
                  plan
                );
              } catch (e) {
                console.log("error:" + e);
              }
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

export default StepForm;
