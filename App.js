
import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from 'react-native';
import Productos from "./src/views/Productos";
import Clientes from "./src/views/Clientes";
import Empleados from "./src/views/Empleados";

const screens = [
	{ key: 'productos', name: 'Productos', component: Productos },
	{ key: 'clientes', name: 'Clientes', component: Clientes },
	{ key: 'empleados', name: 'Empleados', component: Empleados },
];

export default function App() {
	const [index, setIndex] = useState(0);
	const Current = screens[index].component;

	const goNext = () => setIndex((i) => Math.min(i + 1, screens.length - 1));
	const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

			return (
				<View style={styles.app}>
					<View style={styles.header}>
						<Text style={styles.title}>{screens[index].name}</Text>
					</View>

					<View style={styles.content}>
						<Current />
					</View>

					<View style={styles.footer}>
						<Button title="Arriba" onPress={goPrev} disabled={index === 0} />
						<Text style={styles.footerLabel}>{index + 1} / {screens.length}</Text>
						<Button title="Abajo" onPress={goNext} disabled={index === screens.length - 1} />
					</View>
				</View>
			);
}

const styles = StyleSheet.create({
	app: { flex: 1 },
	// Más compacto: menos altura y padding
		header: { height: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, backgroundColor: '#f7f7f7' },
		title: { fontSize: 16, fontWeight: '600' },
		content: { flex: 1 },
		footer: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
		footerLabel: { fontSize: 14, fontWeight: '500' },
});