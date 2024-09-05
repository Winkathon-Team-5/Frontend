import axios from 'axios';
import Cookies from 'js-cookie';

import { writable } from 'svelte/store';

export const api = axios.create({
  baseURL: 'http://localhost:5173/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const user = writable(null);

export const setToken = (accessToken) => {
  if (accessToken) {
    Cookies.set('accessToken', accessToken, { expires: 14 });

    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  } else {
    Cookies.remove('accessToken');

    delete api.defaults.headers.common['Authorization'];

    user.set(null);
  }
};

if (Cookies.get('accessToken')) {
  api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('accessToken')}`;
}
