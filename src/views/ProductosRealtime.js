import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from "react-native";
import { realtimeDB } from "../database/firebaseconfig.js";
import { ref, push, onValue, remove } from "firebase/database";

const ProductosRealtime = () => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [productos, setProductos] = useState([]);

  const guardar = () => {
    if (!nombre || !precio) return Alert.alert("Error", "Complete los campos");
    push(ref(realtimeDB, "productos"), {
      nombre,
      precio: parseFloat(precio),
      fecha: Date.now(),
    });
    setNombre("");
    setPrecio("");
  };

  const eliminar = (id) => {
    remove(ref(realtimeDB, `productos/${id}`));
  };

  useEffect(() => {
    const productosRef = ref(realtimeDB, "productos");
    onValue(productosRef, (snapshot) => {
      const data = snapshot.val();
      const lista = data
        ? Object.entries(data).map(([id, valor]) => ({ id, ...valor }))
        : [];
      setProductos(lista);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos Realtime</Text>
      <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
      <TextInput placeholder="Precio" value={precio} onChangeText={setPrecio} keyboardType="numeric" style={styles.input} />
      <Button title="Guardar" onPress={guardar} color="#0d6efd" />

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.nombre} - ${item.precio}</Text>
            <Button title="X" onPress={() => eliminar(item.id)} color="red" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 12, marginBottom: 10, borderRadius: 8 },
  item: { flexDirection: "row", justifyContent: "space-between", padding: 15, backgroundColor: "#fff", marginVertical: 5, borderRadius: 8 },
});

export default ProductosRealtime;