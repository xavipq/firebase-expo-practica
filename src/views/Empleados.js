import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, Text } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore";
import FormularioEmpleados from "../Components/FormularioEmpleados.js";
import ListaEmpleados from "../Components/ListaEmpleados.js";

const API_URL = "https://1zay5ukg5f.execute-api.us-east-2.amazonaws.com/generarexcel";

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({ nombre: "", apellido: "", salario: "" });
  const [idEmpleado, setIdEmpleado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  const cargarDatos = async () => {
    try {
      const snap = await getDocs(collection(db, "empleados"));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmpleados(data);
    } catch (e) {
      Alert.alert("Error", "No se cargaron los datos");
    }
  };

  const manejoCambio = (campo, valor) => {
    setNuevoEmpleado(prev => ({ ...prev, [campo]: valor }));
  };

  const guardarEmpleado = async () => {
    if (!nuevoEmpleado.nombre || !nuevoEmpleado.apellido || !nuevoEmpleado.salario) return Alert.alert("Error", "Complete todos los campos");
    const salario = parseFloat(nuevoEmpleado.salario);
    if (isNaN(salario)) return Alert.alert("Error", "Salario inválido");

    try {
      await addDoc(collection(db, "empleados"), { ...nuevoEmpleado, salario });
      limpiarFormulario();
      cargarDatos();
      Alert.alert("Éxito", "Guardado");
    } catch (e) {
      Alert.alert("Error", "No se guardó");
    }
  };

  const actualizarEmpleado = async () => {
    if (!idEmpleado) return Alert.alert("Error", "Seleccione empleado");
    const salario = parseFloat(nuevoEmpleado.salario);
    if (isNaN(salario)) return Alert.alert("Error", "Salario inválido");

    try {
      await updateDoc(doc(db, "empleados", idEmpleado), { ...nuevoEmpleado, salario });
      limpiarFormulario();
      cargarDatos();
      Alert.alert("Éxito", "Actualizado");
    } catch (e) {
      Alert.alert("Error", "No se actualizó");
    }
  };

  const editarEmpleado = (emp) => {
    setNuevoEmpleado({
      nombre: emp.nombre || "",
      apellido: emp.apellido || "",
      salario: emp.salario?.toString() || "",
    });
    setIdEmpleado(emp.id);
    setModoEdicion(true);
  };

  const eliminarEmpleado = async (id) => {
    try {
      await deleteDoc(doc(db, "empleados", id));
      cargarDatos();
      Alert.alert("Éxito", "Eliminado");
    } catch (e) {
      Alert.alert("Error", "No se eliminó");
    }
  };

  const limpiarFormulario = () => {
    setNuevoEmpleado({ nombre: "", apellido: "", salario: "" });
    setIdEmpleado(null);
    setModoEdicion(false);
  };

  // GENERAR EXCEL
  const generarExcel = async () => {
    if (empleados.length === 0) return Alert.alert("Sin datos", "No hay empleados");

    Alert.alert("Generando", "Creando Excel...");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empleados),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const blob = await res.blob();
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result.split(",")[1];
        const uri = `${FileSystem.documentDirectory}empleados.xlsx`;
        await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
        await Sharing.shareAsync(uri);
        Alert.alert("Éxito", "Excel generado");
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se generó el archivo");
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  return (
    <View style={styles.container}>
      <FormularioEmpleados
        nuevoEmpleado={nuevoEmpleado}
        manejoCambio={manejoCambio}
        guardarEmpleado={guardarEmpleado}
        actualizarEmpleado={actualizarEmpleado}
        modoEdicion={modoEdicion}
      />
      <ListaEmpleados
        empleados={empleados}
        eliminarEmpleado={eliminarEmpleado}
        editarEmpleado={editarEmpleado}
      />
      <TouchableOpacity style={styles.btn} onPress={generarExcel}>
        <Text style={styles.btnText}>Generar Excel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  btn: { backgroundColor: "#0d6efd", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 20 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default Empleados;