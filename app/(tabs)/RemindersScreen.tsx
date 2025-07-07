import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { Ionicons } from "@expo/vector-icons";

const reminders = [
  { id: "1", name: "Paracetamol", time: "08:00 AM", dosage: "500mg", type: "pastilla" },
  { id: "2", name: "Ibuprofeno", time: "09:00 PM", dosage: "400mg", type: "cápsula" },
  { id: "3", name: "Jarabe para la tos", time: "02:00 PM", dosage: "10ml", type: "líquido" },
];

export default function RemindersScreen() {
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

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemLeft}>
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={item.type === 'líquido' ? "flask-outline" : item.type === 'cápsula' ? "ellipse-outline" : "medkit-outline"} 
                  size={24} 
                  color="#4f8cff" 
                />
              </View>
              <View style={styles.textContainer}>
                <ThemedText style={styles.name}>{item.name}</ThemedText>
                <ThemedText style={styles.details}>{item.dosage} • {item.type}</ThemedText>
              </View>
            </View>
            <View style={styles.itemRight}>
              <ThemedText style={styles.time}>{item.time}</ThemedText>
              <TouchableOpacity style={styles.button} activeOpacity={0.7}>
                <Ionicons name="pencil-outline" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color="#cbd5e1" />
            <ThemedText style={styles.emptyText}>No hay recordatorios</ThemedText>
            <ThemedText style={styles.emptySubtext}>Presiona el botón para agregar uno</ThemedText>
          </View>
        }
      />

      <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
        <Ionicons name="add" size={24} color="#fff" />
        <ThemedText style={styles.addButtonText}>
          Agregar Recordatorio
        </ThemedText>
      </TouchableOpacity>
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