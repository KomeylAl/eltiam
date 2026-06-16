import { View, Modal, Pressable } from "react-native";
import React from "react";

interface CustomModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const CustomModal = ({ children, isOpen, onClose }: CustomModalProps) => {
  return (
    <Modal visible={isOpen} statusBarTranslucent transparent animationType="fade">
      <Pressable
        className="bg-black/60 w-full h-full flex-1 items-center justify-center p-6"
        onPress={onClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()} className="w-full">
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CustomModal;
