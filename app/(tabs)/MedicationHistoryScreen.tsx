import { FlatList, StyleSheet, View } from "react-native";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";

const history = [
  { id: "1", name: "Paracetamol", date: "20/06/2025", time: "08:00 AM", dosage: "500mg", status: "Tomado" },
  { id: "2", name: "Ibuprofeno", date: "19/06/2025", time: "09:00 PM", dosage: "400mg", status: "Pendiente" },
  { id: "3", name: "Amoxicilina", date: "18/06/2025", time: "07:00 AM", dosage: "250mg", status: "Saltado" },
  { id: "4", name: "Omeprazol", date: "17/06/2025", time: "08:00 AM", dosage: "20mg", status: "Tomado" },
  { id: "5", name: "Loratadina", date: "16/06/2025", time: "07:30 PM", dosage: "10mg", status: "Tomado" },
];

export default function MedicationHistoryScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Historial de Medicamentos
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Últimos 30 días
        </ThemedText>
      </View>
      
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.item, styles[`status_${item.status.toLowerCase()}`]]}>
            <View style={styles.itemHeader}>
              <ThemedText style={styles.name}>{item.name}</ThemedText>
              <ThemedText style={styles.dosage}>{item.dosage}</ThemedText>
            </View>
            <View style={styles.itemFooter}>
              <ThemedText style={styles.date}>
                {item.date} • {item.time}
              </ThemedText>
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