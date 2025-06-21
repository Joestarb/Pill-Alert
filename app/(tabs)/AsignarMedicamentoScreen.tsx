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
  ScrollView,
  TextInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
  "Metformina",
  "Atorvastatina",
  "Losartán",
  "Salbutamol"
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
  const [busqueda, setBusqueda] = useState<string>("");

  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const isMediumScreen = width > 480;

  const abrirModal = (usuario: Usuario): void => {
    setUsuarioSeleccionado(usuario);
    setModalVisible(true);
  };

  const cerrarModal = (): void => {
    setModalVisible(false);
    setUsuarioSeleccionado(null);
    setBusqueda("");
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

  const medicamentosFiltrados = medicamentosDisponibles.filter(med =>
    med.toLowerCase().includes(busqueda.toLowerCase())
  );

  const renderUsuario = ({ item }: { item: Usuario }) => (
    <UserCard
      nombre={item.nombre}
      medicamentos={item.medicamentos}
      onAsignar={() => abrirModal(item)}
      onEliminarMedicamento={(nombre) => removerMedicamentoIndividual(item.id, nombre)}
      onEliminarTodos={() => removerTodosLosMedicamentos(item.id)}
      isLargeScreen={isLargeScreen}
    />
  );

  const renderMedicamento = (medicamento: string): JSX.Element => (
    <TouchableOpacity
      key={medicamento}
      style={styles.opcionMedicamento}
      onPress={() => asignarMedicamento(medicamento)}
      activeOpacity={0.7}
    >
      <Ionicons name="medkit-outline" size={20} color="#4f8cff" style={styles.medicamentoIcon} />
      <Text style={styles.textoMedicamento}>{medicamento}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.titulo}>Asignación de Medicamentos</Text>
          <View style={styles.contadorContainer}>
            <Text style={styles.contadorTexto}>
              {usuarios.filter(u => u.medicamentos.length > 0).length}/{usuarios.length} usuarios
            </Text>
            <View style={styles.contadorPill}>
              <Text style={styles.contadorPillText}>
                {usuarios.reduce((total, user) => total + user.medicamentos.length, 0)} asignaciones
              </Text>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUsuario}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaContainer}
        numColumns={isLargeScreen ? 2 : 1}
        columnWrapperStyle={isLargeScreen ? styles.columnWrapper : undefined}
        ListHeaderComponent={
          <Text style={styles.subtitulo}>
            Selecciona un usuario para asignar medicamentos
          </Text>
        }
      />

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={cerrarModal}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { width: isMediumScreen ? "80%" : "90%" }]}>
            <TouchableOpacity style={styles.closeButton} onPress={cerrarModal}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>

            <Text style={styles.modalTitulo}>Asignar medicamento a:</Text>
            <Text style={styles.modalSubtitulo}>{usuarioSeleccionado?.nombre}</Text>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar medicamento..."
                value={busqueda}
                onChangeText={setBusqueda}
                placeholderTextColor="#94a3b8"
              />
            </View>

            <ScrollView style={styles.medicamentosContainer}>
              {medicamentosFiltrados.length > 0 ? (
                medicamentosFiltrados.map(renderMedicamento)
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-off-outline" size={48} color="#e2e8f0" />
                  <Text style={styles.emptyText}>No se encontraron medicamentos</Text>
                </View>
              )}
            </ScrollView>

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
  container: { 
    flex: 1, 
    backgroundColor: "#f8fafc" 
  },
  header: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  titulo: { 
    fontSize: 24, 
    fontWeight: "700", 
    color: "#1e293b",
    marginBottom: 8
  },
  contadorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  contadorTexto: {
    fontSize: 14,
    color: "#64748b",
    marginRight: 12
  },
  contadorPill: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  contadorPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4f8cff"
  },
  subtitulo: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
    paddingHorizontal: 24
  },
  listaContainer: { 
    padding: 24,
    paddingTop: 16
  },
  columnWrapper: { 
    justifyContent: "space-between",
    gap: 16
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    maxHeight: "80%",
    width: "90%",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748b",
    textAlign: "center",
    marginBottom: 4
  },
  modalSubtitulo: {
    fontSize: 20,
    color: "#1e293b",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16
  },
  searchIcon: {
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b"
  },
  medicamentosContainer: {
    maxHeight: 300,
    marginBottom: 16
  },
  opcionMedicamento: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    marginBottom: 4
  },
  medicamentoIcon: {
    marginRight: 12
  },
  textoMedicamento: { 
    fontSize: 16,
    color: "#1e293b",
    flex: 1
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 16,
    marginTop: 16
  },
  botonCancelar: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center"
  },
  textoBotonCancelar: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 16
  }
});