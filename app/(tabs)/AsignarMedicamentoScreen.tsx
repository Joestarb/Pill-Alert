import React, { useState } from "react";
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
} from "react-native";

interface MedicamentoAsignado {
  nombre: string;
}

interface Usuario {
  id: number;
  nombre: string;
  medicamentos: MedicamentoAsignado[];
}

const medicamentosDisponibles: string[] = [
  "Paracetamol",
  "Ibuprofeno",
  "Amoxicilina",
  "Omeprazol",
  "Aspirina",
  "Loratadina",
];

const usuariosIniciales: Usuario[] = [
  { id: 1, nombre: "Carlos Pérez", medicamentos: [] },
  { id: 2, nombre: "Ana García", medicamentos: [] },
  { id: 3, nombre: "Luis Gómez", medicamentos: [] },
  { id: 4, nombre: "María López", medicamentos: [] },
  { id: 5, nombre: "Roberto Silva", medicamentos: [] },
];

export default function AsignacionSimpleScreen(): JSX.Element {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciales);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState<string | null>(null);

  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 360;
  const isLargeScreen = width > 400;

  const abrirModal = (usuario: Usuario): void => {
    setUsuarioSeleccionado(usuario);
    setModalVisible(true);
  };

  const cerrarModal = (): void => {
    setModalVisible(false);
    setUsuarioSeleccionado(null);
  };

  const asignarMedicamento = (medicamento: string): void => {
    if (!usuarioSeleccionado) return;

    const nuevoMedicamento: MedicamentoAsignado = { nombre: medicamento };

    setUsuarios(prevUsuarios =>
      prevUsuarios.map(usuario =>
        usuario.id === usuarioSeleccionado.id
          ? { ...usuario, medicamentos: [...usuario.medicamentos, nuevoMedicamento] }
          : usuario
      )
    );

    setMedicamentoSeleccionado(null);
    cerrarModal();
  };

  const removerMedicamentoIndividual = (usuarioId: number, nombre: string) => {
    setUsuarios(prev =>
      prev.map(usuario =>
        usuario.id === usuarioId
          ? {
              ...usuario,
              medicamentos: usuario.medicamentos.filter(m => m.nombre !== nombre),
            }
          : usuario
      )
    );
  };

  const removerTodosLosMedicamentos = (usuarioId: number) => {
    setUsuarios(prev =>
      prev.map(usuario =>
        usuario.id === usuarioId ? { ...usuario, medicamentos: [] } : usuario
      )
    );
  };

  const renderUsuario = ({ item }: { item: Usuario }) => (
    <UserCard
      nombre={item.nombre}
      medicamentos={item.medicamentos}
      onAsignar={() => abrirModal(item)}
      onEliminarMedicamento={(nombre) => removerMedicamentoIndividual(item.id, nombre)}
      onEliminarTodos={() => removerTodosLosMedicamentos(item.id)}
      isSmallScreen={isSmallScreen}
      isLargeScreen={isLargeScreen}
    />
  );

  const renderMedicamento = (medicamento: string): JSX.Element => (
    <TouchableOpacity
      key={medicamento}
      style={styles.opcionMedicamento}
      onPress={() => asignarMedicamento(medicamento)}
    >
      <Text style={styles.textoMedicamento}>{medicamento}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <View style={styles.header}>
        <Text style={styles.titulo}>Asignación de Medicamentos</Text>
        <Text style={styles.subtitulo}>
          {usuarios.filter(u => u.medicamentos.length > 0).length} de {usuarios.length} usuarios con medicamento
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
      />

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={cerrarModal}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxHeight: height * 0.8 }]}>
            <Text style={styles.modalTitulo}>Seleccionar medicamento para</Text>
            <Text style={styles.modalSubtitulo}>{usuarioSeleccionado?.nombre}</Text>

            <View style={styles.medicamentosContainer}>
              {medicamentosDisponibles.map(renderMedicamento)}
            </View>

            <TouchableOpacity style={styles.botonCancelar} onPress={cerrarModal}>
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
