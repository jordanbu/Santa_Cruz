import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import MapView, { Marker, LatLng, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from '../api/maps';
import haversine from 'haversine-distance';

type ModoVista = 'mapa' | 'detalles' | 'navegando';

export default function RutasScreen() {
  const [modo, setModo] = useState<ModoVista>('mapa');
  const [region, setRegion] = useState({
    latitude: -17.7833,
    longitude: -63.1821,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [points, setPoints] = useState<LatLng[]>([]);
  const [finalPoint, setFinalPoint] = useState<LatLng | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerUbicacion();
  }, []);

  const obtenerUbicacion = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Activa los permisos de ubicación.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const ubicacion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setRegion({
        ...ubicacion,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      setPoints([ubicacion]);
    } catch (error) {
      Alert.alert('Error de GPS', (error as Error).message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleMapPress = (e: MapPressEvent) => {
    setSelectedPoint(e.nativeEvent.coordinate);
  };

  const addPoint = () => {
    if (selectedPoint) {
      setPoints([...points, selectedPoint]);
      setSelectedPoint(null);
    }
  };

  const setFinal = () => {
    if (selectedPoint) {
      setFinalPoint(selectedPoint);
      setSelectedPoint(null);
      setModo('navegando');
    }
  };

  const resetRoute = () => {
    setSelectedPoint(null);
    setFinalPoint(null);
    setModo('mapa');
    obtenerUbicacion();
  };

  const removePointByIndex = (index: number) => {
    if (index === 0) return;
    Alert.alert('¿Eliminar este punto?', '¿Seguro que quieres quitar este punto del recorrido?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        onPress: () => {
          const updated = [...points];
          updated.splice(index, 1);
          setPoints(updated);
        },
      },
    ]);
  };

  const calcularDistanciaTotal = (): string => {
    let total = 0;
    for (let i = 0; i < points.length - 1; i++) {
      total += haversine(points[i], points[i + 1]);
    }
    if (finalPoint && points.length > 0) {
      total += haversine(points[points.length - 1], finalPoint);
    }
    return (total / 1000).toFixed(2); // en km
  };

  const estimarTiempo = () => `${Math.ceil(parseFloat(calcularDistanciaTotal()) * 5)} min`;

  const renderVistaMapa = () => (
    <>
      <MapView
        style={styles.map}
        provider="google"
        region={region}
        onPress={handleMapPress}
        showsUserLocation={true}
      >
        {points.map((point, index) => (
          <Marker
            key={index}
            coordinate={point}
            title={`Punto ${index === 0 ? 'Inicio' : index}`}
            pinColor={index === 0 ? 'blue' : 'red'}
            onPress={() => removePointByIndex(index)}
          />
        ))}
        {selectedPoint && (
          <Marker
            coordinate={selectedPoint}
            title="Seleccionado"
            pinColor="orange"
            draggable
            onDragEnd={(e) => setSelectedPoint(e.nativeEvent.coordinate)}
          />
        )}
        {finalPoint && (
          <Marker coordinate={finalPoint} title="Destino" pinColor="green" />
        )}
        {finalPoint && points.length > 0 && (
          <MapViewDirections
            origin={points[0]}
            waypoints={points.slice(1)}
            destination={finalPoint}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor="limegreen"
            mode="WALKING"
          />
        )}
      </MapView>

      <View style={styles.card}>
        <Text style={styles.title}>Recorrido Personalizado</Text>
        <Text style={styles.subtitle}>Puntos: {points.length}</Text>
        <Text style={styles.subtitle}>Distancia: {calcularDistanciaTotal()} km</Text>

        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.button} onPress={addPoint} disabled={!selectedPoint}>
            <Text style={styles.buttonText}>Añadir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={setFinal} disabled={!selectedPoint}>
            <Text style={styles.buttonText}>Destino</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={resetRoute}>
            <Text style={styles.buttonText}>Nuevo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderVistaNavegando = () => (
    <>
      <MapView
        style={styles.map}
        provider="google"
        region={region}
        showsUserLocation={true}
      >
        {points.map((point, index) => (
          <Marker
            key={index}
            coordinate={point}
            title={`Punto ${index === 0 ? 'Inicio' : index}`}
            pinColor={index === 0 ? 'blue' : 'red'}
          />
        ))}
        {finalPoint && (
          <Marker coordinate={finalPoint} title="Destino" pinColor="green" />
        )}
        {finalPoint && points.length > 0 && (
          <MapViewDirections
            origin={points[0]}
            waypoints={points.slice(1)}
            destination={finalPoint}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor="limegreen"
            mode="WALKING"
          />
        )}
      </MapView>

      <View style={styles.navigationCard}>
        <Text style={styles.navTitle}>Ruta Personalizada</Text>
        <Text style={styles.navDescription}>Recorrido libre con puntos seleccionados</Text>

        <View style={styles.navInfoRow}>
          <Text style={styles.navDetail}>Distancia: {calcularDistanciaTotal()} km</Text>
          <Text style={styles.navDetail}>Tiempo estimado: {estimarTiempo()}</Text>
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.button} onPress={() => setModo('detalles')}>
            <Text style={styles.buttonText}>Ver Detalles</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={resetRoute}>
            <Text style={styles.buttonText}>Detener Navegación</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderVistaDetalles = () => (
    <ScrollView style={styles.detalleContainer}>
      <Text style={styles.detalleTitulo}>Sobre la Ruta</Text>
      <Text style={styles.detalleDescripcion}>
        Esta ruta fue creada manualmente por el usuario. Aquí están los puntos marcados:
      </Text>
      {points.map((p, i) => (
        <View key={i} style={styles.parada}>
          <Text style={styles.paradaTitulo}>
            Punto {i + 1} {i === 0 ? '(Inicio)' : ''}
          </Text>
          <Text style={styles.paradaDescripcion}>
            Lat: {p.latitude.toFixed(4)} | Lng: {p.longitude.toFixed(4)}
          </Text>
        </View>
      ))}
      {finalPoint && (
        <View style={styles.parada}>
          <Text style={styles.paradaTitulo}>Destino (Fin)</Text>
          <Text style={styles.paradaDescripcion}>
            Lat: {finalPoint.latitude.toFixed(4)} | Lng: {finalPoint.longitude.toFixed(4)}
          </Text>
        </View>
      )}
      <TouchableOpacity style={styles.botonIniciar} onPress={() => setModo('navegando')}>
        <Text style={styles.botonTexto}>Iniciar Navegación</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#28A745" />
          <Text style={styles.loaderText}>Obteniendo ubicación...</Text>
        </View>
      ) : modo === 'mapa' ? renderVistaMapa()
        : modo === 'navegando' ? renderVistaNavegando()
        : renderVistaDetalles()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#001a00' },
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { color: 'white', marginTop: 10 },
  title: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { color: '#A0A0A0', fontSize: 14, textAlign: 'center' },
  card: {
    position: 'absolute', bottom: 20, width: '92%', marginHorizontal: '4%',
    backgroundColor: '#0D3B2E', borderRadius: 12, padding: 15, zIndex: 10,
  },
  navigationCard: {
    position: 'absolute', bottom: 20, width: '92%', marginHorizontal: '4%',
    backgroundColor: '#0D3B2E', borderRadius: 12, padding: 15, zIndex: 10,
  },
  navTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  navDescription: { color: '#D3D3D3', marginBottom: 8 },
  navInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  navDetail: { color: '#A0A0A0' },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  button: { backgroundColor: '#28A745', padding: 10, borderRadius: 8, flex: 1, marginRight: 5 },
  cancelButton: { backgroundColor: '#ff4444', padding: 10, borderRadius: 8, flex: 1, marginLeft: 5 },
  buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  detalleContainer: { flex: 1, backgroundColor: '#001a00', padding: 16 },
  detalleTitulo: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  detalleDescripcion: { color: '#D3D3D3', marginBottom: 10 },
  parada: { backgroundColor: '#003d2e', padding: 12, borderRadius: 8, marginBottom: 10 },
  paradaTitulo: { color: 'white', fontWeight: 'bold' },
  paradaDescripcion: { color: '#A0A0A0', fontSize: 13 },
  botonIniciar: { backgroundColor: '#28A745', padding: 12, borderRadius: 8, marginTop: 10 },
  botonTexto: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});
