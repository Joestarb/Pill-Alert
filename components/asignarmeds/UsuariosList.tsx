import React from "react";
import ListaUsuarios from "../../components/ListaUsuarios";

interface UsuariosListProps {
  usuarios: any[];
  isSmallScreen: boolean;
  isLargeScreen: boolean;
  onAsignar: (usuario: any) => void;
  onEliminarMedicamento: (usuarioId: number, medicamentoId: number) => void;
  onEliminarTodos: (usuarioId: number) => void;
  loading: boolean;
  cargarDatos: () => void;
}

const UsuariosList: React.FC<UsuariosListProps> = (props) => {
  return <ListaUsuarios {...props} />;
};

export default UsuariosList;
