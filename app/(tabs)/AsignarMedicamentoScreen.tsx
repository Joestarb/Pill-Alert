import { supabase } from "@/utils/supabase";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Header from "../../components/asignarmeds/Header";
import Loading from "../../components/asignarmeds/Loading";
import ModalAsignar from "../../components/asignarmeds/ModalAsignar";
import UsuariosList from "../../components/asignarmeds/UsuariosList";

interface MedicamentoAsignado {
  id: number;
  nombre: string;
  fecha?: string;
}

interface Usuario {
  id: number;
  nombre: string;
  medicamentos: MedicamentoAsignado[];
}

interface Medicamento {
  id: number;
  nombre: string;
}

export default function AsignacionSimpleScreen() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [medicamentosDisponibles, setMedicamentosDisponibles] = useState<
    Medicamento[]
  >([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<Usuario | null>(null);
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [miligramos, setMiligramos] = useState<string>("");
  const [via, setVia] = useState<string>("oral");
  const [fechaHora, setFechaHora] = useState<Date>(new Date()); // Inicializar con fecha actual
  const [mostrarDatePicker, setMostrarDatePicker] = useState<boolean>(false);
  const [mostrarTimePicker, setMostrarTimePicker] = useState<boolean>(false);
  // NUEVOS CAMPOS PARA INTERVALOS
  const [intervaloHoras, setIntervaloHoras] = useState<number>(24); // default 24h
  const [cantidadDias, setCantidadDias] = useState<number>(1); // default 1 día

  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 360;
  const isLargeScreen = width > 400;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    await Promise.all([obtenerPacientes(), obtenerMedicamentos()]);
    setLoading(false);
  };

  const obtenerPacientes = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select(
          `
          user_id,
          user_name,
          medication_consumed (
            medication_consumed_id,
            fk_medication_id,
            medications (
              medications_id,
              medications
            )
          )
        `
        )
        .eq("fk_role_id", 2)
        .order("user_name");

      if (error) {
        console.error("Error obteniendo pacientes:", error);
        return;
      }

      const usuariosFormateados: Usuario[] = data.map((user) => ({
        id: user.user_id,
        nombre: user.user_name,
        medicamentos:
          user.medication_consumed?.map((mc) => ({
            id: mc.fk_medication_id,
            nombre: mc.medications?.medications || "Desconocido",
            consumoId: mc.medication_consumed_id,
          })) || [],
      }));

      setUsuarios(usuariosFormateados);
    } catch (error) {
      console.error("Error obteniendo pacientes:", error);
      Alert.alert("Error", "No se pudieron cargar los pacientes");
    }
  };

  const obtenerMedicamentos = async () => {
    try {
      const { data, error } = await supabase
        .from("medications")
        .select("medications_id, medications")
        .order("medications");

      if (error) {
        console.error("Error obteniendo medicamentos:", error);
        return;
      }

      const medicamentosFormateados = data.map((med) => ({
        id: med.medications_id,
        nombre: med.medications,
      }));

      setMedicamentosDisponibles(medicamentosFormateados);
    } catch (error) {
      console.error("Error obteniendo medicamentos:", error);
      Alert.alert("Error", "No se pudieron cargar los medicamentos");
    }
  };

  const abrirModal = (usuario: Usuario): void => {
    setUsuarioSeleccionado(usuario);
    setFechaHora(new Date()); // Reinicia con la fecha actual
    setMiligramos("");
    setVia("oral");
    setIntervaloHoras(24);
    setCantidadDias(1);
    setModalVisible(true);
  };

  const cerrarModal = (): void => {
    setModalVisible(false);
    setUsuarioSeleccionado(null);
    cerrarDatePickers(); // Usar la nueva función
    setMiligramos("");
    setVia("oral");
    setIntervaloHoras(24);
    setCantidadDias(1);
  };

  const onFechaChange = (event: any, selectedDate?: Date) => {
    // Solo cerrar en Android cuando se selecciona una fecha/hora o se cancela
    const { type } = event;

    if (Platform.OS === "android") {
      // En Android, cerrar solo si se confirma o cancela
      if (type === "set" || type === "dismissed") {
        setMostrarDatePicker(false);
        setMostrarTimePicker(false);
      }
    }

    // Actualizar la fecha solo si se seleccionó una
    if (selectedDate && type === "set") {
      setFechaHora(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    const { type } = event;

    if (Platform.OS === "android") {
      if (type === "set" || type === "dismissed") {
        setMostrarTimePicker(false);
      }
    }

    if (selectedTime && type === "set") {
      // Mantener la fecha actual y solo cambiar la hora
      const nuevaFecha = new Date(fechaHora);
      nuevaFecha.setHours(selectedTime.getHours());
      nuevaFecha.setMinutes(selectedTime.getMinutes());
      setFechaHora(nuevaFecha);
    }
  };

  const mostrarDatePickerFecha = () => {
    setMostrarDatePicker(true);
    setMostrarTimePicker(false); // Asegurar que solo uno esté abierto
  };

  const mostrarDatePickerHora = () => {
    setMostrarTimePicker(true);
    setMostrarDatePicker(false); // Asegurar que solo uno esté abierto
  };

  const cerrarDatePickers = () => {
    setMostrarDatePicker(false);
    setMostrarTimePicker(false);
  };

  const formatearFecha = (fecha: Date): string => {
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatearHora = (fecha: Date): string => {
    return fecha.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const asignarMedicamento = async (
    medicamentoNombre: string
  ): Promise<void> => {
    if (!usuarioSeleccionado) return;

    const medicamento = medicamentosDisponibles.find(
      (m) => m.nombre === medicamentoNombre
    );
    if (!medicamento) {
      Alert.alert("Error", "Medicamento no encontrado");
      return;
    }

    if (!miligramos || isNaN(Number(miligramos))) {
      Alert.alert("Error", "Por favor ingresa los miligramos correctamente.");
      return;
    }
    if (!intervaloHoras || ![4, 8, 12, 24, 48].includes(intervaloHoras)) {
      Alert.alert(
        "Error",
        "Selecciona un intervalo válido (4, 8, 12, 24, 48 horas)"
      );
      return;
    }
    if (!cantidadDias || cantidadDias < 1) {
      Alert.alert("Error", "Selecciona una cantidad de días válida");
      return;
    }

    try {
      // Generar todas las fechas de toma
      const registros: any[] = [];
      const fechas: string[] = [];
      for (let dia = 0; dia < cantidadDias; dia++) {
        for (let h = 0; h < 24; h += intervaloHoras) {
          const nuevaFecha = new Date(fechaHora);
          nuevaFecha.setDate(fechaHora.getDate() + dia);
          nuevaFecha.setHours(fechaHora.getHours() + h);
          // Si se pasa de las 24h, sumar al día siguiente
          if (nuevaFecha.getHours() >= 24) {
            nuevaFecha.setDate(
              nuevaFecha.getDate() + Math.floor(nuevaFecha.getHours() / 24)
            );
            nuevaFecha.setHours(nuevaFecha.getHours() % 24);
          }
          fechas.push(nuevaFecha.toISOString());
        }
      }

      // Verificar si ya existen registros para alguna de esas fechas
      const { data: existentes, error: errorExistentes } = await supabase
        .from("medication_consumed")
        .select("date_medication")
        .eq("fk_user_id", usuarioSeleccionado.id)
        .eq("fk_medication_id", medicamento.id)
        .eq("fk_schedule_id", 1)
        .in("date_medication", fechas);

      if (errorExistentes) {
        console.error("Error verificando duplicados:", errorExistentes);
        Alert.alert("Error", "No se pudo verificar duplicados");
        return;
      }
      const fechasExistentes = (existentes || []).map((e) => e.date_medication);
      const fechasAInsertar = fechas.filter(
        (f) => !fechasExistentes.includes(f)
      );
      if (fechasAInsertar.length === 0) {
        Alert.alert(
          "Error",
          "Ya existen todos los registros para este intervalo"
        );
        return;
      }

      for (const fecha of fechasAInsertar) {
        registros.push({
          fk_user_id: usuarioSeleccionado.id,
          fk_medication_id: medicamento.id,
          fk_schedule_id: 1,
          date_medication: fecha,
          miligrams: Number(miligramos),
          via,
        });
      }

      const { error } = await supabase
        .from("medication_consumed")
        .insert(registros);

      if (error) {
        console.error("Error asignando medicamento:", error);
        Alert.alert("Error", "No se pudo asignar el medicamento");
        return;
      }

      // Actualizar el estado local solo con la primera toma (opcional: podrías mostrar todas)
      const nuevoMedicamento: MedicamentoAsignado = {
        id: medicamento.id,
        nombre: medicamento.nombre,
        fecha: fechasAInsertar[0],
      };

      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id === usuarioSeleccionado.id
            ? {
                ...usuario,
                medicamentos: [...usuario.medicamentos, nuevoMedicamento],
              }
            : usuario
        )
      );

      setMedicamentoSeleccionado(null);
      cerrarModal();
      Alert.alert(
        "Éxito",
        `Medicamento asignado correctamente (${fechasAInsertar.length} tomas)`
      );
    } catch (error) {
      console.error("Error asignando medicamento:", error);
      Alert.alert("Error", "No se pudo asignar el medicamento");
    }
  };

  const removerMedicamentoIndividual = async (
    usuarioId: number,
    medicamentoId: number
  ) => {
    try {
      const usuario = usuarios.find((u) => u.id === usuarioId);
      const medicamento = usuario?.medicamentos.find(
        (m) => m.id === medicamentoId
      );
      if (!medicamento) return;

      const { error } = await supabase
        .from("medication_consumed")
        .delete()
        .eq("fk_medication_id", medicamento.id)
        .eq("fk_user_id", usuarioId);

      if (error) {
        console.error("Error eliminando medicamento:", error);
        Alert.alert("Error", "No se pudo eliminar el medicamento");
        return;
      }

      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id === usuarioId
            ? {
                ...usuario,
                medicamentos: usuario.medicamentos.filter(
                  (m) => m.id !== medicamentoId
                ),
              }
            : usuario
        )
      );

      Alert.alert("Éxito", "Medicamento eliminado correctamente");
    } catch (error) {
      console.error("Error eliminando medicamento:", error);
      Alert.alert("Error", "No se pudo eliminar el medicamento");
    }
  };

  const removerTodosLosMedicamentos = async (usuarioId: number) => {
    try {
      const { error } = await supabase
        .from("medication_consumed")
        .delete()
        .eq("fk_user_id", usuarioId);

      if (error) {
        console.error("Error eliminando todos los medicamentos:", error);
        Alert.alert("Error", "No se pudieron eliminar los medicamentos");
        return;
      }

      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id === usuarioId ? { ...usuario, medicamentos: [] } : usuario
        )
      );

      Alert.alert("Éxito", "Todos los medicamentos eliminados correctamente");
    } catch (error) {
      console.error("Error eliminando todos los medicamentos:", error);
      Alert.alert("Error", "No se pudieron eliminar los medicamentos");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <Header
        usuariosConMedicamento={
          usuarios.filter((u) => u.medicamentos.length > 0).length
        }
        totalUsuarios={usuarios.length}
      />
      <UsuariosList
        usuarios={usuarios}
        isSmallScreen={isSmallScreen}
        isLargeScreen={isLargeScreen}
        onAsignar={abrirModal}
        onEliminarMedicamento={removerMedicamentoIndividual}
        onEliminarTodos={removerTodosLosMedicamentos}
        loading={loading}
        cargarDatos={cargarDatos}
      />
      <ModalAsignar
        visible={modalVisible}
        usuarioSeleccionado={usuarioSeleccionado}
        fechaHora={fechaHora}
        mostrarDatePicker={mostrarDatePicker}
        mostrarTimePicker={mostrarTimePicker}
        medicamentosDisponibles={medicamentosDisponibles}
        onRequestClose={cerrarModal}
        onFechaChange={onFechaChange}
        onTimeChange={onTimeChange}
        mostrarDatePickerFecha={mostrarDatePickerFecha}
        mostrarDatePickerHora={mostrarDatePickerHora}
        cerrarDatePickers={cerrarDatePickers}
        formatearFecha={formatearFecha}
        formatearHora={formatearHora}
        asignarMedicamento={asignarMedicamento}
        miligramos={miligramos}
        setMiligramos={setMiligramos}
        via={via}
        setVia={setVia}
        intervaloHoras={intervaloHoras}
        setIntervaloHoras={setIntervaloHoras}
        cantidadDias={cantidadDias}
        setCantidadDias={setCantidadDias}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#6c757d" },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  titulo: { fontSize: 24, fontWeight: "bold", color: "#212529" },
  subtitulo: { fontSize: 14, color: "#6c757d", marginTop: 4 },
  listaContainer: { padding: 16 },
  columnWrapper: { justifyContent: "space-between", gap: 12 },
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
    backgroundColor: "#6c757d",
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
