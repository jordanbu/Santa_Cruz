import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExplorarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Esta es la pantalla de Exploración</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001a00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});
