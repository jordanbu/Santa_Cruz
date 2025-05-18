import axios from 'axios';

// Cambiar la URL para conectarse al servidor desplegado en Render
const API_URL = 'https://backen-sc.onrender.com/fechas-historicas'; // URL del backend desplegado

export const getFechasHistoricas = async () => {
  try {
    const response = await axios.get(API_URL);
    // Solo necesitamos asegurarnos que si la imagen es una URL completa, se use como tal
    const fechasHistoricasConImagenes = response.data.fechasHistoricas.map((item) => ({
      ...item,
      imagen: item.imagen || null, // Si no hay imagen, dejamos null
    }));
    return fechasHistoricasConImagenes;
  } catch (error) {
    console.error('Error obteniendo fechas históricas:', error);
    throw error;
  }
};