import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BotonEliminarProducto from './BotonEliminarProducto.js';

const TablaProductos = ({ productos, eliminarProducto, editarProducto }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Productos</Text>

      {/* Encabezado de la tabla */}
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Nombre</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Precio</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Acciones</Text>
      </View>

      {/* Contenido de la tabla */}
      <View>
        {productos.map((item) => (
          <View key={item.id} style={styles.fila}>
            <Text style={styles.celda}>{item.nombre}</Text>
            <Text style={styles.celda}>${item.precio}</Text>
            <View style={styles.celdaAcciones}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => editarProducto(item)}
              >
                <Text style={styles.editButtonText}>🖋️</Text>
              </TouchableOpacity>
              <BotonEliminarProducto
                id={item.id}
                eliminarProducto={eliminarProducto}
              />
            </View>
          </View>
        ))}
      </View>
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
  },
  fila: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#CCC',
    paddingVertical: 6,
    alignItems: 'center',
  },
  encabezado: {
    backgroundColor: '#f0f0f0',
  },
  celda: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  celdaAcciones: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  textoEncabezado: {
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
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

export default TablaProductos;