import {
  View,
  ScrollView,
  ImageBackground,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import images from "@/utils/images";
import LoginForm from "@/components/LoginForm";

const Auth = () => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="w-full h-full"
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <ImageBackground
          source={images.loginBack as ImageSourcePropType}
          resizeMode="cover"
          style={{ flex: 1, minHeight: "100%" }}
        >
          <View className="flex-1 bg-black/35 px-6 py-16 justify-center">
            <View className="bg-white/12 backdrop-blur rounded-3xl p-6 border border-white/25">
              <LoginForm />
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Auth;
