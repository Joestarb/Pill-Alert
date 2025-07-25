import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  fetchMedicationCalendar,
  MedicationCalendarDay,
} from "../../api/supabaseMedicationCalendar";
import { getSession } from "../../utils/session";
import { supabase } from "../../utils/supabase";
import CalendarGrid from "./CalendarGrid";
import CalendarModal from "./CalendarModal";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  titleText: {
    fontSize: 18,
    color: "#1976d2",
    fontWeight: "bold",
    marginBottom: 4,
  },
  patientCountText: {
    fontSize: 14,
    color: "#4b5563",
    fontStyle: "italic",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const CalendarMain: React.FC = () => {
  const [calendar, setCalendar] = useState<MedicationCalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalPatients, setTotalPatients] = useState(0);

  const loadCalendar = async () => {
    try {
      setLoading(true);
      const session = await getSession();
      if (!session?.user_id) return;

      const result = await fetchMedicationCalendar(session.user_id);
      setCalendar(result);

      // Calcular pacientes únicos con medicamentos este mes
      const uniquePatients = new Set(
        result.flatMap(day => day.items.map(item => item.patient))
      );
      setTotalPatients(uniquePatients.size);
      
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar el calendario de medicamentos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendar();
  }, []);

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedDate(null);
  };

  const handleMarkTaken = async (id: number) => {
    try {
      const fechaActual = new Date().toISOString();
      const { error } = await supabase
        .from("medication_consumed")
        .update({ 
          status: "Tomado",
          updated_at: fechaActual 
        })
        .eq("medication_consumed_id", id);

      if (error) throw error;

      await loadCalendar();
      Alert.alert("Éxito", "Medicamento marcado como tomado");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado del medicamento");
      console.error(error);
    }
  };

  // Generar días del mes actual con información completa
// En la función generateCalendarDays() de CalendarMain.tsx
const generateCalendarDays = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const days: {
    date: string;
    hasPending: boolean;
    patientCount: number;
    medicationCount: number;
  }[] = [];

  // Rellenar días vacíos al inicio del mes
  const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push({
      date: "",
      hasPending: false,
      patientCount: 0,
      medicationCount: 0,
    });
  }

  // Generar días del mes
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${d
      .toString()
      .padStart(2, "0")}`;
    
    const dayData = calendar.find((c) => c.date === dateStr);
    
    // Calcular pacientes únicos para este día
    const patients = dayData 
      ? new Set(dayData.items.map(item => item.patient))
      : new Set();
    
    // Verificar si hay medicamentos pendientes o saltados
    const hasPending = dayData
      ? dayData.items.some(
          (item) => item.status === "Saltado" || item.status === "Pendiente"
        )
      : false;

    days.push({
      date: dateStr,
      hasPending,
      patientCount: patients.size,
      medicationCount: dayData ? dayData.items.length : 0,
    });
  }

  return days;
};

  // Obtener items ordenados por hora para el día seleccionado
  const getSortedItemsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    const dayData = calendar.find((c) => c.date === selectedDate);
    if (!dayData) return [];
    
    return [...dayData.items].sort((a, b) => {
      // Ordenar por hora (formato HH:MM)
      return a.time.localeCompare(b.time);
    });
  };

  const calendarDays = generateCalendarDays();
  const hasMedicationsThisMonth = calendar.some(day => day.items.length > 0);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.titleText}>
            {hasMedicationsThisMonth
              ? "Calendario de Medicamentos"
              : "No hay medicamentos este mes"}
          </Text>
          {hasMedicationsThisMonth && (
            <Text style={styles.patientCountText}>
              {totalPatients} {totalPatients === 1 ? 'paciente' : 'pacientes'} con medicamentos
            </Text>
          )}
        </View>
        <Button 
          title="Actualizar" 
          onPress={loadCalendar} 
          color="#3b82f6" 
          disabled={loading}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={{ marginTop: 8 }}>Cargando calendario...</Text>
        </View>
      ) : (
        <CalendarGrid
          days={calendarDays}
          onDayPress={(date) => date && handleDayPress(date)}
        />
      )}

      <CalendarModal
        visible={modalVisible}
        onClose={handleCloseModal}
        items={getSortedItemsForSelectedDate()}
        onMarkTaken={handleMarkTaken}
        date={selectedDate}
      />
    </View>
  );
};

export default CalendarMain;