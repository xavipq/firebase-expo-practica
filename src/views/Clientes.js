import React, { useEffect, useState } from "react";
import { View, StyleSheet,
  ScrollView,
  Button,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import { db } from "../database/firebaseconfig.js";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import ListaClientes from "../Components/ListaClientes.js";
import FormularioClientes from "../Components/FormularioClientes.js";
import TablaClientes from "../Components/TablaCliente.js";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";

// Lista de colecciones (ajusta según tus colecciones reales)
const colecciones = ["productos", "usuarios", "edades", "ciudades", "clientes"];

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [datosCompletos, setDatosCompletos] = useState({});

  // Cargar datos de una sola colección
  const cargarColeccion = async (nombreColeccion) => {
    try {
      const querySnapshot = await getDocs(collection(db, nombreColeccion));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error(`Error al cargar ${nombreColeccion}:`, error);
      return [];
    }
  };

  // Cargar datos de la colección "clientes"
  const cargarDatos = async () => {
    const data = await cargarColeccion("clientes");
    setClientes(data);
  };

  // Cargar TODAS las colecciones
  const cargarDatosFirebase = async () => {
    const datos = {};
    for (const coleccion of colecciones) {
      datos[coleccion] = await cargarColeccion(coleccion);
    }
    setDatosCompletos(datos);
    return datos;
  };

  // Exportar una colección específica
  const exportarColeccion = async (nombreColeccion) => {
    const datos = await cargarColeccion(nombreColeccion);
    if (datos.length === 0) {
      Alert.alert("Sin datos", `No hay datos en la colección "${nombreColeccion}"`);
      return;
    }

    const texto = `${nombreColeccion.toUpperCase()}\n${"-".repeat(30)}\n` +
      datos.map((item, index) => `${index + 1}. ${JSON.stringify(item, null, 2)}`).join("\n\n");

    await exportarYCompartir(texto, `${nombreColeccion}.txt`);
    await copiarAlPortapapeles(texto);
  };

  // Exportar TODAS las colecciones
  const exportarTodasLasColecciones = async () => {
    const datos = await cargarDatosFirebase();
    let textoCompleto = `EXPORTACIÓN COMPLETA - ${new Date().toLocaleString()}\n\n`;

    for (const [nombre, items] of Object.entries(datos)) {
      if (items.length > 0) {
        textoCompleto += `${nombre.toUpperCase()}\n${"-".repeat(30)}\n`;
        textoCompleto += items
          .map((item, index) => `${index + 1}. ${JSON.stringify(item, null, 2)}`)
          .join("\n\n");
        textoCompleto += "\n\n";
      }
    }

    if (textoCompleto.trim() === `EXPORTACIÓN COMPLETA - ${new Date().toLocaleString()}\n\n`) {
      Alert.alert("Sin datos", "No hay datos en ninguna colección.");
      return;
    }

    await exportarYCompartir(textoCompleto, "todas_las_colecciones.txt");
    await copiarAlPortapapeles(textoCompleto);
  };

  // Guardar archivo y compartir
  const exportarYCompartir = async (contenido, nombreArchivo) => {
    try {
      const archivoUri = `${FileSystem.documentDirectory}${nombreArchivo}`;
      await FileSystem.writeAsStringAsync(archivoUri, contenido, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Error", "Compartir no está disponible en este dispositivo.");
        return;
      }

      await Sharing.shareAsync(archivoUri);
      Alert.alert("Éxito", `Datos exportados a ${nombreArchivo}`);
    } catch (error) {
      console.error("Error al exportar:", error);
      Alert.alert("Error", "No se pudo exportar el archivo.");
    }
  };

  // Copiar al portapapeles
  const copiarAlPortapapeles = async (texto) => {
    await Clipboard.setStringAsync(texto);
    Alert.alert("Copiado", "Datos copiados al portapapeles.");
  };

  // Eliminar cliente
  const eliminarCliente = async (id) => {
    try {
      await deleteDoc(doc(db, "clientes", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <FormularioClientes cargarDatos={cargarDatos} />

        <TablaClientes clientes={clientes} eliminarCliente={eliminarCliente} />

        {/* Botones de exportación individual */}
        <View style={styles.seccionBotones}>
          <Text style={styles.tituloSeccion}>Exportar Colección Individual</Text>
          {colecciones.map((col) => (
            <TouchableOpacity
              key={col}
              style={styles.boton}
              onPress={() => exportarColeccion(col)}
            >
              <Text style={styles.botonTexto}>Exportar {col}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón para exportar todo */}
        <View style={styles.seccionBotones}>
          <Text style={styles.tituloSeccion}>Exportar Todo</Text>
          <TouchableOpacity
            style={[styles.boton, styles.botonTodo]}
            onPress={exportarTodasLasColecciones}
          >
            <Text style={styles.botonTextoTodo}>Exportar Todas las Colecciones</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  seccionBotones: { marginVertical: 20 },
  tituloSeccion: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  boton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  botonTodo: {
    backgroundColor: "#34C759",
  },
  botonTexto: {
    color: "white",
    fontWeight: "600",
  },
  botonTextoTodo: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Clientes;