import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {  ScrollView } from 'react-native';
interface Medicamento {
  id: number;
  nombre: string;
}

interface ModalAsignarMedicamentoProps {
  visible: boolean;
  usuarioSeleccionado: { nombre: string } | null;
  fechaHora: Date;
  mostrarDatePicker: boolean;
  mostrarTimePicker: boolean;
  medicamentosDisponibles: Medicamento[];
  onRequestClose: () => void;
  onFechaChange: (event: any, selectedDate?: Date) => void;
  onTimeChange: (event: any, selectedTime?: Date) => void;
  mostrarDatePickerFecha: () => void;
  mostrarDatePickerHora: () => void;
  cerrarDatePickers: () => void;
  formatearFecha: (fecha: Date) => string;
  formatearHora: (fecha: Date) => string;
  asignarMedicamento: (nombre: string) => void;
  miligramos: string;
  setMiligramos: (v: string) => void;
  via: string;
  setVia: (v: string) => void;
}

const ModalAsignarMedicamento: React.FC<ModalAsignarMedicamentoProps> = ({
  visible,
  usuarioSeleccionado,
  fechaHora,
  mostrarDatePicker,
  mostrarTimePicker,
  medicamentosDisponibles,
  onRequestClose,
  onFechaChange,
  onTimeChange,
  mostrarDatePickerFecha,
  mostrarDatePickerHora,
  cerrarDatePickers,
  formatearFecha,
  formatearHora,
  asignarMedicamento,
  miligramos,
  setMiligramos,
  via,
  setVia,
}) => {
  const { height } = useWindowDimensions();

  const renderMedicamento = (medicamento: Medicamento) => (
    <TouchableOpacity
      key={medicamento.id}
      style={styles.opcionMedicamento}
      onPress={() => asignarMedicamento(medicamento.nombre)}
    >
      <Text style={styles.textoMedicamento}>{medicamento.nombre}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { maxHeight: height * 0.8 }]}>
          <Text style={styles.modalTitulo}>Seleccionar medicamento para</Text>
          <Text style={styles.modalSubtitulo}>
            {usuarioSeleccionado?.nombre}
          </Text>

          {/* Sección de fecha y hora */}
          <View style={styles.fechaHoraSection}>
            <Text style={styles.fechaHoraLabel}>
              Fecha y hora del medicamento:
            </Text>
            <View style={styles.fechaHoraContainer}>
              <TouchableOpacity
                style={[
                  styles.fechaHoraPicker,
                  mostrarDatePicker && styles.fechaHoraPickerActive,
                ]}
                onPress={mostrarDatePickerFecha}
              >
                <Text style={styles.fechaHoraTexto}>
                  📅 {formatearFecha(fechaHora)}
                </Text>
                <Text style={styles.fechaHoraSubTexto}>Cambiar fecha</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.fechaHoraPicker,
                  mostrarTimePicker && styles.fechaHoraPickerActive,
                ]}
                onPress={mostrarDatePickerHora}
              >
                <Text style={styles.fechaHoraTexto}>
                  🕐 {formatearHora(fechaHora)}
                </Text>
                <Text style={styles.fechaHoraSubTexto}>Cambiar hora</Text>
              </TouchableOpacity>
            </View>
            {Platform.OS === "ios" &&
              (mostrarDatePicker || mostrarTimePicker) && (
                <TouchableOpacity
                  style={styles.botonCerrarPicker}
                  onPress={cerrarDatePickers}
                >
                  <Text style={styles.textoCerrarPicker}>✓ Confirmar</Text>
                </TouchableOpacity>
              )}
            <View style={styles.fechaHoraResumen}>
              <Text style={styles.fechaHoraResumenTexto}>
                Programado para: {fechaHora.toLocaleString("es-ES")}
              </Text>
            </View>
          </View>

          {/* Campo de miligramos y selección de vía */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{ fontWeight: "600", color: "#495057", marginBottom: 6 }}
            >
              Miligramos:
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <TextInput
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#dee2e6",
                  borderRadius: 8,
                  backgroundColor: "#fff",
                  paddingHorizontal: 10,
                  fontSize: 16,
                  color: "#495057",
                  paddingVertical: 8,
                }}
                keyboardType="numeric"
                value={miligramos}
                onChangeText={setMiligramos}
                placeholder="Ej: 500"
                placeholderTextColor="#adb5bd"
              />
              <Text style={{ fontSize: 16, color: "#495057", marginLeft: 8 }}>
                mg
              </Text>
            </View>
            <Text
              style={{
                fontWeight: "600",
                color: "#495057",
                marginTop: 12,
                marginBottom: 6,
              }}
            >
              Vía de administración:
            </Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              {["oral", "intravenosa", "supositorio", "unguento"].map(
                (opcion) => (
                  <TouchableOpacity
                    key={opcion}
                    style={{
                      backgroundColor: via === opcion ? "#007bff" : "#f8f9fa",
                      borderColor: via === opcion ? "#007bff" : "#dee2e6",
                      borderWidth: 1,
                      borderRadius: 8,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      marginRight: 6,
                      marginBottom: 6,
                    }}
                    onPress={() => setVia(opcion)}
                  >
                    <Text
                      style={{
                        color: via === opcion ? "#fff" : "#495057",
                        fontWeight: "500",
                      }}
                    >
                      {opcion.charAt(0).toUpperCase() + opcion.slice(1)}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>

          {/* DateTimePickers */}
          {mostrarDatePicker && (
            <DateTimePicker
              value={fechaHora}
              mode="date"
              display={Platform.OS === "ios" ? "compact" : "default"}
              onChange={onFechaChange}
              minimumDate={new Date()}
              locale="es-ES"
            />
          )}
          {mostrarTimePicker && (
            <DateTimePicker
              value={fechaHora}
              mode="time"
              display={Platform.OS === "ios" ? "compact" : "default"}
              onChange={onTimeChange}
              locale="es-ES"
            />
          )}

          <View style={styles.medicamentosContainer}>
            <Text style={styles.medicamentosLabel}>
              Selecciona un medicamento:
            </Text>
            <View style={{ flex: 1, maxHeight: 220 }}>
              <View
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 16 }}
                showsVerticalScrollIndicator={false}
              >
                {medicamentosDisponibles.map(renderMedicamento)}
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.botonCancelar}
            onPress={onRequestClose}
          >
            <Text style={styles.textoBotonCancelar}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Puedes importar los estilos desde el archivo principal o copiarlos aquí si lo prefieres
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    alignSelf: "center",
    width: "90%",
    maxWidth: 380,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    textAlign: "center",
  },
  modalSubtitulo: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
  },
  fechaHoraSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  fechaHoraLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 12,
    textAlign: "center",
  },
  fechaHoraContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  fechaHoraPicker: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dee2e6",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  fechaHoraPickerActive: {
    borderColor: "#007bff",
    borderWidth: 2,
    backgroundColor: "#f0f8ff",
  },
  fechaHoraTexto: {
    fontSize: 14,
    fontWeight: "500",
    color: "#495057",
  },
  fechaHoraSubTexto: {
    fontSize: 11,
    color: "#007bff",
    marginTop: 2,
  },
  botonCerrarPicker: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: "center",
    marginTop: 10,
  },
  textoCerrarPicker: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  fechaHoraResumen: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "#e7f3ff",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#007bff",
  },
  fechaHoraResumenTexto: {
    fontSize: 14,
    color: "#0056b3",
    fontWeight: "500",
    textAlign: "center",
  },
  medicamentosContainer: {
    maxHeight: 300,
    marginBottom: 15,
  },
  medicamentosLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 12,
    textAlign: "center",
  },
  opcionMedicamento: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },

  textoMedicamento: {
    fontSize: 16,
    textAlign: "center",
    color: "#495057",
    fontWeight: "500",
  },
  botonCancelar: {
    backgroundColor: "#f60707ff",
    shadowColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  textoBotonCancelar: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
});

export default ModalAsignarMedicamento;
