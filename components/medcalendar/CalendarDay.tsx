// CalendarDay.tsx (versión mejorada)
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CalendarDayProps {
  date: string;
  hasPending: boolean;
  patientCount: number;
  medicationCount: number;
  onPress: () => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  hasPending,
  patientCount,
  medicationCount,
  onPress,
}) => {
  const dayNumber = date.split("-")[2];
  const isToday = () => {
    if (!date) return false;
    const today = new Date();
    const currentDate = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    return date === currentDate;
  };

  // Mostrar indicadores solo si hay medicamentos
  const showIndicators = medicationCount > 0;

  return (
    <TouchableOpacity
      style={[
        styles.dayContainer,
        hasPending && styles.pendingDay,
        isToday() && styles.todayDay,
        !date && styles.emptyDay,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!date}
    >
      {date ? (
        <>
          <Text style={[styles.dayText, hasPending && styles.pendingDayText]}>
            {dayNumber}
          </Text>

          {showIndicators && (
            <>
              {/* Indicador de pacientes */}
              <View style={styles.patientBadge}>
                <Text style={styles.patientBadgeText}>
                  {patientCount > 9 ? "9+" : patientCount}
                </Text>
              </View>

              {/* Indicador de medicamentos */}
              <View style={styles.medicationIndicator}>
                <Text style={styles.medicationIndicatorText}>
                  {medicationCount > 9 ? "9+" : medicationCount}
                </Text>
              </View>

              {/* Punto indicador de pendientes */}
              {hasPending && <View style={styles.pendingDot} />}
            </>
          )}
        </>
      ) : (
        <View style={styles.emptyDay} />
      )}
    </TouchableOpacity>
  );
};

// ... (los estilos se mantienen igual)
const styles = StyleSheet.create({
  dayContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
    position: "relative",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  emptyDay: {
    width: 40,
    height: 40,
    margin: 4,
  },
  pendingDay: {
    backgroundColor: "#dbeafe",
    borderColor: "#3b82f6",
  },
  todayDay: {
    borderColor: "#10b981",
    borderWidth: 2,
  },
  dayText: {
    fontSize: 16,
    color: "#334155",
    fontWeight: "600",
  },
  pendingDayText: {
    color: "#1e40af",
    fontWeight: "700",
  },
  patientBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  patientBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  medicationIndicator: {
    position: "absolute",
    bottom: 2,
    left: 2,
    backgroundColor: "#94a3b8",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  medicationIndicatorText: {
    color: "white",
    fontSize: 9,
    fontWeight: "bold",
  },
  pendingDot: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ef4444",
  },
});

export default CalendarDay;