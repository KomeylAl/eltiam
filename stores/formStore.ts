import * as SecureStore from "expo-secure-store";

export const isFirstTimeUser = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync("user_setup_completed");
  return value !== "true"; // یعنی یا null یا falseه
};

export const markUserSetupComplete = async (): Promise<void> => {
  await SecureStore.setItemAsync("user_setup_completed", "true");
};

export interface UserSetupData {
  thinking_feelings: string;
  self_help: string;
  others_help: string;
  close_people_list: string;
  close_friends_thoughts: string;
  phone_calls: string;
  protected_places: string;
}

const FORM_KEY = "user_setup_data";

export const saveUserSetupData = async (data: UserSetupData): Promise<void> => {
  await SecureStore.setItemAsync(FORM_KEY, JSON.stringify(data));
};

export const getUserSetupData = async (): Promise<UserSetupData | null> => {
  const json = await SecureStore.getItemAsync(FORM_KEY);
  return json ? JSON.parse(json) : null;
};
