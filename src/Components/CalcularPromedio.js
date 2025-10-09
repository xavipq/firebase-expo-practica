import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const CalcularPromedio = () => {
  const [numbers, setNumbers] = useState('');
  const [resultado, setResultado] = useState(null);

  const calcularPromedioLocal = (input) => {
    if (!input) return null;
    const numbersArray = input.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n) && n > 0);
    if (numbersArray.length === 0) return null;
    const sum = numbersArray.reduce((a, b) => a + b, 0);
    return (sum / numbersArray.length).toFixed(2);
  };

  const handleCalcular = () => {
    const promedio = calcularPromedioLocal(numbers);
    if (promedio === null) {
      Alert.alert('Error', 'Ingresa al menos un número válido.');
      return;
    }
    setResultado(promedio);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Calcular Promedio de Edades</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa edades (ej: 25, 30, 40)"
        value={numbers}
        onChangeText={setNumbers}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleCalcular}>
        <Text style={styles.buttonText}>CALCULAR</Text>
      </TouchableOpacity>
      {resultado && (
        <Text style={styles.resultado}>Promedio: {resultado}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultado: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CalcularPromedio;