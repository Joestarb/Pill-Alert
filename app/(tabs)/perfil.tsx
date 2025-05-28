import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

function Perfil() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '+52 555 123 4567',
    bio: 'Desarrollador apasionado por la tecnología móvil y las experiencias de usuario.',
    ubicacion: 'Ciudad de México, México',
  });
  
  const [editedInfo, setEditedInfo] = useState({ ...userInfo });

  const handleSave = () => {
    setUserInfo({ ...editedInfo });
    setIsEditing(false);
    Alert.alert('Éxito', 'Perfil actualizado correctamente');
  };

  const handleCancel = () => {
    setEditedInfo({ ...userInfo });
    setIsEditing(false);
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Cambiar foto de perfil',
      'Selecciona una opción',
      [
        { text: 'Cámara', onPress: () => console.log('Abrir cámara') },
        { text: 'Galería', onPress: () => console.log('Abrir galería') },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const ProfileField = ({ label, value, onChangeText, multiline = false }) => (
    <View style={styles.fieldContainer}>
      <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={[
            styles.fieldInput,
            { 
              borderColor: colors.tint,
              color: colors.text,
              backgroundColor: colors.background,
            },
            multiline && styles.multilineInput
          ]}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
        />
      ) : (
        <Text style={[styles.fieldValue, { color: colors.text }]}>{value}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollContainer}>
        <View style={[styles.header, { backgroundColor: colors.tint }]}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <IconSymbol
              name={isEditing ? "xmark" : "pencil"}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.imageSection}>
          <TouchableOpacity onPress={handleImagePicker} style={styles.imageContainer}>
            <Image
              source={{
                uri: 'https://www.shutterstock.com/image-photo/handsome-indonesian-southeast-asian-man-600nw-2476654675.jpg'
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <ProfileField
            label="Nombre completo"
            value={editedInfo.nombre}
            onChangeText={(text) => setEditedInfo({ ...editedInfo, nombre: text })}
          />
          
          <ProfileField
            label="Correo electrónico"
            value={editedInfo.email}
            onChangeText={(text) => setEditedInfo({ ...editedInfo, email: text })}
          />
          
          <ProfileField
            label="Teléfono"
            value={editedInfo.telefono}
            onChangeText={(text) => setEditedInfo({ ...editedInfo, telefono: text })}
          />
          
          <ProfileField
            label="Ubicación"
            value={editedInfo.ubicacion}
            onChangeText={(text) => setEditedInfo({ ...editedInfo, ubicacion: text })}
          />
          
          <ProfileField
            label="Biografía"
            value={editedInfo.bio}
            onChangeText={(text) => setEditedInfo({ ...editedInfo, bio: text })}
            multiline={true}
          />
        </View>

        {isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.saveButton, { backgroundColor: colors.tint }]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  editButton: {
    padding: 8,
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.7,
  },
  fieldValue: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'black',
    marginBottom: 8,
  },
  fieldInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  }
});

export default Perfil;