import axios from 'axios';

export const GOOGLE_MAPS_API_KEY = 'AIzaSyByLtoKxrIUa56p1xs5rf_mzBNwHGKKfgw';

export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.status === 'OK') {
      return response.data.results[0].geometry.location;
    } else {
      throw new Error('No se pudo geocodificar la dirección');
    }
  } catch (error) {
    console.error('Error al obtener coordenadas:', error.message);
    return null;
  }
};
