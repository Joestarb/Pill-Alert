import { Redirect } from "expo-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../contexts/store";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import NotiModal from "@/components/NotiModal";
import React, { useState } from 'react';
import { ThemedText } from "@/components/ThemedText";
import MedicationCard from "@/components/MedicationCard";

export default function HomeScreen() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Datos de ejemplo
  const upcomingMedications = [
    { id: '1', name: 'Paracetamol', time: '08:00 AM', dosage: '500mg', status: 'pending' },
    { id: '2', name: 'Ibuprofeno', time: '02:00 PM', dosage: '400mg', status: 'pending' },
  ];

  const recentActivity = [
    { id: '1', action: 'Tomó Paracetamol', time: 'Hace 2 horas', status: 'completed' },
    { id: '2', action: 'Recordatorio Ibuprofeno', time: 'Hace 5 horas', status: 'missed' },
  ];

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <FontAwesome5 name="user" size={24} color="#4f8cff" />
          </View>
          <View>
            <ThemedText type="title" style={styles.greeting}>¡Buenos días!</ThemedText>
            <ThemedText style={styles.userName}>Dr. Alejandro Pérez</ThemedText>
          </View>
        </View>
        
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Ionicons name="notifications-outline" size={28} color="#64748b" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <ScrollView style={styles.content}>
        {/* Sección de medicamentos próximos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Próximos medicamentos</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAll}>Ver todos</ThemedText>
            </TouchableOpacity>
          </View>
          
          {upcomingMedications.map(med => (
            <MedicationCard 
              key={med.id}
              name={med.name}
              time={med.time}
              dosage={med.dosage}
              status={med.status}
            />
          ))}
        </View>

        {/* Sección de actividad reciente */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Actividad reciente</ThemedText>
          </View>
          
          {recentActivity.map(activity => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[
                styles.activityIcon, 
                activity.status === 'completed' ? styles.completedIcon : styles.missedIcon
              ]}>
                {activity.status === 'completed' ? (
                  <MaterialIcons name="check" size={18} color="#10b981" />
                ) : (
                  <MaterialIcons name="close" size={18} color="#ef4444" />
                )}
              </View>
              <View style={styles.activityText}>
                <ThemedText style={styles.activityAction}>{activity.action}</ThemedText>
                <ThemedText style={styles.activityTime}>{activity.time}</ThemedText>
              </View>
            </View>
          ))}
        </View>

   
      </ScrollView>

 
      {/* Modal de notificaciones */}
      <NotiModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    color: '#64748b',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    color: '#4f8cff',
    fontSize: 14,
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  completedIcon: {
    backgroundColor: '#d1fae5',
  },
  missedIcon: {
    backgroundColor: '#fee2e2',
  },
  activityText: {
    flex: 1,
  },
  activityAction: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 14,
    color: '#64748b',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    // Estilos para la pestaña activa
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#64748b',
  },
  activeTabText: {
    color: '#4f8cff',
    fontWeight: '500',
  },
});