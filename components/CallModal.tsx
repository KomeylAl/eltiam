import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import React from "react";

interface CallModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const callPhoneNumber = (phone: string) => {
  Linking.openURL(`tel:${phone}`);
};

const CallModal = ({ isVisible, onClose }: CallModalProps) => {
  return (
    <View style={styles.modalBox}>
      <Text className="mt-6 text-lg font-vazir text-center">
        تو تنها نیستی؛ افرادی هستند که به تو اهمیت می‌دهند و می‌خواهند کمکت
        کنند. اگر نیاز به صحبت داری، همین حالا تماس بگیر:
      </Text>

      <View className="w-full" style={{ gap: 10 }}>
        <TouchableOpacity
          className="w-full p-4 bg-blue-500 rounded-lg"
          onPress={() => callPhoneNumber("123")}
        >
          <Text className="text-center text-white text-lg font-vazir">123</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full p-4 bg-blue-500 rounded-lg"
          onPress={() => callPhoneNumber("1480")}
        >
          <Text className="text-center text-white text-lg font-vazir">
            1480
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full p-2 bg-amber-500 rounded-lg mt-3"
          onPress={onClose}
        >
          <Text className="text-center text-white text-lg font-vazir">
            بستن
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    gap: 20,
  },
});

export default CallModal;
