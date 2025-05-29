import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";

interface MedicamentoAsignado {
  nombre: string;
  hora: string;
}

interface Props {
  nombre: string;
  medicamentos: MedicamentoAsignado[];
  onAsignar: () => void;
  onEliminarMedicamento: (nombre: string, hora: string) => void;
  onEliminarTodos: () => void;
  isSmallScreen: boolean;
  isLargeScreen: boolean;
}

export default function UserCard({
  nombre,
  medicamentos,
  onAsignar,
  onEliminarMedicamento,
  onEliminarTodos,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.nombre}>{nombre}</Text>

      {medicamentos.length > 0 ? (
        <>
          {medicamentos.map((m, i) => (
            <View key={i} style={styles.filaMedicamento}>
              <View>
                <Text style={styles.medicamento}>{m.nombre}</Text>
                <Text style={styles.hora}>{m.hora}</Text>
              </View>
              <TouchableOpacity onPress={() => onEliminarMedicamento(m.nombre, m.hora)}>
                <Icon name="trash-2" size={20} color="#dc3545" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity onPress={onEliminarTodos} style={styles.botonEliminarTodos}>
            <Text style={styles.textoBotonEliminarTodos}>Eliminar todos</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.vacio}>Sin medicamento asignado</Text>
      )}

      <TouchableOpacity onPress={onAsignar} style={styles.botonAsignar}>
        <Text style={styles.textoBotonAsignar}>+ Asignar medicamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 6,
    backdropFilter: "blur(10px)",
    borderColor: "#e2e8f0",
    borderWidth: 1,
  },
  nombre: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1f2937",
  },
  filaMedicamento: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  medicamento: {
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
  },
  hora: {
    fontSize: 14,
    color: "#6b7280",
  },
  vacio: {
    color: "#9ca3af",
    fontStyle: "italic",
    marginBottom: 10,
  },
  botonAsignar: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  textoBotonAsignar: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  botonEliminarTodos: {
    backgroundColor: "#facc15",
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 10,
  },
  textoBotonEliminarTodos: {
    textAlign: "center",
    color: "#111827",
    fontWeight: "600",
  },
});
