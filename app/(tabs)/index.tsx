import { Redirect } from "expo-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../contexts/store";
import { View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import NotiModal from "@/components/NotiModal";
import React, { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import MedicationCard from "@/components/MedicationCard";
import { getSession } from "@/utils/session";
import { fetchMedication } from "@/api/supabaseMedication";

export default function HomeScreen() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [medications, setMedications] = useState<any[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function cargarUsuarioYMedicamentos() {
      setLoading(true);
      const usuario = await getSession();
      if (usuario) {
        setUser(usuario);
        try {
          const result = await fetchMedication(usuario.user_id);
          setMedications(result.items);
          setGroupName(result.groupName);
        } catch (e) {
          setMedications([]);
          setGroupName("");
        }
      } else {
        setUser(null);
        setMedications([]);
        setGroupName("");
      }
      setLoading(false);
    }
    cargarUsuarioYMedicamentos();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Sin fecha";
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString("es-MX", options);
  };

  const recentActivity = [
    {
      id: "1",
      action: "Tomó Paracetamol",
      time: "Hace 2 horas",
      status: "completed",
    },
    {
      id: "2",
      action: "Recordatorio Ibuprofeno",
      time: "Hace 5 horas",
      status: "missed",
    },
  ];

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>
 
    </View>
  );
}

const styles = StyleSheet.create({
  // Tus estilos originales...
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    fontSize: 18,
    color: "#64748b",
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAll: {
    color: "#4f8cff",
    fontSize: 14,
    fontWeight: "500",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  completedIcon: {
    backgroundColor: "#d1fae5",
  },
  missedIcon: {
    backgroundColor: "#fee2e2",
  },
  activityText: {
    flex: 1,
  },
  activityAction: {
    fontSize: 16,
    color: "#1e293b",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 14,
    color: "#64748b",
  },
});
