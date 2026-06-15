import { useState } from "react";

import {
  View,
  ScrollView,
  ImageBackground,
  ImageSourcePropType,
} from "react-native";
import React from "react";
import images from "@/utils/images";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";

const Auth = () => {
  const [screen, setScreen] = useState("login");

  return (
    <ScrollView className="w-full h-full" style={{ flex: 1 }}>
      <ImageBackground
        source={images.loginBack as ImageSourcePropType}
        resizeMode="cover"
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View className="w-full h-[100vh] p-12 items-center justify-center">
          {screen === "login" ? (
            <LoginForm onSignupPressed={() => setScreen("signup")} />
          ) : (
            <SignupForm onLoginPressed={() => setScreen("login")} />
          )}
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default Auth;
