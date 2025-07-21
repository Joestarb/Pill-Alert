import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { fetchMedication, medicationItem } from "../../api/supabaseMedication";

export default function RemindersScreen() {
  const [reminders, setReminders] = useState<medicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReminders = async () => {
    setLoading(true);
    try {
      const { items } = await fetchMedication("31");  // Cambia al user loggeado
      setReminders(items);
      console.log(" Reminders loaded:", items);
    } catch (error) {
      console.error(" Error loading reminders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
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

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Recordatorios
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {reminders.length} recordatorios activos
        </ThemedText>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4f8cff" />
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name="medkit-outline" size={24} color="#4f8cff" />
                </View>
                <View style={styles.textContainer}>
                  <ThemedText style={styles.name}>{item.medication}</ThemedText>
                  <ThemedText style={styles.details}>Paciente: {item.patient}</ThemedText>
                </View>
              </View>
              <View style={styles.itemRight}>
                <ThemedText style={styles.time}>
                  {formatDate(item.time)}
                </ThemedText>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={48} color="#cbd5e1" />
              <ThemedText style={styles.emptyText}>No hay recordatorios</ThemedText>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f8fafc",
  },
  header: {
    marginBottom: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 16,
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#4f8cff",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#e0e7ff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
    color: "#1e293b",
    marginBottom: 2,
  },
  details: {
    color: "#64748b",
    fontSize: 13,
  },
  time: {
    color: "#1e293b",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 12,
  },
  button: {
    backgroundColor: "#4f8cff",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#4f8cff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    shadowColor: "#4f8cff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#334155",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 16,
  },
  emptySubtext: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 4,
  },
});