import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore";
import FormularioEmpleados from "../Components/FormularioEmpleados.js";
import ListaEmpleados from "../Components/ListaEmpleados.js";

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({ nombre: "", apellido: "", salario: "" });
  const [idEmpleado, setIdEmpleado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "empleados"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmpleados(data);
      console.log("Empleados cargados:", data);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
      Alert.alert("Error", "No se pudieron cargar los empleados: " + error.message);
    }
  };

  const manejoCambio = (campo, valor) => {
    setNuevoEmpleado((prev) => ({ ...prev, [campo]: valor }));
  };

  const guardarEmpleado = async () => {
    if (!nuevoEmpleado.nombre || !nuevoEmpleado.apellido || !nuevoEmpleado.salario) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }
    const salario = parseFloat(nuevoEmpleado.salario);
    if (isNaN(salario)) {
      Alert.alert("Error", "El salario debe ser un número válido.");
      return;
    }
    try {
      await addDoc(collection(db, "empleados"), {
        nombre: nuevoEmpleado.nombre,
        apellido: nuevoEmpleado.apellido,
        salario: salario,
      });
      setNuevoEmpleado({ nombre: "", apellido: "", salario: "" });
      setIdEmpleado(null);
      setModoEdicion(false);
      cargarDatos();
      Alert.alert("Éxito", "Empleado guardado correctamente.");
    } catch (error) {
      console.error("Error al guardar empleado:", error);
      Alert.alert("Error", "No se pudo guardar el empleado: " + error.message);
    }
  };

  const actualizarEmpleado = async () => {
    if (!nuevoEmpleado.nombre || !nuevoEmpleado.apellido || !nuevoEmpleado.salario) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }
    if (!idEmpleado) {
      Alert.alert("Error", "No se ha seleccionado un empleado para actualizar.");
      return;
    }
    const salario = parseFloat(nuevoEmpleado.salario);
    if (isNaN(salario)) {
      Alert.alert("Error", "El salario debe ser un número válido.");
      return;
    }
    try {
      console.log("Actualizando empleado con ID:", idEmpleado, "Datos:", nuevoEmpleado);
      const empleadoRef = doc(db, "empleados", idEmpleado);
      await updateDoc(empleadoRef, {
        nombre: nuevoEmpleado.nombre,
        apellido: nuevoEmpleado.apellido,
        salario: salario,
      });
      setNuevoEmpleado({ nombre: "", apellido: "", salario: "" });
      setIdEmpleado(null);
      setModoEdicion(false);
      cargarDatos();
      Alert.alert("Éxito", "Empleado actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
      Alert.alert("Error", "No se pudo actualizar el empleado: " + error.message);
    }
  };

  const editarEmpleado = (empleado) => {
    console.log("Empleado seleccionado para editar:", empleado);
    if (!empleado.id) {
      Alert.alert("Error", "El empleado no tiene un ID válido.");
      return;
    }
    setNuevoEmpleado({
      nombre: empleado.nombre || "",
      apellido: empleado.apellido || "",
      salario: empleado.salario ? empleado.salario.toString() : "",
    });
    setIdEmpleado(empleado.id);
    setModoEdicion(true);
  };

  const eliminarEmpleado = async (id) => {
    try {
      console.log("Eliminando empleado con ID:", id);
      await deleteDoc(doc(db, "empleados", id));
      cargarDatos();
      Alert.alert("Éxito", "Empleado eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      Alert.alert("Error", "No se pudo eliminar el empleado: " + error.message);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 2, padding: 8 },
});

export default Empleados;