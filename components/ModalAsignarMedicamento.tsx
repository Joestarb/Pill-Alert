import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import {
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";

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
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.modalTitulo}>Asignación de Medicamentos</Text>
              <Text style={styles.modalSubtitulo}>
                Seleccionar medicamento para {usuarioSeleccionado?.nombre}
              </Text>
            </View>

            {/* Sección de fecha y hora */}
            <View style={styles.seccion}>
              <Text style={styles.seccionTitulo}>Fecha y hora del medicamento:</Text>
              
              <View style={styles.fechaHoraContainer}>
                <TouchableOpacity
                  style={[
                    styles.fechaHoraBoton,
                    mostrarDatePicker && styles.botonActivo
                  ]}
                  onPress={mostrarDatePickerFecha}
                >
                  <Text style={styles.fechaHoraTexto}>
                    {formatearFecha(fechaHora)}
                  </Text>
                  <Text style={styles.fechaHoraSubtexto}>Cambiar fecha</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.fechaHoraBoton,
                    mostrarTimePicker && styles.botonActivo
                  ]}
                  onPress={mostrarDatePickerHora}
                >
                  <Text style={styles.fechaHoraTexto}>
                    {formatearHora(fechaHora)}
                  </Text>
                  <Text style={styles.fechaHoraSubtexto}>Cambiar hora</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.resumenFechaHora}>
                <Text style={styles.resumenTexto}>
                  Programado para: {formatearFecha(fechaHora)}, {formatearHora(fechaHora)}
                </Text>
              </View>
            </View>

            {/* Sección de miligramos */}
            <View style={styles.seccion}>
              <Text style={styles.seccionTitulo}>Miligramos:</Text>
              <View style={styles.miligramosContainer}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={miligramos}
                  onChangeText={setMiligramos}
                  placeholder="Ej: 500"
                  placeholderTextColor="#999"
                />
                <Text style={styles.mgText}>mg</Text>
              </View>
            </View>

            {/* Sección de vía de administración */}
            <View style={styles.seccion}>
              <Text style={styles.seccionTitulo}>Vía de administración:</Text>
              <View style={styles.viasContainer}>
                {["Oral", "Intravenosa", "Supositorio", "Unguento"].map((opcion) => (
                  <TouchableOpacity
                    key={opcion}
                    style={[
                      styles.viaBoton,
                      via.toLowerCase() === opcion.toLowerCase() && styles.viaBotonActivo
                    ]}
                    onPress={() => setVia(opcion.toLowerCase())}
                  >
                    <Text style={[
                      styles.viaTexto,
                      via.toLowerCase() === opcion.toLowerCase() && styles.viaTextoActivo
                    ]}>
                      {opcion}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sección de medicamentos */}
            <View style={styles.seccion}>
              <Text style={styles.seccionTitulo}>Selecciona un medicamento:</Text>
              <View style={styles.medicamentosLista}>
                {medicamentosDisponibles.map(renderMedicamento)}
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

            {Platform.OS === "ios" && (mostrarDatePicker || mostrarTimePicker) && (
              <TouchableOpacity
                style={styles.botonConfirmarPicker}
                onPress={cerrarDatePickers}
              >
                <Text style={styles.botonConfirmarTexto}>Confirmar</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.botonCancelar}
            onPress={onRequestClose}
          >
            <Text style={styles.botonCancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

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
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  modalSubtitulo: {
    fontSize: 16,
    color: "#3498db",
    fontWeight: "500",
  },
  seccion: {
    marginBottom: 20,
  },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 12,
  },
  fechaHoraContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  fechaHoraBoton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  botonActivo: {
    borderColor: "#3498db",
    backgroundColor: "#e3f2fd",
  },
  fechaHoraTexto: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2c3e50",
  },
  fechaHoraSubtexto: {
    fontSize: 12,
    color: "#3498db",
    marginTop: 4,
  },
  resumenFechaHora: {
    padding: 10,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#3498db",
  },
  resumenTexto: {
    fontSize: 14,
    color: "#2980b9",
    fontWeight: "500",
  },
  miligramosContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#2c3e50",
    backgroundColor: "#fff",
  },
  mgText: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  viasContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  viaBoton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#f8f9fa",
  },
  viaBotonActivo: {
    backgroundColor: "#3498db",
    borderColor: "#3498db",
  },
  viaTexto: {
    fontSize: 14,
    color: "#2c3e50",
    fontWeight: "500",
  },
  viaTextoActivo: {
    color: "#fff",
  },
  medicamentosLista: {
    gap: 8,
  },
  opcionMedicamento: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#f8f9fa",
  },
  textoMedicamento: {
    fontSize: 16,
    textAlign: "center",
    color: "#2c3e50",
    fontWeight: "500",
  },
  botonConfirmarPicker: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  botonConfirmarTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  botonCancelar: {
    backgroundColor: "#e74c3c",
    padding: 14,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  botonCancelarTexto: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
});

export default ModalAsignarMedicamento;