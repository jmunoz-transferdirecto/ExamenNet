import { useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5038/api';

export const useAuth = () => {
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Intentando obtener token inicial...');
        const response = await axios.get(`${API_URL}/auth/token`);
        console.log('Response headers:', response.headers);
        const token = response.headers['x-auth-token'];
        console.log('Token recibido:', token);
        
        if (token) {
          localStorage.setItem('token', token);
          console.log('Token guardado en localStorage');
        } else {
          console.log('No se recibió token en los headers');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    const existingToken = localStorage.getItem('token');
    if (!existingToken) {
      console.log('No hay token existente, solicitando uno nuevo...');
      initializeAuth();
    } else {
      console.log('Token existente encontrado:', existingToken);
    }
  }, []);
};