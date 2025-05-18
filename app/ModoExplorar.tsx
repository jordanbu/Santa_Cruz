import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import puntos from "../app/api/puntos.json";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";



type LatLng = {
  latitude: number;
  longitude: number;
};

export default function ModoExplorar() {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "No se pudo acceder a tu ubicación.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLoading(false);
    })();
  }, []);

  const focusUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...userLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    } else {
      Alert.alert("Ubicación no disponible", "No se pudo acceder a tu ubicación actual.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FF4C4C" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude ?? -17.7833,
          longitude: userLocation?.longitude ?? -63.1821,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        mapType="standard"
      >
        {puntos.map((punto) => (
          <Marker
            key={punto.id}
            coordinate={{ latitude: punto.lat, longitude: punto.lng }}
            title={punto.nombre}
            description={punto.descripcion}
            
          />
        ))}

        {userLocation && (
          <Marker
            coordinate={userLocation}
            pinColor="blue"
            title="Estás aquí"
            description="Tu ubicación actual"
          />
        )}
      </MapView>

      <TouchableOpacity style={styles.locationButton} onPress={focusUserLocation} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Ver mi ubicación</Text>
        <Ionicons name="locate" size={20} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')} activeOpacity={0.8}>
        <Ionicons name="arrow-back" size={20} color="white" />
        <Text style={styles.buttonText}>Volver al inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  locationButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#FF4C4C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#28A745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});
