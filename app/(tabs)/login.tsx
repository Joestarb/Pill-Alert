import { Ionicons } from "@expo/vector-icons";
import { Button, Input, Layout, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loginWithSupabase } from "../../contexts/auth/authThunks";
import type { RootState } from "../../contexts/store";
import { saveSession } from "../../utils/session";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    setError("");
    const result = await dispatch<any>(loginWithSupabase({ email, password }));
    console.log("Login result:", result);
    if (result.meta.requestStatus === "fulfilled" && result.payload) {
      // Guardar sesión en AsyncStorage solo si hay usuario válido
      await saveSession(result.payload);
      router.replace("/(tabs)");
    } else {
      setError(auth.error || "Credenciales incorrectas");
    }
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/Logo.png")} // Reemplaza con tu propia imagen
          style={styles.logo}
          resizeMode="contain"
        />
        <Text category="h3" style={styles.title}>
          Bienvenido
        </Text>
        <Text category="s1" appearance="hint" style={styles.subtitle}>
          Inicia sesión para continuar
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          accessoryLeft={
            <Ionicons name="mail-outline" size={20} color="#8F9BB3" />
          }
        />
        <Input
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
          style={styles.input}
          accessoryLeft={
            <Ionicons name="lock-closed-outline" size={20} color="#8F9BB3" />
          }
          accessoryRight={
            <TouchableOpacity onPress={toggleSecureEntry}>
              <Ionicons
                name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#8F9BB3"
              />
            </TouchableOpacity>
          }
        />
        {error ? (
          <Text status="danger" style={styles.error}>
            {error}
          </Text>
        ) : null}
        {auth.loading && (
          <Text style={{ textAlign: "center", marginBottom: 8 }}>
            Cargando...
          </Text>
        )}

        <View style={styles.forgotPassword}>
          <Button
            appearance="ghost"
            status="basic"
            size="small"
            onPress={() => alert("Recuperar contraseña")}
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </View>

        <Button
          style={styles.button}
          onPress={handleLogin}
          size="large"
          accessoryRight={
            <Ionicons name="arrow-forward" size={20} color="white" />
          }
        >
          Entrar
        </Button>

        <View style={styles.footer}>
          <Text appearance="hint">¿No tienes una cuenta?</Text>
          <Button
            appearance="ghost"
            status="primary"
            size="small"
            onPress={() => alert("Ir a registro")}
          >
            Regístrate
          </Button>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8f9fa",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    fontWeight: "bold",
    color: "#3366FF",
  },
  subtitle: {
    marginBottom: 32,
  },
  form: {
    width: "100%",
    maxWidth: 350,
  },
  input: {
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    marginTop: 24,
    borderRadius: 10,
    backgroundColor: "#3366FF",
    borderColor: "transparent",
    shadowColor: "#3366FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  error: {
    marginBottom: 8,
    textAlign: "center",
  },
  forgotPassword: {
    alignItems: "flex-end",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
});
