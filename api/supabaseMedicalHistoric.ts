import { supabase } from "@/utils/supabase";

export interface MedicationHistoryItem {
  id: number;
  name: string;
  date: string;
  time: string;
  dosage: string;
  status: "Tomado" | "Pendiente" | "Saltado";
  patient: string;
}

export const fetchMedicationHistory = async (nurseId: number): Promise<MedicationHistoryItem[]> => {
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
    .select(`
      medication_consumed_id,
      date_medication,
      fk_schedule_id,
      fk_medication_id,
      fk_user_id,
      medications!fk_medication_id(medications),
      schedules!fk_schedule_id(schedule),
      users!fk_user_id(user_name),
      created_at
    `)
    .in("fk_user_id", patientIDs)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error obteniendo medicamentos:", error);
    return [];
  }

  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  return data
    .filter((item: any) => {
      const baseDate = item.date_medication ? new Date(item.date_medication) : new Date(item.created_at);
      return baseDate >= thirtyDaysAgo;
    })
    .map((item: any) => {
      const dateObj = item.date_medication ? new Date(item.date_medication) : null;
      const scheduleTime = item.schedules?.schedule || "00:00:00";

      const dateStr = (dateObj ?? new Date(item.created_at)).toLocaleDateString("es-MX");
      const timeStr = dateObj?.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) ?? scheduleTime;

      let status: MedicationHistoryItem["status"] = "Pendiente";

      if (dateObj) {
        status = "Tomado";
      } else {
        const [hour, minute] = scheduleTime.split(":").map(Number);
        const scheduledDate = new Date(item.created_at);
        scheduledDate.setHours(hour);
        scheduledDate.setMinutes(minute);
        scheduledDate.setSeconds(0);

        status = now < scheduledDate ? "Pendiente" : "Saltado";
      }

      return {
        id: item.medication_consumed_id,
        name: item.medications?.medications ?? "Desconocido",
        patient: item.users?.user_name ?? "Paciente desconocido",
        date: dateStr,
        time: timeStr,
        dosage: "500mg",
        status,
      };
    });
};
