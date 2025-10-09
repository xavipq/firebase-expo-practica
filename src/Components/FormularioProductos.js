import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
// import { doc, addDoc } from 'firebase/firestore';

const FormularioProductos = ({ nuevoProducto, manejoCambio, guardarProducto, actualizarProducto, modoEdicion }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{modoEdicion ? 'Editar Producto' : 'Agregar Producto'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del Producto"
        value={nuevoProducto.nombre}
        onChangeText={(text) => manejoCambio('nombre', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={nuevoProducto.precio}
        onChangeText={(text) => manejoCambio('precio', text)}
        keyboardType="numeric"
      />
      <Button
        title={modoEdicion ? 'Actualizar' : 'Guardar'}
        onPress={modoEdicion ? actualizarProducto : guardarProducto}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10 },
});

export default FormularioProductos;