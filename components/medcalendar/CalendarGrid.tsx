import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CalendarDay from "./CalendarDay";

interface CalendarGridProps {
  days: { date: string; hasItems: boolean }[];
  onDayPress: (date: string) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ days, onDayPress }) => {
  // Agrupar por semanas (suponiendo que days está ordenado)
  const weeks: Array<Array<(typeof days)[0]>> = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <View style={styles.grid}>
      <View style={styles.headerRow}>
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
          <Text key={d} style={styles.headerText}>
            {d}
          </Text>
        ))}
      </View>
      {weeks.map((week, idx) => (
        <View key={idx} style={styles.row}>
          {week.map((day) => (
            <CalendarDay
              key={day.date}
              date={day.date}
              hasItems={day.hasItems}
              onPress={() => onDayPress(day.date)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    marginVertical: 16,
    alignSelf: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 4,
  },
  headerText: {
    width: 40,
    textAlign: "center",
    color: "#64748b",
    fontWeight: "bold",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default CalendarGrid;
