import { supabase } from "@/utils/supabase";

export const getRemindersByUser = async (userId: number) => {
  const { data, error } = await supabase
    .from("medication_consumed")
    .select("*")
    .eq("fk_user_id", userId)
    .eq("deleted", 0)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
