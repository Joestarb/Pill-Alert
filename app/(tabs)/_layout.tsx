import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'ellipse';

          switch (route.name) {
            case 'index':
              iconName = 'home-outline';
              break;
            case 'RemindersScreen':
              iconName = 'notifications-outline';
              break;
            case 'MedicationHistoryScreen':
              iconName = 'medkit-outline';
              break;
            case 'SettingsScreen':
              iconName = 'settings-outline';
              break;
            case 'UserProfileScreen':
              iconName = 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1976d2',
        tabBarInactiveTintColor: '#90caf9',
        tabBarStyle: { backgroundColor: '#e3f2fd', borderTopWidth: 0 },
        headerShown: false,
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="RemindersScreen" options={{ title: 'Recordatorios' }} />
      <Tabs.Screen name="MedicationHistoryScreen" options={{ title: 'Historial' }} />
      <Tabs.Screen name="UserProfileScreen" options={{ title: 'Perfil' }} />

       <Tabs.Screen
        name="login"
        options={{
              tabBarButton: () => null, 
              tabBarStyle: { display: 'none' }, // Oculta el menú inferior solo en esta pantalla
        }}
      />
      
    </Tabs>
  );
}