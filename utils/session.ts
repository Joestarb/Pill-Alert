import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveSession(user: any) {
  await AsyncStorage.setItem("user", JSON.stringify(user));
}

export async function getSession() {
  const user = await AsyncStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export async function clearSession() {
  await AsyncStorage.removeItem("user");
}
