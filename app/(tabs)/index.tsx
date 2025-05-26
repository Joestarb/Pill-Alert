
import { Redirect } from "expo-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../contexts/store";
import { Text, View , Button} from "react-native";
import NotiModal from "@/components/NotiModal";
import React, { useState } from 'react';

export default function HomeScreen() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const [showModal, setShowModal] = useState(false);

  // if (!isAuthenticated) {
  //   return <Redirect href="/login" />;
  // }

  // Aquí puedes renderizar el contenido principal de la pantalla Home
  return (
    <View>
      <Text>index</Text>
      <Button title="Mostrar notificación" onPress={() => setShowModal(true)} />
      <NotiModal
      visible={showModal}
      onClose={() => setShowModal(false)}
      />
    </View>
  );
}
