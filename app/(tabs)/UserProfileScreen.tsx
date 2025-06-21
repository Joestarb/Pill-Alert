import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { Ionicons } from "@expo/vector-icons";

export default function UserProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={require("../../assets/images/Logo.png")}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editIcon} activeOpacity={0.7}>
            <Ionicons name="camera-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <ThemedText type="title" style={styles.title}>
          Juan Pérez
        </ThemedText>
      </View>

      <View style={styles.profileDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="mail-outline" size={20} color="#64748b" style={styles.detailIcon} />
          <View>
            <ThemedText style={styles.detailLabel}>Correo electrónico</ThemedText>
            <ThemedText style={styles.detailValue}>juan.perez@email.com</ThemedText>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={20} color="#64748b" style={styles.detailIcon} />
          <View>
            <ThemedText style={styles.detailLabel}>Edad</ThemedText>
            <ThemedText style={styles.detailValue}>35 años</ThemedText>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={20} color="#64748b" style={styles.detailIcon} />
          <View>
            <ThemedText style={styles.detailLabel}>Ubicación</ThemedText>
            <ThemedText style={styles.detailValue}>Ciudad de México</ThemedText>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
        <Ionicons name="pencil-outline" size={18} color="#4f8cff" />
        <ThemedText style={styles.editButtonText}>Editar perfil</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 24,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#e0e7ff",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4f8cff",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  profileDetails: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  detailIcon: {
    marginRight: 16,
    width: 24,
  },
  detailLabel: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e0e7ff",
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  editButtonText: {
    color: "#4f8cff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});