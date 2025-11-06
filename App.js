import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./src/database/firebaseconfig.js";

import Productos from "./src/views/Productos";
import Clientes from "./src/views/Clientes";
import Empleados from "./src/views/Empleados";
import Login from "./src/Components/Login.js";

// Lista de pantallas (sin Login)
const screens = [
  { key: "productos", name: "Productos", component: Productos },
  { key: "clientes", name: "Clientes", component: Clientes },
  { key: "empleados", name: "Empleados", component: Empleados },
];

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [index, setIndex] = useState(0);

  // Verificar autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return unsubscribe;
  }, []);

  const goNext = () => setIndex((i) => Math.min(i + 1, screens.length - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

  const cerrarSesion = () => {
    signOut(auth).catch((error) => console.error("Error al cerrar sesión:", error));
  };

  // Si no hay usuario → mostrar Login
  if (!usuario) {
    return <Login onLoginSuccess={() => setUsuario(auth.currentUser)} />;
  }

  // Si hay usuario → mostrar app con navegación
  const CurrentScreen = screens[index].component;

  return (
    <View style={styles.app}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{screens[index].name}</Text>
        <Button title="Cerrar Sesión" onPress={cerrarSesion} color="#d32f2f" />
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <CurrentScreen />
      </View>

      {/* Footer - Navegación */}
      <View style={styles.footer}>
        <Button title="Arriba" onPress={goPrev} disabled={index === 0} />
        <Text style={styles.footerLabel}>
          {index + 1} / {screens.length}
        </Text>
        <Button
          title="Abajo"
          onPress={goNext}
          disabled={index === screens.length - 1}
        />
      </View>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#f7f7f7",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    flex: 1,
  },
  footer: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  footerLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
  },
});