import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';

interface MedicationCardProps {
  name: string;
  time: string;
  dosage: string;
  status: 'pending' | 'completed' | 'missed';
  onPress?: () => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({
  name,
  time,
  dosage,
  status,
  onPress,
}) => {
  const statusConfig = {
    pending: { color: '#f59e0b', icon: 'time-outline', label: 'Pendiente' },
    completed: { color: '#10b981', icon: 'checkmark-circle', label: 'Completado' },
    missed: { color: '#ef4444', icon: 'close-circle', label: 'Omitido' },
  };

  const currentStatus = statusConfig[status];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ThemedView style={[styles.card, { borderLeftColor: currentStatus.color }]}>
        <View style={styles.content}>
          <View style={styles.infoContainer}>
            <ThemedText style={styles.name}>{name}</ThemedText>
            <ThemedText style={styles.details}>{dosage} • {time}</ThemedText>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: `${currentStatus.color}20` }]}>
            <Ionicons 
              name={currentStatus.icon} 
              size={16} 
              color={currentStatus.color} 
              style={styles.statusIcon}
            />
            <ThemedText style={[styles.statusText, { color: currentStatus.color }]}>
              {currentStatus.label}
            </ThemedText>
          </View>
        </View>
        
        {status === 'pending' && (
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.actionButton, styles.completeButton]}>
              <Ionicons name="checkmark" size={18} color="#fff" />
              <ThemedText style={styles.actionButtonText}>Tomado</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.missButton]}>
              <Ionicons name="close" size={18} color="#fff" />
              <ThemedText style={styles.actionButtonText}>Omitir</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  completeButton: {
    backgroundColor: '#10b981',
  },
  missButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default MedicationCard;