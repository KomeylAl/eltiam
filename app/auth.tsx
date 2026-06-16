import { useState } from "react";
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
import SignupForm from "@/components/SignupForm";

const Auth = () => {
  const [screen, setScreen] = useState("login");

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
              {screen === "login" ? (
                <LoginForm onSignupPressed={() => setScreen("signup")} />
              ) : (
                <SignupForm onLoginPressed={() => setScreen("login")} />
              )}
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Auth;
