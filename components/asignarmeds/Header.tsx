import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface HeaderProps {
  usuariosConMedicamento: number;
  totalUsuarios: number;
}

const Header: React.FC<HeaderProps> = ({
  usuariosConMedicamento,
  totalUsuarios,
}) => (
  <View style={styles.header}>
    <Text style={styles.titulo}>Asignación de Medicamentos</Text>
    <Text style={styles.subtitulo}>
      {usuariosConMedicamento} de {totalUsuarios} usuarios con medicamento
    </Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  titulo: { fontSize: 24, fontWeight: "bold", color: "#212529" },
  subtitulo: { fontSize: 14, color: "#6c757d", marginTop: 4 },
});

export default Header;
