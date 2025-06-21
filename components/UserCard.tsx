import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface MedicamentoAsignado {
  id: number;
  nombre: string;
  horario: string;
  status: 'pending' | 'done';
}

interface UserCardProps {
  nombre: string;
  medicamentos: MedicamentoAsignado[];
  onAsignar: () => void;
  onEliminarMedicamento: (medicamentoId: number) => void;
  onEliminarTodos: () => void;
  isSmallScreen: boolean;
  isLargeScreen: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  nombre,
  medicamentos,
  onAsignar,
  onEliminarMedicamento,
  onEliminarTodos,
  isSmallScreen,
  isLargeScreen,
}) => {
  const getStatusColor = (status: 'pending' | 'done') => {
    return status === 'done' ? '#28a745' : '#ffc107';
  };

  const getStatusText = (status: 'pending' | 'done') => {
    return status === 'done' ? 'Completado' : 'Pendiente';
  };

  return (
    <View style={[
      styles.card,
      isLargeScreen && styles.cardLarge,
      isSmallScreen && styles.cardSmall
    ]}>
      <View style={styles.header}>
        <Text style={[styles.nombre, isSmallScreen && styles.nombreSmall]}>
          {nombre}
        </Text>
        <Text style={styles.contador}>
          {medicamentos.length} medicamento{medicamentos.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {medicamentos.length > 0 ? (
        <ScrollView 
          style={styles.medicamentosContainer}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {medicamentos.map((medicamento) => (
            <View key={medicamento.id} style={styles.medicamentoItem}>
              <View style={styles.medicamentoInfo}>
                <Text style={styles.medicamentoNombre}>
                  {medicamento.nombre}
                </Text>
                <Text style={styles.medicamentoHorario}>
                  📅 {medicamento.horario}
                </Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(medicamento.status) }
                ]}>
                  <Text style={styles.statusText}>
                    {getStatusText(medicamento.status)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.botonEliminar}
                onPress={() => onEliminarMedicamento(medicamento.id)}
              >
                <Text style={styles.textoEliminar}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.sinMedicamentos}>
          <Text style={styles.textoSinMedicamentos}>
            Sin medicamentos asignados
          </Text>
        </View>
      )}

      <View style={styles.botonesContainer}>
        <TouchableOpacity
          style={[styles.boton, styles.botonAsignar]}
          onPress={onAsignar}
        >
          <Text style={styles.textoBoton}>+ Asignar</Text>
        </TouchableOpacity>

        {medicamentos.length > 0 && (
          <TouchableOpacity
            style={[styles.boton, styles.botonEliminarTodos]}
            onPress={onEliminarTodos}
          >
            <Text style={styles.textoBotonEliminar}>Eliminar Todos</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardLarge: {
    flex: 1,
    marginHorizontal: 6,
  },
  cardSmall: {
    paddingHorizontal: 12,
  },
  header: {
    marginBottom: 12,
  },
  nombre: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  nombreSmall: {
    fontSize: 16,
  },
  contador: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  medicamentosContainer: {
    maxHeight: 150,
    marginBottom: 12,
  },
  medicamentoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 6,
  },
  medicamentoInfo: {
    flex: 1,
  },
  medicamentoNombre: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 2,
  },
  medicamentoHorario: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  botonEliminar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  textoEliminar: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  sinMedicamentos: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  textoSinMedicamentos: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  botonesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  boton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonAsignar: {
    backgroundColor: '#007bff',
  },
  botonEliminarTodos: {
    backgroundColor: '#dc3545',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  textoBotonEliminar: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default UserCard;