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
  const renderUsuario = ({ item }: { item: Usuario }) => (
    <UserCard
      nombre={item.nombre}
      medicamentos={item.medicamentos}
      onAsignar={() => onAsignar(item)}
      onEliminarMedicamento={(nombre) => onEliminarMedicamento(item.id, nombre)}
      onEliminarTodos={() => onEliminarTodos(item.id)}
      isSmallScreen={isSmallScreen}
      isLargeScreen={isLargeScreen}
    />
  );

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
