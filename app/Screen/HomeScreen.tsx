import { router, useNavigation } from 'expo-router';
import React from 'react';
import {StyleSheet,Text,View,TouchableOpacity,ScrollView,Image,SafeAreaView,Dimensions,} from 'react-native';
import HistoriasScreen from './HistoriaScreen';
import { push } from 'expo-router/build/global-state/routing';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9;

export default function HomeScreen() {

    const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Descubre la Historia de Santa Cruz</Text>
        <Text style={styles.subtitle}>
          Explora los lugares históricos y culturales más importantes de nuestra ciudad a través de una experiencia interactiva y educativa.
        </Text>

        {/* Modo Exploración */}
        <View style={styles.card}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.cardTitle}>Modo Exploración</Text>
          <Text style={styles.cardText}>Descubre lugares históricos cercanos usando GPS</Text>
          <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={()=> router.push('/ModoExplorar')}>Explorar</Text>
          </TouchableOpacity>
        </View>

        {/* Línea de Tiempo */}
        <View style={styles.card}>
          <Text style={styles.icon}>🕒</Text>
          <Text style={styles.cardTitle}>Línea de Tiempo</Text>
          <Text style={styles.cardText}>Viaja a través de la historia de Santa Cruz</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} onPress={()=> navigation.navigate('Historia')}>Ver</Text>
          </TouchableOpacity>
        </View>

        {/* Rutas Guiadas */}
        <View style={styles.card}>
          <Text style={styles.icon}>🗺️</Text>
          <Text style={styles.cardTitle}>Rutas Guiadas</Text>
          <Text style={styles.cardText}>Sigue recorridos históricos predefinidos</Text>
          <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={()=> navigation.navigate('Rutas')}>Ver</Text>
          </TouchableOpacity>
        </View>

        {/* Imagen final */}
        <Image
        source={require('../assets/santacruz.jpg')}
          style={styles.image}
          resizeMode="cover"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#064F2C',
  },
  scroll: {
    paddingVertical: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#D3D3D3',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#0D3B2E',
    borderRadius: 12,
    padding: 20,
    width: cardWidth,
    marginBottom: 20,
    alignItems: 'center',
  },
  icon: {
    fontSize: 40,
    marginBottom: 10,
  },
  cardTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    color: '#A0A0A0',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#28A745',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    width: cardWidth,
    height: cardWidth * 0.6,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 30,
  },
});
