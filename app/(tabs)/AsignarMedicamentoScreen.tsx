import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  StatusBar,
  Dimensions,
  useWindowDimensions,
} from "react-native";

// Tipos
interface Usuario {
  id: number;
  nombre: string;
  medicamento: string | null;
}

// Datos de ejemplo - en el futuro vendrán del backend
const medicamentosDisponibles: string[] = [
  "Paracetamol",
  "Ibuprofeno", 
  "Amoxicilina",
  "Omeprazol",
  "Aspirina",
  "Loratadina"
];

const usuariosIniciales: Usuario[] = [
  { id: 1, nombre: "Carlos Pérez", medicamento: null },
  { id: 2, nombre: "Ana García", medicamento: null },
  { id: 3, nombre: "Luis Gómez", medicamento: null },
  { id: 4, nombre: "María López", medicamento: null },
  { id: 5, nombre: "Roberto Silva", medicamento: null },
];

export default function AsignacionSimpleScreen(): JSX.Element {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciales);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  
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

    setUsuarios(prevUsuarios =>
      prevUsuarios.map(usuario =>
        usuario.id === usuarioSeleccionado.id
          ? { ...usuario, medicamento }
          : usuario
      )
    );
    
    cerrarModal();
  };

  const removerMedicamento = (usuarioId: number): void => {
    setUsuarios(prevUsuarios =>
      prevUsuarios.map(usuario =>
        usuario.id === usuarioId
          ? { ...usuario, medicamento: null }
          : usuario
      )
    );
  };

  const renderUsuario = ({ item }: { item: Usuario }): JSX.Element => (
    <View style={[
      styles.tarjetaUsuario,
      isSmallScreen && styles.tarjetaUsuarioSmall,
      isLargeScreen && styles.tarjetaUsuarioLarge
    ]}>
      <View style={styles.infoUsuario}>
        <Text style={[
          styles.nombreUsuario,
          isSmallScreen && styles.nombreUsuarioSmall,
          isLargeScreen && styles.nombreUsuarioLarge
        ]}>
          {item.nombre}
        </Text>
        <Text style={[
          styles.estadoMedicamento,
          isSmallScreen && styles.estadoMedicamentoSmall
        ]}>
          {item.medicamento ? (
            <Text style={styles.medicamentoAsignado}>
              Asignado: {item.medicamento}
            </Text>
          ) : (
            <Text style={styles.sinMedicamento}>Sin medicamento asignado</Text>
          )}
        </Text>
      </View>
      
      <View style={[
        styles.botonesContainer,
        isSmallScreen && styles.botonesContainerSmall
      ]}>
        <TouchableOpacity
          style={[
            styles.botonAsignar,
            isSmallScreen && styles.botonSmall,
            isLargeScreen && styles.botonLarge
          ]}
          onPress={() => abrirModal(item)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.textoBotonAsignar,
            isSmallScreen && styles.textoBotonSmall,
            isLargeScreen && styles.textoBotonLarge
          ]}>
            {item.medicamento ? "Cambiar" : "Asignar"}
          </Text>
        </TouchableOpacity>
        
        {item.medicamento && (
          <TouchableOpacity
            style={[
              styles.botonRemover,
              isSmallScreen && styles.botonSmall,
              isLargeScreen && styles.botonLarge
            ]}
            onPress={() => removerMedicamento(item.id)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.textoBotonRemover,
              isSmallScreen && styles.textoBotonSmall,
              isLargeScreen && styles.textoBotonLarge
            ]}>
              Remover
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderMedicamento = (medicamento: string): JSX.Element => (
    <TouchableOpacity
      key={medicamento}
      style={styles.opcionMedicamento}
      onPress={() => asignarMedicamento(medicamento)}
      activeOpacity={0.6}
    >
      <Text style={styles.textoMedicamento}>{medicamento}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={[
        styles.header,
        isSmallScreen && styles.headerSmall,
        isLargeScreen && styles.headerLarge
      ]}>
        <Text style={[
          styles.titulo,
          isSmallScreen && styles.tituloSmall,
          isLargeScreen && styles.tituloLarge
        ]}>
          Asignación de Medicamentos
        </Text>
        <Text style={[
          styles.subtitulo,
          isSmallScreen && styles.subtituloSmall
        ]}>
          {usuarios.filter(u => u.medicamento).length} de {usuarios.length} usuarios con medicamento
        </Text>
      </View>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUsuario}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listaContainer,
          isSmallScreen && styles.listaContainerSmall,
          isLargeScreen && styles.listaContainerLarge
        ]}
        numColumns={isLargeScreen ? 2 : 1}
        columnWrapperStyle={isLargeScreen ? styles.columnWrapper : undefined}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={cerrarModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContainer,
            isSmallScreen && styles.modalContainerSmall,
            isLargeScreen && styles.modalContainerLarge,
            { maxHeight: height * 0.8 }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[
                styles.modalTitulo,
                isSmallScreen && styles.modalTituloSmall,
                isLargeScreen && styles.modalTituloLarge
              ]}>
                Seleccionar medicamento para
              </Text>
              <Text style={[
                styles.modalSubtitulo,
                isSmallScreen && styles.modalSubtituloSmall
              ]}>
                {usuarioSeleccionado?.nombre}
              </Text>
            </View>

            <View style={[
              styles.medicamentosContainer,
              { maxHeight: height * 0.5 }
            ]}>
              {medicamentosDisponibles.map(renderMedicamento)}
            </View>

            <TouchableOpacity
              style={[
                styles.botonCancelar,
                isSmallScreen && styles.botonCancelarSmall,
                isLargeScreen && styles.botonCancelarLarge
              ]}
              onPress={cerrarModal}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.textoBotonCancelar,
                isSmallScreen && styles.textoBotonCancelarSmall,
                isLargeScreen && styles.textoBotonCancelarLarge
              ]}>
                Cancelar
              </Text>
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
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerSmall: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  headerLarge: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212529",
    textAlign: "center",
  },
  tituloSmall: {
    fontSize: 20,
  },
  tituloLarge: {
    fontSize: 28,
  },
  subtitulo: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 4,
  },
  subtituloSmall: {
    fontSize: 12,
  },
  listaContainer: {
    padding: 16,
  },
  listaContainerSmall: {
    padding: 8,
  },
  listaContainerLarge: {
    padding: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    gap: 12,
  },
  tarjetaUsuario: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tarjetaUsuarioSmall: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  tarjetaUsuarioLarge: {
    flex: 0.48,
    padding: 18,
    marginBottom: 16,
  },
  infoUsuario: {
    marginBottom: 12,
  },
  nombreUsuario: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },
  nombreUsuarioSmall: {
    fontSize: 16,
  },
  nombreUsuarioLarge: {
    fontSize: 20,
  },
  estadoMedicamento: {
    fontSize: 14,
  },
  estadoMedicamentoSmall: {
    fontSize: 13,
  },
  medicamentoAsignado: {
    color: "#28a745",
    fontWeight: "500",
  },
  sinMedicamento: {
    color: "#6c757d",
    fontStyle: "italic",
  },
  botonesContainer: {
    flexDirection: "row",
    gap: 8,
  },
  botonesContainerSmall: {
    gap: 6,
  },
  botonAsignar: {
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  botonSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  botonLarge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  textoBotonAsignar: {
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 14,
  },
  textoBotonSmall: {
    fontSize: 12,
  },
  textoBotonLarge: {
    fontSize: 16,
  },
  botonRemover: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  textoBotonRemover: {
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalContainerSmall: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 10,
  },
  modalContainerLarge: {
    borderRadius: 20,
    padding: 24,
    maxWidth: 480,
  },
  modalHeader: {
    marginBottom: 20,
    alignItems: "center",
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    textAlign: "center",
  },
  modalTituloSmall: {
    fontSize: 16,
  },
  modalTituloLarge: {
    fontSize: 20,
  },
  modalSubtitulo: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "500",
    marginTop: 4,
  },
  modalSubtituloSmall: {
    fontSize: 14,
  },
  medicamentosContainer: {
    maxHeight: 300,
  },
  opcionMedicamento: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    borderRadius: 8,
    marginBottom: 4,
  },
  textoMedicamento: {
    fontSize: 16,
    color: "#212529",
    textAlign: "center",
  },
  botonCancelar: {
    backgroundColor: "#6c757d",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  botonCancelarSmall: {
    paddingVertical: 10,
    borderRadius: 6,
  },
  botonCancelarLarge: {
    paddingVertical: 14,
    borderRadius: 10,
  },
  textoBotonCancelar: {
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  textoBotonCancelarSmall: {
    fontSize: 14,
  },
  textoBotonCancelarLarge: {
    fontSize: 18,
  },
});