
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from "./src/database/firebaseconfig.js";
import Productos from "./src/views/Productos";
import Login from "./src/Components/Login.js";


export default function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect (() => {
	const unsubscribe = onAuthStateChanged(auth, (user) => {
		setUsuario(user);
	});
	return unsubscribe;
  }, []);

  const cerrarSesion = () => {
	signOut(auth);
  };

  if (!usuario) {
	return <Login onLoginSuccess={() => setUsuario(auth.currentUser)} />;
	  }
     
	    return (
			<View style= {{ flex:1}}>
				<Productos cerrarSesion={cerrarSesion} />
			</View>
		);
}