import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  fetchMedicationHistory,
  MedicationHistoryItem,
} from "../../api/supabaseMedicalHistoric";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { getSession } from "../../utils/session";
import { supabase } from "../../utils/supabase";

export default function MedicationHistoryScreen() {
  const [history, setHistory] = useState<MedicationHistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    setRefreshing(true);
    try {
      const session = await getSession();
      if (!session?.user_id) return;
      const result = await fetchMedicationHistory(session.user_id);
      setHistory(result);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "tomado":
        return styles.status_tomado;
      case "pendiente":
        return styles.status_pendiente;
      case "saltado":
        return styles.status_saltado;
      default:
        return {};
    }
  };

  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "tomado":
        return {
          color: "#10b981",
          bgColor: "#d1fae5",
          icon: "check-circle",
        };
      case "pendiente":
        return {
          color: "#f59e0b",
          bgColor: "#fef3c7",
          icon: "schedule",
        };
      case "saltado":
        return {
          color: "#ef4444",
          bgColor: "#fee2e2",
          icon: "cancel",
        };
      default:
        return {
          color: "#64748b",
          bgColor: "#f1f5f9",
          icon: "help",
        };
    }
  };

  const marcarComoTomado = async (consumoId: number) => {
    try {
      const fechaActual = new Date().toISOString();
      const { error } = await supabase
        .from("medication_consumed")
        .update({
          updated_at: fechaActual,
          status: "Tomado",
        })
        .eq("medication_consumed_id", consumoId);

      if (error) throw error;

      await load();
    } catch (error) {
      alert("No se pudo actualizar el estado del medicamento");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "PPP", { locale: es });
    } catch {
      return dateString;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Historial de Medicamentos
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {history.length > 0
            ? "Tus registros de medicamentos"
            : "No hay registros recientes"}
        </ThemedText>
        {/* Buscador */}
        <View style={{ marginTop: 16 }}>
          <View
            style={{
              backgroundColor: "#f1f5f9",
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 12,
            }}
          >
            <MaterialIcons name="search" size={22} color="#64748b" />
            <ThemedText
              style={{ color: "#64748b", fontSize: 16, marginRight: 8 }}
            >
              {" "}
            </ThemedText>
            <View style={{ flex: 1 }}>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Buscar medicamento..."
                placeholderTextColor="#64748b"
                style={{
                  backgroundColor: "transparent",
                  borderWidth: 0,
                  fontSize: 16,
                  color: "#1e293b",
                  paddingVertical: 10,
                  width: "100%",
                }}
              />
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={history.filter((item) => {
          const q = search.toLowerCase();
          return (
            item.name?.toLowerCase().includes(q) ||
            item.time?.toLowerCase().includes(q) ||
            formatDate(item.date)?.toLowerCase().includes(q) ||
            item.patient?.toLowerCase().includes(q)
          );
        })}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={load}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
          />
        }
        renderItem={({ item }) => {
          const statusConfig = getStatusConfig(item.status);
          return (
            <View style={[styles.item, getStatusStyle(item.status)]}>
              {/* ...existing code... */}
              <View style={styles.itemHeader}>
                <View style={styles.medicationInfo}>
                  <ThemedText style={styles.name}>{item.name}</ThemedText>
                  <View style={styles.detailsRow}>
                    <View
                      style={[
                        styles.dosage,
                        { backgroundColor: statusConfig.bgColor },
                      ]}
                    >
                      <MaterialIcons
                        name="medication"
                        size={16}
                        color={statusConfig.color}
                      />
                      <ThemedText
                        style={[
                          styles.dosageText,
                          { color: statusConfig.color },
                        ]}
                      >
                        {item.dosage}
                      </ThemedText>
                    </View>
                    <View
                      style={[
                        styles.via,
                        { backgroundColor: statusConfig.bgColor },
                      ]}
                    >
                      <MaterialIcons
                        name="alt-route"
                        size={16}
                        color={statusConfig.color}
                      />
                      <ThemedText
                        style={[styles.viaText, { color: statusConfig.color }]}
                      >
                        {item.via}
                      </ThemedText>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusConfig.bgColor },
                  ]}
                >
                  <MaterialIcons
                    name={statusConfig.icon as any}
                    size={16}
                    color={statusConfig.color}
                  />
                  <ThemedText
                    style={[styles.statusText, { color: statusConfig.color }]}
                  >
                    {item.status}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.itemFooter}>
                <View style={styles.timeInfo}>
                  <MaterialIcons name="access-time" size={16} color="#64748b" />
                  <ThemedText style={styles.timeText}>{item.time}</ThemedText>
                  <ThemedText style={styles.dateText}>
                    {formatDate(item.date)}
                  </ThemedText>
                </View>

                {item.status !== "Tomado" && item.id && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => marcarComoTomado(item.id)}
                  >
                    <MaterialIcons name="done" size={18} color="#fff" />
                    <ThemedText style={styles.actionButtonText}>
                      Marcar como tomado
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </View>

              {item.patient && (
                <View style={styles.patientInfo}>
                  <MaterialIcons name="person" size={16} color="#64748b" />
                  <ThemedText style={styles.patientText}>
                    {item.patient}
                  </ThemedText>
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="medication" size={48} color="#cbd5e1" />
            <ThemedText style={styles.emptyText}>
              No hay registros en tu historial
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Los medicamentos que tomes aparecerán aquí
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f8fafc",
  },
  header: {
    marginBottom: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  listContent: {
    paddingBottom: 24,
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 5,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  medicationInfo: {
    flex: 1,
  },
  name: {
    fontWeight: "700",
    fontSize: 18,
    color: "#1e293b",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    gap: 8,
  },
  dosage: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  dosageText: {
    fontWeight: "600",
    fontSize: 13,
  },
  via: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  viaText: {
    fontWeight: "600",
    fontSize: 13,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  statusText: {
    fontWeight: "600",
    fontSize: 13,
  },
  itemFooter: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  timeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 10,
  },
  dateText: {
    color: "#94a3b8",
    fontSize: 13,
  },
  patientInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  patientText: {
    color: "#64748b",
    fontSize: 14,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b981",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    width: "100%",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    color: "#cbd5e1",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
