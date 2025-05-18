import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function Detalles() {
  const { titulo, fecha, descripcion, imagen } = useLocalSearchParams(); // Obtener parámetros de la URL

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {imagen && <Image source={{ uri: imagen as string }} style={styles.image} />}
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>{titulo}</Text>
        <Text style={styles.date}>{fecha}</Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{descripcion}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  image: {
    width: '100%',
    height: 300,  // Más alto para un impacto visual más grande
    borderRadius: 20,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#228B22',
  },
  contentWrapper: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#228B22',
    textAlign: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'justify',
    lineHeight: 24,
    fontFamily: 'Arial',
  },
});