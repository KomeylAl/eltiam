import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import Toast from "react-native-toast-message";
import ConfettiCannon from "react-native-confetti-cannon";
import icons from "@/utils/icons";
import { insertWordGame } from "@/utils/db";
import { useAuthStore } from "@/stores/useAuthStore";

const WORDS = [
  { word: "ارزشمند", isPositive: true },
  { word: "قابل اعتماد", isPositive: true },
  { word: "اضافی", isPositive: false },
  { word: "سربار", isPositive: false },
  { word: "مفید", isPositive: true },
  { word: "قابل اتکا", isPositive: true },
  { word: "بی ارزش", isPositive: false },
  { word: "بی فایده", isPositive: false },
  { word: "کارآمد", isPositive: true },
  { word: "تاثیرگذار", isPositive: true },
  { word: "نخواستنی", isPositive: false },
  { word: "خواستنی", isPositive: true },
  { word: "دوست داشتنی", isPositive: true },
  { word: "دوست نداشتنی", isPositive: false },
  { word: "بی تاثیر", isPositive: false },
  { word: "بدردنخور", isPositive: false },
];

const POSITIVE_COUNT = WORDS.filter((w) => w.isPositive).length;
const TIME_LIMIT = 59;

const shuffleArray = (array: any) => [...array].sort(() => Math.random() - 0.5);

export default function PositiveWordGame({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const { user } = useAuthStore();
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const intervalRef = useRef(0);
  const hasSavedRef = useRef(false);

  const shuffledWords = useMemo(() => shuffleArray(WORDS), []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setGameEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, []);

  useEffect(() => {
    if (gameEnded) {
      handleGameEnd();
    }
  }, [gameEnded]);

  const handleSelectWord = (wordObj: (typeof WORDS)[0]) => {
    if (selectedWords.includes(wordObj.word) || gameEnded) return;

    if (wordObj.isPositive) {
      Toast.show({
        type: "success",
        text1: "آفرین!",
        text2: "کلمه مثبت رو درست انتخاب کردی! 🌟",
      });

      const updated = [...selectedWords, wordObj.word];
      setSelectedWords(updated);
      setScore((prev) => prev + 10);

      if (updated.length === POSITIVE_COUNT) {
        setShowConfetti(true);

        Toast.show({
          type: "success",
          text1: "کارت عالی بود! 🎉",
          text2: "همه کلمات مثبت رو درست زدی!",
        });

        clearInterval(intervalRef.current!); // قطع تایمر
        setGameEnded(true);
      }
    } else {
      Toast.show({
        type: "info",
        text1: "این کلمه مثبت نیست 😅",
        text2: "دوباره تلاش کن!",
      });
      setScore((prev) => prev - 5);
    }
  };

  const handleGameEnd = async () => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    const bonus = timeLeft;
    const finalScore = score + bonus;

    if (selectedWords.length < POSITIVE_COUNT) {
      Toast.show({
        type: "info",
        text1: "زمان تموم شد ⏰",
        text2: "همین که تلاش کردی عالیه! ادامه بده 💪",
      });
    }

    console.log("🔢 امتیاز نهایی:", finalScore);

    try {
      await insertWordGame(
        new Date().toISOString().slice(0, 10),
        `${new Date().getHours()}:${new Date().getMinutes()}`,
        user?.id ?? 0,
        user?.name ?? "",
        finalScore
      );
    } catch (e) {
      console.log("error:" + e);
    }
    onFinish();
  };

  return (
    <View>
      <Text className="text-right font-vazir-bold text-lg">
        لطفا کلمات مثبت رو انتخاب کنین
      </Text>
      <Text className="text-right font-vazir text-lg mt-3">
        ⏳ زمان باقی‌مانده: {timeLeft} ثانیه
      </Text>

      <View style={styles.wordContainer}>
        {shuffledWords.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.wordItem,
              selectedWords.includes(item.word) && styles.selectedWord,
            ]}
            onPress={() => handleSelectWord(item)}
          >
            <Text style={styles.wordText}>{item.word}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {showConfetti && (
        <ConfettiCannon count={100} origin={{ x: 200, y: 0 }} fadeOut />
      )}

      <Toast
        position="bottom"
        config={{
          success: ({ text1, text2 }) => (
            <View
              style={{
                padding: 16,
                backgroundColor: "#4BB543",
                borderRadius: 8,
              }}
            >
              <Text className="text-white font-vazir-bold text-right">
                {text1}
              </Text>
              <Text className="text-white font-vazir text-right">{text2}</Text>
            </View>
          ),
          error: ({ text1, text2 }) => (
            <View
              style={{
                padding: 16,
                backgroundColor: "#FC3D3D",
                borderRadius: 8,
              }}
            >
              <Text className="text-white font-vazir-bold text-right">
                {text1}
              </Text>
              <Text className="text-white font-vazir text-right">{text2}</Text>
            </View>
          ),
          info: ({ text1, text2 }) => (
            <View
              style={{
                padding: 16,
                backgroundColor: "#4294FF",
                borderRadius: 8,
                flexDirection: "row-reverse",
                alignItems: "center",
                gap: 20,
              }}
            >
              <Image
                source={icons.info as ImageSourcePropType}
                style={{ width: 40, height: 40 }}
              />
              <View>
                <Text className="text-white font-vazir-bold text-right">
                  {text1}
                </Text>
                <Text className="text-white font-vazir text-right">
                  {text2}
                </Text>
              </View>
            </View>
          ),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    justifyContent: "center",
  },
  timer: {
    fontSize: 18,
    marginBottom: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  list: {
    alignItems: "center",
    gap: 12,
  },
  wordBox: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    margin: 8,
    minWidth: "40%",
    alignItems: "center",
  },
  wordBoxSelected: {
    backgroundColor: "#5ba88a",
  },
  wordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 4,
    columnGap: 8,
    padding: 16,
    justifyContent: "flex-end",
    height: "100%",
  },
  wordItem: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginBottom: 8,
  },
  selectedWord: {
    backgroundColor: "#469173",
  },
  wordText: {
    fontSize: 16,
    fontFamily: "Vazir",
    color: "#333",
  },
});
