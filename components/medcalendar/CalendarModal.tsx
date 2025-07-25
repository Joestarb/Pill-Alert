import { format } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MedicationHistoryItem } from "../../api/supabaseMedicalHistoric";

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
  items: MedicationHistoryItem[];
  onMarkTaken: (id: number) => void;
  date: string | null;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  visible,
  onClose,
  items,
  onMarkTaken,
  date,
}) => {
  // Agrupar medicamentos por paciente y ordenar por hora
  const groupByPatient = () => {
    const grouped: Record<string, MedicationHistoryItem[]> = {};

    items.forEach((item) => {
      if (!grouped[item.patient]) {
        grouped[item.patient] = [];
      }
      grouped[item.patient].push(item);
    });

    // Ordenar cada grupo de medicamentos por hora
    Object.keys(grouped).forEach((patient) => {
      grouped[patient].sort((a, b) => a.time.localeCompare(b.time));
    });

    return grouped;
  };

  const groupedItems = groupByPatient();
  const formattedDate = date
    ? format(new Date(date), "EEEE, d 'de' MMMM", { locale: es })
    : "";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Medicamentos programados</Text>
            <Text style={styles.subtitle}>
              {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
            </Text>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>
                {items.length}{" "}
                {items.length === 1 ? "medicamento" : "medicamentos"}
              </Text>
              <Text style={styles.summaryText}>
                {Object.keys(groupedItems).length}{" "}
                {Object.keys(groupedItems).length === 1
                  ? "paciente"
                  : "pacientes"}
              </Text>
            </View>
          </View>

          <ScrollView style={styles.scrollContainer}>
            {Object.entries(groupedItems).map(([patient, medications]) => (
              <View key={patient} style={styles.patientSection}>
                <Text style={styles.patientName}>{patient}</Text>

                {medications.map((med) => (
                  <View
                    key={`${med.id}-${med.time}`}
                    style={[
                      styles.medicationCard,
                      med.status === "Saltado" && styles.skippedCard,
                      med.status === "Pendiente" && styles.pendingCard,
                    ]}
                  >
                    <View style={styles.timeContainer}>
                      <Text style={styles.timeText}>{med.time}</Text>
                    </View>

                    <View style={styles.medicationInfo}>
                      <Text style={styles.medicationName}>{med.name}</Text>
                      <Text style={styles.medicationDetail}>
                        {med.dosage} • {med.via}
                      </Text>
                    </View>

                    <View style={styles.statusContainer}>
                      <View
                        style={[
                          styles.statusBadge,
                          med.status === "Tomado" && styles.takenStatus,
                          med.status === "Pendiente" && styles.pendingStatus,
                          med.status === "Saltado" && styles.skippedStatus,
                        ]}
                      >
                        <Text style={styles.statusText}>{med.status}</Text>
                      </View>

                      {med.status !== "Tomado" && (
                        <TouchableOpacity
                          style={styles.markButton}
                          onPress={() => onMarkTaken(med.id)}
                        >
                          <Text style={styles.markButtonText}>Marcar</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxWidth: 500,
    maxHeight: "80%",
    overflow: "hidden",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  summaryContainer: {
    flexDirection: "row",
    marginTop: 12,
    gap: 16,
  },
  summaryText: {
    fontSize: 14,
    color: "#475569",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  patientSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
  },
  medicationCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  pendingCard: {
    backgroundColor: "#fffbeb",
    borderColor: "#f59e0b",
  },
  skippedCard: {
    backgroundColor: "#fef2f2",
    borderColor: "#ef4444",
  },
  timeContainer: {
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginRight: 12,
    minWidth: 60,
    alignItems: "center",
  },
  timeText: {
    fontWeight: "bold",
    color: "#334155",
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontWeight: "600",
    fontSize: 16,
    color: "#1e293b",
    marginBottom: 2,
  },
  medicationDetail: {
    fontSize: 13,
    color: "#64748b",
  },
  statusContainer: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 6,
  },
  takenStatus: {
    backgroundColor: "#d1fae5",
  },
  pendingStatus: {
    backgroundColor: "#fef3c7",
  },
  skippedStatus: {
    backgroundColor: "#fee2e2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  markButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  markButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "#f1f5f9",
    padding: 14,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  closeButtonText: {
    color: "#3b82f6",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default CalendarModal;
