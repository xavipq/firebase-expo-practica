import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import BotonEliminarEmpleado from './BotonEliminarEmpleado.js';

const ListaEmpleados = ({ empleados, eliminarEmpleado, editarEmpleado }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Empleados</Text>
      <FlatList
        data={empleados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.nombre} {item.apellido} - ${item.salario}</Text>
            <View style={styles.acciones}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => editarEmpleado(item)}
              >
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
              <BotonEliminarEmpleado
                id={item.id}
                eliminarEmpleado={eliminarEmpleado}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignSelf: 'stretch',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#CCC',
  },
  itemText: {
    fontSize: 18,
    flex: 2,
  },
  acciones: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#ff00aaff',
    padding: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ListaEmpleados;