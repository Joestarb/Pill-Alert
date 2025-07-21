import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text, Button } from "react-native"; // ← importa Button
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { fetchMedicationHistory, MedicationHistoryItem } from "../../api/supabaseMedicalHistoric";
import { getSession } from "../../utils/session";

export default function MedicationHistoryScreen() {
  const [history, setHistory] = useState<MedicationHistoryItem[]>([]);

  const load = async () => {
    const session = await getSession();
    if (!session?.user_id) return;
    const result = await fetchMedicationHistory(session.user_id);
    setHistory(result);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Historial de Medicamentos
        </ThemedText>
        <ThemedText style={styles.subtitle}>Últimos 30 días</ThemedText>
        <View style={styles.buttonContainer}>
          <Button title="Actualizar" onPress={load} color="#3b82f6" />
        </View>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.item, styles[`status_${item.status.toLowerCase()}`]]}>
            <View style={styles.itemHeader}>
              <ThemedText style={styles.name}>{item.name}</ThemedText>
              <ThemedText style={styles.dosage}>{item.dosage}</ThemedText>
            </View>
            <View style={styles.itemFooter}>
              <View>
                <ThemedText style={styles.date}>
                  {item.date} • {item.time}
                </ThemedText>
                <Text style={{ fontSize: 14, color: "#64748b" }}>
                  Paciente: <Text style={{ fontWeight: "600" }}>{item.patient}</Text>
                </Text>
              </View>
              <ThemedText style={[styles.status, styles[`statusText_${item.status.toLowerCase()}`]]}>
                {item.status}
              </ThemedText>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No hay registros en tu historial</ThemedText>
          </View>
        }
      />
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
  buttonContainer: {
    marginTop: 12,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 24,
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontWeight: "600",
    fontSize: 18,
    color: "#1e293b",
  },
  dosage: {
    fontWeight: "500",
    fontSize: 14,
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  date: {
    color: "#64748b",
    fontSize: 14,
  },
  status: {
    fontWeight: "600",
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  status_tomado: {
    borderLeftColor: "#10b981",
  },
  status_pendiente: {
    borderLeftColor: "#f59e0b",
  },
  status_saltado: {
    borderLeftColor: "#ef4444",
  },
  statusText_tomado: {
    color: "#10b981",
    backgroundColor: "#d1fae5",
  },
  statusText_pendiente: {
    color: "#f59e0b",
    backgroundColor: "#fef3c7",
  },
  statusText_saltado: {
    color: "#ef4444",
    backgroundColor: "#fee2e2",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 16,
  },
});
