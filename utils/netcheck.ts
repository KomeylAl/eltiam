import NetInfo from "@react-native-community/netinfo";

export async function isOnline(): Promise<boolean | null> {
  const state = await NetInfo.fetch();
  return state.isConnected && state.isInternetReachable;
}
