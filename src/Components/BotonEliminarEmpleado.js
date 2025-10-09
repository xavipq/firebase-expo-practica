import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";

const BotonEliminarEmpleado = ({ id, eliminarEmpleado }) => {
  const [visible, setVisible] = useState(false);

  const confirmarEliminar = () => {
    setVisible(false);
    eliminarEmpleado(id);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.boton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.textoBoton}>🗑️</Text>
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.texto}>¿Desea eliminar este empleado?</Text>
            <View style={styles.fila}>
              <TouchableOpacity
                style={[styles.botonAccion, styles.cancelar]}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.textoAccion}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botonAccion, styles.confirmar]}
                onPress={confirmarEliminar}
              >
                <Text style={styles.textoAccion}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  boton: {
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#dc3545",
  },
  textoBoton: { 
    color: "#fff",
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  texto: { fontSize: 18, marginBottom: 20 },
  fila: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  botonAccion: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelar: { backgroundColor: "#ccc" },
  confirmar: { backgroundColor: "#dc3545" },
  textoAccion: { color: "white", fontWeight: "bold" },
});

export default BotonEliminarEmpleado;