import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const FormularioEmpleados = ({ nuevoEmpleado, manejoCambio, guardarEmpleado, actualizarEmpleado, modoEdicion }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{modoEdicion ? 'Editar Empleado' : 'Agregar Empleado'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nuevoEmpleado.nombre}
        onChangeText={(text) => manejoCambio('nombre', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={nuevoEmpleado.apellido}
        onChangeText={(text) => manejoCambio('apellido', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Salario"
        value={nuevoEmpleado.salario}
        onChangeText={(text) => manejoCambio('salario', text)}
        keyboardType="numeric"
      />
      <Button
        title={modoEdicion ? 'Actualizar' : 'Guardar'}
        onPress={modoEdicion ? actualizarEmpleado : guardarEmpleado}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10 },
});

export default FormularioEmpleados;