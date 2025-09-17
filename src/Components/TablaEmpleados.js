import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BotonEliminarEmpleado from './BotonEliminarEmpleado.js';

const TablaEmpleados = ({ empleados, eliminarEmpleado, editarEmpleado }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Empleados</Text>
      {empleados.map((empleado) => (
        <View key={empleado.id} style={styles.row}>
          <Text style={styles.cell}>{empleado.nombre}</Text>
          <Text style={styles.cell}>{empleado.salario}</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => editarEmpleado(empleado)}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            <BotonEliminarEmpleado id={empleado.id} eliminarEmpleado={eliminarEmpleado} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  row: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  cell: { flex: 1, padding: 5 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  editButton: { backgroundColor: '#ff00aaff', padding: 8, borderRadius: 5, marginRight: 10 },
  editButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default TablaEmpleados;