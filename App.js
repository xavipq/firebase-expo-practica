// App.js
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { View, Button, Text, ScrollView } from "react-native";
import { auth } from "./src/database/firebaseconfig"; // ← CORRECTO
import Login from "./src/Components/Login";
import Productos from "./src/views/Productos.js";
import Ciudades from "./src/views/Ciudades.js";

export default function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return unsubscribe;
  }, []);

  const cerrarSesion = async () => {
    await signOut(auth);
  };

  if (!usuario) {
    return <Login onLoginSuccess={() => setUsuario(auth.currentUser)} />;
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Bienvenido, {usuario.email}
        </Text>
        <Button title="Cerrar Sesión" onPress={cerrarSesion} color="#d32f2f" />

        <View style={{ marginVertical: 20 }}>
          <Productos cerrarSesion={cerrarSesion} />
        </View>

        <View style={{ marginTop: 30, padding: 15, backgroundColor: "#f0f8ff", borderRadius: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
            8 Consultas Firestore
          </Text>
          <Ciudades />
        </View>
      </View>
    </ScrollView>
  );
}