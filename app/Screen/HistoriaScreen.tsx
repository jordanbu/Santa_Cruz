import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity, Animated } from 'react-native';
import { getFechasHistoricas } from '../Screen/api'; // Ajusta según la ruta de tu API
import { useRouter } from 'expo-router'; // Usamos el hook de `useRouter`

// Usamos Dimensions solo si es necesario para tamaños específicos.
const { width, height } = Dimensions.get('window'); // Obtenemos tanto el ancho como el alto para ajustarnos a pantallas pequeñas.

type FechaHistorica = {
  _id: string;
  titulo: string;
  fecha: string;
  imagen: string;
  descripcion: string;
};

export default function Timeline() {
  const [fechasHistoricas, setFechasHistoricas] = useState<FechaHistorica[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter(); // Hook para navegación

  // Función para obtener las fechas históricas de la API
  const fetchData = async () => {
    try {
      const data = await getFechasHistoricas();
      setFechasHistoricas(data);
    } catch (error) {
      console.error('Error al obtener fechas históricas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Se ejecuta cuando la pantalla se carga
  useEffect(() => {
    fetchData();
  }, []);

  // Función para refrescar los datos cuando se hace pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      horizontal
      showsHorizontalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#228B22']} />}
    >
      {fechasHistoricas.map((item) => (
        <TouchableOpacity
          key={item._id}
          style={styles.cardContainer}
          onPress={() => router.push({ pathname: '/Screen/detalle', params: item })} // Usamos params en vez de query
        >
          <Animated.View style={styles.card}>
            {item.imagen && <Image source={{ uri: item.imagen }} style={styles.image} />}
            <View style={styles.header}>
              <Text style={styles.fecha}>{item.fecha}</Text>
              <Text style={styles.titulo}>{item.titulo}</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  cardContainer: {
    marginBottom: 20,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25, // Esquinas más redondeadas
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, // Sombra más sutil
    shadowRadius: 12,
    elevation: 6, // Sombra más suave y elegante
    overflow: 'hidden', // Asegura que todo el contenido se mantenga dentro de los bordes redondeados
  },
  card: {
    backgroundColor: '#006400',
    borderRadius: 25,
    padding: 15,
    width: width * 0.75, // Ajuste del 75% del ancho para mejor proporción
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: height * 0.3, // Ajustamos la altura de la imagen al 30% de la altura de la pantalla
    resizeMode: 'cover',
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#228B22', // Borde verde que resalta
  },
  header: {
    width: '100%',
    marginBottom: 10,
  },
  fecha: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 6,
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Arial', // Tipografía más limpia
  },
  titulo: {
    fontSize: 20, // Mayor tamaño para los títulos
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Arial',
  },
});