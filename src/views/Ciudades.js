// src/views/Ciudades.js
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../database/firebaseconfig'; 

const Ciudades = () => {
  useEffect(() => {
    ejecutarConsultas();
  }, []);

  const ejecutarConsultas = async () => {
    console.clear();
    console.log('INICIANDO 8 CONSULTAS FIRESTORE...\n');

    await pruebaConsulta1();
    await pruebaConsulta2();
    await pruebaConsulta3();
    await pruebaConsulta4();
    await pruebaConsulta5();
    await pruebaConsulta6();
    await pruebaConsulta7();
    await pruebaConsulta8();

    console.log('\nTODAS LAS CONSULTAS COMPLETADAS');
  };

  const pruebaConsulta1 = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        where("pais", "==", "Guatemala"),
        orderBy("poblacion", "desc"),
        limit(2)
      );
      const snapshot = await getDocs(q);
      console.log("1. Top 2 Guatemala (población desc)");
      if (snapshot.empty) return console.log("   → Sin resultados");
      snapshot.forEach(doc => {
        const d = doc.data();
        console.log(`   • ${d.nombre} | ${d.poblacion}k | ${d.pais} | ID: ${doc.id}`);
      });
    } catch (e) { console.error("Error 1:", e.message); }
  };

  const pruebaConsulta2 = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        where("pais", "==", "Honduras"),
        where("poblacion", ">", 700),
        orderBy("nombre", "asc"),
        limit(3)
      );
      const snapshot = await getDocs(q);
      console.log("\n2. Honduras >700k (nombre asc)");
      if (snapshot.empty) return console.log("   → Sin resultados");
      snapshot.forEach(doc => {
        const d = doc.data();
        console.log(`   • ${d.nombre} | ${d.poblacion}k | ${d.pais} | ID: ${doc.id}`);
      });
    } catch (e) { console.error("Error 2:", e.message); }
  };

  const pruebaConsulta3 = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        where("pais", "==", "El Salvador"),
        orderBy("poblacion", "asc"),
        limit(2)
      );
      const snapshot = await getDocs(q);
      console.log("\n3. El Salvador (población asc)");
      if (snapshot.empty) return console.log("   → Sin resultados");
      snapshot.forEach(doc => {
        const d = doc.data();
        console.log(`   • ${d.nombre} | ${d.poblacion}k | ${d.pais} | ID: ${doc.id}`);
      });
    } catch (e) { console.error("Error 3:", e.message); }
  };

  const pruebaConsulta4 = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        where("poblacion", "<=", 300),
        orderBy("pais", "desc"),
        limit(4)
      );
      const snapshot = await getDocs(q);
      console.log("\n4. ≤300k (país desc)");
      if (snapshot.empty) return console.log("   → Sin resultados");
      snapshot.forEach(doc => {
        const d = doc.data();
        console.log(`   • ${d.nombre} | ${d.poblacion}k | ${d.pais} | ID: ${doc.id}`);
      });
    } catch (e) { console.error("Error 4:", e.message); }
  };

  const pruebaConsulta5 = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        where("poblacion", ">", 900),
        orderBy("nombre"),
        limit(3)
      );
      const snapshot = await getDocs(q);
      console.log("\n5. >900k (orden nombre)");
      if (snapshot.empty) return console.log("   → Sin resultados");
      snapshot.forEach(doc => {
        const d = doc.data();
        console.log(`   • ${d.nombre} | ${d.poblacion}k | ${d.pais} | ID: ${doc.id}`);
      });
    } catch (e) { console.error("Error 5:", e.message); }
  };

  const pruebaConsulta6 = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        where("pais", "==", "Guatemala"),
        orderBy("poblacion", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      console.log("\n6. Guatemala (población desc, limit 5)");
      if (snapshot.empty) return console.log("   → Sin resultados");
      snapshot.forEach(doc => {
        const d = doc.data();
        console.log(`   • ${d.nombre} | ${d.poblacion}k | ${d.pais} | ID: ${doc.id}`);
      });
    } catch (e) { console.error("Error 6:", e.message); }
  };

  const pruebaConsulta7 = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        where("poblacion", ">=", 200),
        where("poblacion", "<=", 600),
        orderBy("pais", "asc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      console.log("\n7. 200k-600k (país asc)");
      if (snapshot.empty) return console.log("   → Sin resultados");
      snapshot.forEach(doc => {
        const d = doc.data();
        console.log(`   • ${d.nombre} | ${d.poblacion}k | ${d.pais} | ID: ${doc.id}`);
      });
    } catch (e) { console.error("Error 7:", e.message); }
  };

  const pruebaConsulta8 = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        orderBy("poblacion", "desc"),
        orderBy("region", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      console.log("\n8. Top 5 población (región desc)");
      if (snapshot.empty) return console.log("   → Sin resultados");
      snapshot.forEach(doc => {
        const d = doc.data();
        console.log(`   • ${d.nombre} | ${d.poblacion}k | ${d.pais} | ID: ${doc.id}`);
      });
    } catch (e) { console.error("Error 8:", e.message); }
  };

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ fontSize: 13, color: '#555', fontStyle: 'italic' }}>
        Agita el celular → "Open JS Debugger" para ver resultados
      </Text>
    </View>
  );
};

export default Ciudades;