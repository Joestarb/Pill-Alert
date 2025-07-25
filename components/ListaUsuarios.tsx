import React from "react";
import { FlatList } from "react-native";
import UserCard from "./UserCard";

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

interface ListaUsuariosProps {
  usuarios: Usuario[];
  isSmallScreen: boolean;
  isLargeScreen: boolean;
  onAsignar: (usuario: Usuario) => void;
  onEliminarMedicamento: (usuarioId: number, medicamentoId: number) => void;
  onEliminarTodos: (usuarioId: number) => void;
  loading: boolean;
  cargarDatos: () => void;
}

const ListaUsuarios: React.FC<ListaUsuariosProps> = ({
  usuarios,
  isSmallScreen,
  isLargeScreen,
  onAsignar,
  onEliminarMedicamento,
  onEliminarTodos,
  loading,
  cargarDatos,
}) => {
  const renderUsuario = ({ item }: { item: Usuario }) => {
    // Filtrar medicamentos únicos por nombre
    const medicamentosUnicos = item.medicamentos.filter(
      (med, idx, arr) =>
        arr.findIndex(m => m.nombre === med.nombre) === idx
    );

    return (
      <UserCard
        nombre={item.nombre}
        medicamentos={medicamentosUnicos}
        onAsignar={() => onAsignar(item)}
        onEliminarMedicamento={(medicamentoId) => onEliminarMedicamento(item.id, medicamentoId)}
        onEliminarTodos={() => onEliminarTodos(item.id)}
        isSmallScreen={isSmallScreen}
        isLargeScreen={isLargeScreen}
      />
    );
  };

  return (
    <FlatList
      data={usuarios}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderUsuario}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16 }}
      numColumns={isLargeScreen ? 2 : 1}
      columnWrapperStyle={
        isLargeScreen ? { justifyContent: "space-between", gap: 12 } : undefined
      }
      refreshing={loading}
      onRefresh={cargarDatos}
    />
  );
};

export default ListaUsuarios;
