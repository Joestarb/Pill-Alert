import { hashPassword } from "../utils/hashPassword";
import { supabase } from "../utils/supabase";

const HASH_SECRET_KEY =
  process.env.EXPO_PUBLIC_HASH_SECRET_KEY ||
  "pon_aqui_una_clave_segura_1234567890";

export async function loginUser(email: string, password: string) {
  const hashedPassword = hashPassword(password, HASH_SECRET_KEY);
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_email", email)
    .eq("user_password", hashedPassword)
    .single();

  if (error) {
    throw error;
  }
  return data;
}
