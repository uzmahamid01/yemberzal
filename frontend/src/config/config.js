// Place this at: frontend/src/config/config.js
import axios from 'axios';

const getApiBaseUrl = () => {
    if (process.env.NODE_ENV === 'production') {
      return 'https://yemberzal-app-28481d1d0b39.herokuapp.com/api';
    }
    return 'http://127.0.0.1:8000/api';
  };
  
  const apiConfig = {
    baseURL: getApiBaseUrl(),
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  // If using axios
  const apiClient = axios.create(apiConfig);
  
  export default apiClient;