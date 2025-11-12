import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from "react-native";
import { realtimeDB } from "../database/firebaseconfig.js";
import { ref, push, onValue } from "firebase/database";

const IMCRealtime = () => {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [registros, setRegistros] = useState([]);

  const calcular = () => {
    const p = parseFloat(peso);
    const a = parseFloat(altura) / 100;
    if (!p || !a) return Alert.alert("Error", "Complete peso y altura");

    const imc = (p / (a * a)).toFixed(2);
    let estado = "";
    if (imc < 18.5) estado = "Bajo peso";
    else if (imc < 25) estado = "Normal";
    else if (imc < 30) estado = "Sobrepeso";
    else estado = "Obesidad";

    push(ref(realtimeDB, "imc"), {
      peso: p,
      altura: parseFloat(altura),
      imc,
      estado,
      fecha: new Date().toLocaleString(),
    });

    setPeso("");
    setAltura("");
    Alert.alert("IMC", `${imc} → ${estado}`);
  };

  useEffect(() => {
    onValue(ref(realtimeDB, "imc"), (snapshot) => {
      const data = snapshot.val();
      const lista = data
        ? Object.entries(data).map(([id, valor]) => ({ id, ...valor }))
        : [];
      setRegistros(lista);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculadora IMC</Text>
      <TextInput placeholder="Peso (kg)" value={peso} onChangeText={setPeso} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Altura (cm)" value={altura} onChangeText={setAltura} keyboardType="numeric" style={styles.input} />
      <Button title="Calcular y Guardar" onPress={calcular} color="#28a745" />

      <FlatList
        data={registros}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Peso: {item.peso} kg | Altura: {item.altura} cm</Text>
            <Text style={styles.imc}>IMC: {item.imc} → {item.estado}</Text>
            <Text style={styles.fecha}>{item.fecha}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f0f8ff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, padding: 12, marginBottom: 15, borderRadius: 10, backgroundColor: "#fff" },
  card: { backgroundColor: "#fff", padding: 15, marginVertical: 8, borderRadius: 12, elevation: 3 },
  imc: { fontWeight: "bold", color: "#0d6efd", fontSize: 16 },
  fecha: { fontSize: 12, color: "#666" },
});

export default IMCRealtime;