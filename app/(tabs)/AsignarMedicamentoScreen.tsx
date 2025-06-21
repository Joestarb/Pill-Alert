import React, { useState, useEffect } from "react";
import UserCard from "../../components/UserCard";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { supabase } from "@/utils/supabase";

interface MedicamentoAsignado {
  id: number;
  nombre: string;
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

export default function AsignacionSimpleScreen(): JSX.Element {
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
    setModalVisible(true);
  };

  const cerrarModal = (): void => {
    setModalVisible(false);
    setUsuarioSeleccionado(null);
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

    try {
      const { error } = await supabase.from("medication_consumed").insert({
        fk_user_id: usuarioSeleccionado.id,
        fk_medication_id: medicamento.id,
        fk_schedule_id: 1,
      });

      if (error) {
        console.error("Error asignando medicamento:", error);
        Alert.alert("Error", "No se pudo asignar el medicamento");
        return;
      }

      const nuevoMedicamento: MedicamentoAsignado = {
        id: medicamento.id,
        nombre: medicamento.nombre,
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
      Alert.alert("Éxito", "Medicamento asignado correctamente");
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
        .eq("fk_user_id",usuarioId );

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

  const renderUsuario = ({ item }: { item: Usuario }) => (
    <UserCard
      nombre={item.nombre}
      medicamentos={item.medicamentos}
      onAsignar={() => abrirModal(item)}
      onEliminarMedicamento={(nombre) =>
        removerMedicamentoIndividual(item.id, nombre)
      }
      onEliminarTodos={() => removerTodosLosMedicamentos(item.id)}
      isSmallScreen={isSmallScreen}
      isLargeScreen={isLargeScreen}
    />
  );

  const renderMedicamento = (medicamento: Medicamento): JSX.Element => (
    <TouchableOpacity
      key={medicamento.id}
      style={styles.opcionMedicamento}
      onPress={() => asignarMedicamento(medicamento.nombre)}
    >
      <Text style={styles.textoMedicamento}>{medicamento.nombre}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <View style={styles.header}>
        <Text style={styles.titulo}>Asignación de Medicamentos</Text>
        <Text style={styles.subtitulo}>
          {usuarios.filter((u) => u.medicamentos.length > 0).length} de{" "}
          {usuarios.length} usuarios con medicamento
        </Text>
      </View>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUsuario}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaContainer}
        numColumns={isLargeScreen ? 2 : 1}
        columnWrapperStyle={isLargeScreen ? styles.columnWrapper : undefined}
        refreshing={loading}
        onRefresh={cargarDatos}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={cerrarModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxHeight: height * 0.8 }]}>
            <Text style={styles.modalTitulo}>Seleccionar medicamento para</Text>
            <Text style={styles.modalSubtitulo}>
              {usuarioSeleccionado?.nombre}
            </Text>

            <View style={styles.medicamentosContainer}>
              {medicamentosDisponibles.map(renderMedicamento)}
            </View>

            <TouchableOpacity
              style={styles.botonCancelar}
              onPress={cerrarModal}
            >
              <Text style={styles.textoBotonCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
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
  medicamentosContainer: { maxHeight: 300 },
  opcionMedicamento: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    borderRadius: 8,
    marginBottom: 4,
  },
  textoMedicamento: { fontSize: 16, textAlign: "center" },
  botonCancelar: {
    backgroundColor: "#6c757d",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  textoBotonCancelar: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
});
