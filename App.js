import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./src/database/firebaseconfig.js";

import Productos from "./src/views/Productos.js";
import Clientes from "./src/views/Clientes.js";
import Empleados from "./src/views/Empleados.js";
import ProductosRealtime from "./src/views/ProductosRealtime.js";
import IMCRealtime from "./src/views/IMCRealtime.js";
import Login from "./src/Components/Login.js";

const screens = [
  { key: "productos", name: "Productos", component: Productos },
  { key: "clientes", name: "Clientes", component: Clientes },
  { key: "empleados", name: "Empleados", component: Empleados },
  { key: "realtime", name: "Productos RT", component: ProductosRealtime },
  { key: "imc", name: "Calculadora IMC", component: IMCRealtime },
];

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return unsubscribe;
  }, []);

  const goNext = () => setIndex((i) => Math.min(i + 1, screens.length - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

  const cerrarSesion = () => {
    signOut(auth)
      .then(() => {
        setUsuario(null);
        setIndex(0);
      })
      .catch((error) => console.error("Error al cerrar sesión:", error));
  };

  if (!usuario) {
    return <Login onLoginSuccess={() => setUsuario(auth.currentUser)} />;
  }

  const CurrentScreen = screens[index].component;

  return (
    <View style={styles.app}>
      <View style={styles.header}>
        <Text style={styles.title}>{screens[index].name}</Text>
        <Button title="Cerrar Sesión" onPress={cerrarSesion} color="#d32f2f" />
      </View>

      <View style={styles.content}>
        <CurrentScreen />
      </View>

      <View style={styles.footer}>
        <Button
          title="Arriba"
          onPress={goPrev}
          disabled={index === 0}
          color={index === 0 ? "#aaa" : "#007bff"}
        />
        <Text style={styles.footerLabel}>
          {index + 1} / {screens.length}
        </Text>
        <Button
          title="Abajo"
          onPress={goNext}
          disabled={index === screens.length - 1}
          color={index === screens.length - 1 ? "#aaa" : "#007bff"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#0d6efd",
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  footer: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    elevation: 5,
  },
  footerLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});