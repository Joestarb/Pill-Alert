import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { Layout, Text } from "@ui-kitten/components";

const data = [
  { time: "08:10", patient: "Juan", medication: "Paracetamol", status: "done" },
  { time: "09:20", patient: "Luis Gómez", medication: "Amoxicilina", status: "done" },
  { time: "11:20", patient: "Luis Gómez", medication: "Aspirina", status: "done" },
  { time: "13:20", patient: "Luis Gómez", medication: "Amoxicilina", status: "done" },
  { time: "15:20", patient: "María López", medication: "Ibuprofeno", status: "done" },
  { time: "18:20", patient: "Roberto Silva", medication: "Omeprazol", status: "done" },
  { time: "20:00", patient: "Luis Gómez", medication: "Amoxicilina", status: "pending" },
  { time: "21:00", patient: "Jose Dominguez", medication: "Amoxicilina", status: "pending" },
];

export default function ListaHorario() {
  const [medications] = useState(data);
  const { height } = useWindowDimensions();
  const barHeight = 40 + data.length * 65;

  const renderItem = ({ item }) => {
    const imageSource =
      item.status === "done"
        ? require("../../assets/images/veriIcon.png")
        : require("../../assets/images/clockIcon.png");

    return (
      <View style={styles.card}>
        <View style={styles.itemContent}>
          <Text style={styles.time}>{item.time}</Text>
          <View style={styles.medBox}>
            <Text category="s1">{item.patient}</Text>
            <Text category="c1" appearance="hint">
              {item.medication}
            </Text>
          </View>
          <Image source={imageSource} style={styles.imageIcon} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de Horarios</Text>
      </View>

      <View style={styles.mainContainer}>
        <View style={[styles.sideBarContainer, { height: Math.max(barHeight, height - 100) }]}>
          <View style={styles.dot} />
          <View style={styles.sideBar} />
          <View style={styles.dot} />
        </View>

        <Layout style={styles.container}>
          <FlatList
            data={medications}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </Layout>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212529",
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
  },
  sideBarContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 20,
  },
  sideBar: {
    width: 8,
    flex: 1,
    backgroundColor: "#2e2e5c",
    borderRadius: 4,
  },
  dot: {
    width: 14,
    height: 14,
    backgroundColor: "#2e2e5c",
    borderRadius: 7,
    marginVertical: 4,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  time: {
    fontWeight: "bold",
    width: 55,
  },
  medBox: {
    flex: 1,
  },
  imageIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});
