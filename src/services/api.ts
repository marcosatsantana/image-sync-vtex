import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.20.21:3020',
});

export default api;
