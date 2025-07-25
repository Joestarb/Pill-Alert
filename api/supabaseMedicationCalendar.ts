import { supabase } from "@/utils/supabase";
import { MedicationHistoryItem } from "./supabaseMedicalHistoric";

export interface MedicationCalendarDay {
  date: string; // formato YYYY-MM-DD
  items: MedicationHistoryItem[];
}

export const fetchMedicationCalendar = async (
  nurseId: number
): Promise<MedicationCalendarDay[]> => {
  // 1. Obtener grupo del enfermero
  const { data: nurse, error: nurseError } = await supabase
    .from("users")
    .select("fk_group_id")
    .eq("user_id", nurseId)
    .single();

  if (nurseError || !nurse) {
    console.error("Error obteniendo grupo del enfermero:", nurseError);
    return [];
  }

  const groupID = nurse.fk_group_id;

  // 2. Obtener pacientes del grupo
  const { data: patients, error: patientsError } = await supabase
    .from("users")
    .select("user_id")
    .eq("fk_group_id", groupID)
    .eq("fk_role_id", 2);

  if (patientsError || !patients || patients.length === 0) {
    console.error("Error obteniendo pacientes del grupo:", patientsError);
    return [];
  }

  const patientIDs = patients.map((p) => p.user_id);

  // 3. Obtener historial de medicamentos
  const { data, error } = await supabase
    .from("medication_consumed")
    .select(
      `
      medication_consumed_id,
      date_medication,
      updated_at,
      fk_schedule_id,
      fk_medication_id,
      fk_user_id,
      medications!fk_medication_id(medications),
      schedules!fk_schedule_id(schedule),
      users!fk_user_id(user_name),
      created_at,
      miligrams,
      via
    `
    )
    .in("fk_user_id", patientIDs)
    .order("created_at", { ascending: false });
  console.log("Medicamentos encontrados:", data);

  if (error || !data) {
    console.error("Error obteniendo medicamentos:", error);
    return [];
  }

  // Agrupar por día (YYYY-MM-DD)
  const calendarMap: Record<string, MedicationHistoryItem[]> = {};

  data.forEach((item: any) => {
    const dateObj = item.date_medication
      ? new Date(item.date_medication)
      : new Date(item.created_at);
    // Obtener la fecha local en formato YYYY-MM-DD
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    // Lógica de status igual que fetchMedicationHistory
    let status: MedicationHistoryItem["status"] = "Pendiente";
    const updatedAt = item.updated_at;
    const dateMedication = item.date_medication
      ? new Date(item.date_medication)
      : null;
    const now = new Date();
    if (dateMedication && dateMedication > now) {
      status = "Pendiente";
    } else if (!updatedAt || updatedAt === "") {
      status = "Saltado";
    } else if (updatedAt) {
      status = "Tomado";
    }

    const medItem: MedicationHistoryItem = {
      id: item.medication_consumed_id,
      name: item.medications?.medications ?? "Desconocido",
      patient: item.users?.user_name ?? "Paciente desconocido",
      date: dateObj.toLocaleDateString("es-MX"),
      time: dateObj.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      dosage: `${item.miligrams}mg`,
      via: item.via || "Oral",
      status,
    };
    if (!calendarMap[dateKey]) calendarMap[dateKey] = [];
    calendarMap[dateKey].push(medItem);
  });

  // Convertir a array ordenado por fecha descendente
  return Object.entries(calendarMap)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, items]) => ({ date, items }));
};
