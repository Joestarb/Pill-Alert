import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text } from "react-native";
import CalendarMain from "../../components/medcalendar/CalendarMain";

export default function MedicationCalendarScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <Text style={styles.title}>Calendario de Medicamentos</Text>
      <CalendarMain />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212529",
    textAlign: "center",
    marginVertical: 20,
  },
});
