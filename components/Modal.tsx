import { View, Text, Modal } from "react-native";
import React from "react";

interface CustomModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const CustomModal = ({ children, isOpen, onClose }: CustomModalProps) => {
  return (
    <Modal
      visible={isOpen}
      statusBarTranslucent
    >
      <View className="bg-black/80 w-full h-screen p-8 flex-1 items-center justify-center">
        {children}
      </View>
    </Modal>
  );
};

export default CustomModal;
