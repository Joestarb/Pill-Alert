import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text, Layout } from "@ui-kitten/components";
import { useRouter, Redirect } from "expo-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../contexts/store";
import { getSession } from "@/utils/session";
import { fetchMedication } from "@/api/supabaseMedication";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function HomeScreen() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [medications, setMedications] = useState<any[]>([]);

  useEffect(() => {
    async function loadUserAndMeds() {
      const sessionUser = await getSession();
      setUser(sessionUser || null);

      if (sessionUser?.user_id) {
        try {
          const result = await fetchMedication(sessionUser.user_id);
          setMedications(result.items || []);
        } catch {
          setMedications([]);
        }
      }
    }

    loadUserAndMeds();
  }, []);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text category="h5" style={styles.title}>
            ¡Hola {user?.nombre || user?.name || "usuario"}!
          </Text>
          <Text appearance="hint">Bienvenido a Pill Alert</Text>
        </View>
        {/* Bienvenida */}
        <View style={styles.card}>
          <Text category="s1" style={styles.cardText}>
            Bienvenido a <Text style={{ fontWeight: "bold" }}>Pill Alert</Text>,
            tu asistente inteligente para el control de medicamentos.
          </Text>
        </View>
        {/* Contador de medicamentos */}
        <View style={styles.counterBox}>
          <Ionicons name="medkit-outline" size={28} color="#0a7ea4" />
          <View>
            <Text category="s2" style={{ fontWeight: "600" }}>
              Medicamentos activos
            </Text>
            <Text>{medications.length} en total</Text>
          </View>
        </View>

        {/* Accesos rápidos */}
        <View style={styles.quickAccess}>
          <TouchableOpacity
            style={styles.accessCard}
            onPress={() => router.push("/MedicationCalendarScreen")}
          >
            <Ionicons name="calendar" size={26} color="#0a7ea4" />
            <Text style={styles.accessText}>Calendario</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.accessCard}
            onPress={() => router.push("/AsignarMedicamentoScreen")}
          >
            <MaterialIcons name="assignment" size={26} color="#0a7ea4" />
            <Text style={styles.accessText}>Asignar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.accessCard}
            onPress={() => router.push("/MedicationHistoryScreen")}
          >
            <FontAwesome5 name="history" size={22} color="#0a7ea4" />
            <Text style={styles.accessText}>Historial</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F6FA",
  },
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 20,
  },
    card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  counterBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  quickAccess: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  accessCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  accessText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
  },
});
