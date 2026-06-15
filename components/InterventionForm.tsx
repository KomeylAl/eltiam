import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import StepForm from "./StepperForm";
import PositiveWordGame from "./WordGame";
import ThirdForm from "./ThirdForm";
import { insertIntervention } from "@/utils/db";
import { useAuthStore } from "@/stores/useAuthStore";
import CustomModal from "@/components/Modal";

type InterventionFormProps = {
  questions: string[];
  onSubmit?: (answers: Record<number, number>) => void;
};

const options = ["اصلا", "خیلی کم", "تا حدی", "زیاد", "خیلی زیاد"];

// ساعت فعال‌سازی فرم‌ها
const activationHours = [
  { start: 8, end: 10 },
  { start: 11, end: 12 },
  { start: 12, end: 13 },
  { start: 14, end: 15 },
];

const InterventionForm: React.FC<InterventionFormProps> = ({
  questions,
  onSubmit,
}) => {
  const { user } = useAuthStore();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());
  const [expandedBlocks, setExpandedBlocks] = useState<Record<number, boolean>>(
    {}
  );

  const [isVisible, setIsVisible] = useState(false);
  const [isGameVisible, setIsGameVisible] = useState(false);
  const [isThirdVisible, setIsThirdVisible] = useState(false);

  const [isGameStart, setIsGameStart] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = async (questionIndex: number, optionIndex: number) => {
    if (questionIndex === 0 && (optionIndex === 3 || optionIndex === 4)) {
      setIsVisible(true);
    }

    if (questionIndex === 1 && (optionIndex === 3 || optionIndex === 4)) {
      setIsGameVisible(true);
    }

    if (questionIndex === 2 && (optionIndex === 3 || optionIndex === 4)) {
      setIsThirdVisible(true);
    }
    setAnswers({ ...answers, [questionIndex]: optionIndex });

    try {
      await insertIntervention(
        new Date().toISOString().slice(0, 10),
        `${new Date().getHours()}:${new Date().getMinutes()}`,
        user?.id ?? 0,
        user?.name ?? "",
        questionIndex,
        optionIndex
      );
    } catch (e) {
      console.log("error:" + e);
    }
  };

  const toggleExpand = (blockIndex: number) => {
    setExpandedBlocks((prev) => ({
      ...prev,
      [blockIndex]: !prev[blockIndex],
    }));
  };

  // تقسیم سوال‌ها به گروه‌های ساعتی
  const groupedQuestions: Record<number, string[]> = {};
  const perGroupCount = Math.floor(questions.length / activationHours.length);
  activationHours.forEach((hour, index) => {
    groupedQuestions[hour.start] = questions.slice(
      index * perGroupCount,
      (index + 1) * perGroupCount
    );
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {activationHours.map((hour, groupIdx) => {
        const isActive = currentHour < hour.end && currentHour >= hour.start;
        const isExpanded = expandedBlocks[groupIdx];

        return (
          <View key={groupIdx} style={styles.accordionContainer}>
            <TouchableOpacity
              // disabled={!isActive}
              onPress={() =>
                isActive
                  ? toggleExpand(groupIdx)
                  : Toast.show({
                      type: "info", // 'success' | 'error' | 'info'
                      text1: "عدم دسترسی",
                      text2: "این پرسشنامه هم اکنون فعال نیست",
                      position: "bottom", // 'top' یا 'bottom'
                      visibilityTime: 3000,
                    })
              }
              style={[
                styles.accordionHeader,
                { backgroundColor: isActive ? "#5ba88a" : "#b0c5be" },
              ]}
            >
              <Text className="font-vazir text-white text-center text-xl">
                سوالات ساعت {hour.start}:00
              </Text>
            </TouchableOpacity>

            {isActive && isExpanded && (
              <View style={styles.questionGroup}>
                {questions.map((question, qIdx) => (
                  <View key={`${hour}-${qIdx}`} style={styles.questionBlock}>
                    <Text className="text-center text-lg font-vazir">
                      {question}
                    </Text>
                    <View style={styles.optionsRow}>
                      {options.map((option, oIdx) => (
                        <TouchableOpacity
                          key={oIdx}
                          style={[
                            styles.optionButton,
                            answers[qIdx] === oIdx && styles.selectedOption,
                          ]}
                          onPress={() => handleSelect(qIdx, oIdx)}
                        >
                          <Text
                            style={[
                              styles.optionText,
                              answers[qIdx] === oIdx && styles.selectedText,
                            ]}
                          >
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
      <CustomModal isOpen={isVisible} onClose={() => {}}>
        <View className="w-full min-h-[50%] max-h-[80%] bg-white rounded-lg">
          <StepForm onSubmit={() => setIsVisible(false)} />
        </View>
      </CustomModal>

      <CustomModal isOpen={isGameVisible} onClose={() => {}}>
        <View className={`p-8 bg-white rounded-lg ${isGameStart && "h-4/5"}`}>
          {!isGameStart && (
            <View>
              <Text className="text-center font-vazir text-xl">
                قراره یه بازی کلمات ساده انجام بدیم. حاضری؟
              </Text>
              <View className="w-full flex flex-row-reverse items-center gap-4 justify-center mt-6">
                <TouchableOpacity
                  onPress={() => setIsGameStart(true)}
                  className="w-1/3 bg-[#5ba88a] p-2 rounded-lg"
                >
                  <Text className="text-center text-white font-vazir-bold">
                    بله
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsGameVisible(false)}
                  className="w-1/3 bg-rose-500 p-2 rounded-lg"
                >
                  <Text className="text-center text-white font-vazir-bold">
                    خیر
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {isGameStart && (
            <PositiveWordGame
              onFinish={() => {
                setIsGameVisible(false);
                setIsGameStart(false);
              }}
            />
          )}
        </View>
      </CustomModal>

      <CustomModal isOpen={isThirdVisible} onClose={() => {}}>
        <ThirdForm
          onSuccess={() => {
            Toast.show({
              type: "success",
              text1: "موفق",
              text2: "اطلاعات با موفقیت ثبت شد.",
            });
            setIsThirdVisible(false);
          }}
        />
      </CustomModal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 100,
    position: "relative",
  },
  accordionContainer: {
    marginBottom: 20,
  },
  accordionHeader: {
    padding: 15,
    borderRadius: 8,
  },
  accordionTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  questionGroup: {
    marginTop: 10,
    backgroundColor: "#ededed",
    borderRadius: 8,
    padding: 20,
  },
  questionBlock: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionsRow: {
    marginTop: 25,
    flexDirection: "column",
    gap: 10,
  },
  optionButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginBottom: 5,
    borderColor: "#007AFF",
    borderWidth: 1,
  },
  selectedOption: {
    backgroundColor: "#007AFF",
  },
  optionText: {
    color: "#333",
    fontFamily: "Vazir",
    textAlign: "center",
  },
  selectedText: {
    color: "#fff",
  },
  modalText: { fontSize: 18 },
  closeText: { marginTop: 10, color: "#007AFF" },
});

export default InterventionForm;
