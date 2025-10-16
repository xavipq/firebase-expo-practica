import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Button } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore";
import FormularioProductos from "../Components/FormularioProductos.js";
import TablaProductos from "../Components/TablaProductos.js";
import CalcularPromedio from "../Components/CalcularPromedio.js";

const Productos = ({ cerrarSesion }) => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", precio: "" });
  const [idProducto, setIdProducto] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(data);
      console.log("Productos cargados:", data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      Alert.alert("Error", "No se pudieron cargar los productos: " + error.message);
    }
  };

  const manejoCambio = (campo, valor) => {
    setNuevoProducto((prev) => ({ ...prev, [campo]: valor }));
  };

  const guardarProducto = async () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }
    const precio = parseFloat(nuevoProducto.precio);
    if (isNaN(precio)) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }
    try {
      await addDoc(collection(db, "productos"), {
        nombre: nuevoProducto.nombre,
        precio: precio,
      });
      setNuevoProducto({ nombre: "", precio: "" });
      setIdProducto(null);
      setModoEdicion(false);
      cargarDatos();
      Alert.alert("Éxito", "Producto guardado correctamente.");
    } catch (error) {
      console.error("Error al guardar producto:", error);
      Alert.alert("Error", "No se pudo guardar el producto: " + error.message);
    }
  };

  const actualizarProducto = async () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }
    if (!idProducto) {
      Alert.alert("Error", "No se ha seleccionado un producto para actualizar.");
      return;
    }
    const precio = parseFloat(nuevoProducto.precio);
    if (isNaN(precio)) {
      Alert.alert("Error", "El precio debe ser un número válido.");
      return;
    }
    try {
      console.log("Actualizando producto con ID:", idProducto, "Datos:", nuevoProducto);
      const productoRef = doc(db, "productos", idProducto);
      await updateDoc(productoRef, {
        nombre: nuevoProducto.nombre,
        precio: precio,
      });
      setNuevoProducto({ nombre: "", precio: "" });
      setIdProducto(null);
      setModoEdicion(false);
      cargarDatos();
      Alert.alert("Éxito", "Producto actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      Alert.alert("Error", "No se pudo actualizar el producto: " + error.message);
    }
  };

  const editarProducto = (producto) => {
    console.log("Producto seleccionado para editar:", producto);
    if (!producto.id) {
      Alert.alert("Error", "El producto no tiene un ID válido.");
      return;
    }
    setNuevoProducto({
      nombre: producto.nombre || "",
      precio: producto.precio ? producto.precio.toString() : "",
    });
    setIdProducto(producto.id);
    setModoEdicion(true);
  };

  const eliminarProducto = async (id) => {
    try {
      console.log("Eliminando producto con ID:", id);
      await deleteDoc(doc(db, "productos", id));
      cargarDatos();
      Alert.alert("Éxito", "Producto eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      Alert.alert("Error", "No se pudo eliminar el producto: " + error.message);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>

      <Button title="Cerrar Sesión" onPress={cerrarSesion} />
      
      <FormularioProductos
        nuevoProducto={nuevoProducto}
        manejoCambio={manejoCambio}
        guardarProducto={guardarProducto}
        actualizarProducto={actualizarProducto}
        modoEdicion={modoEdicion}
      />
      <TablaProductos
        productos={productos}
        eliminarProducto={eliminarProducto}
        editarProducto={editarProducto}
      />
      <CalcularPromedio />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 2, padding: 8 },
});

export default Productos;