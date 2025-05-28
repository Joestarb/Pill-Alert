
import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "../../contexts/store";

export default function HomeScreen() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // Aquí puedes renderizar el contenido principal de la pantalla Home
  return (
    <View>
      <Text>index</Text>
    </View>
  );
}
