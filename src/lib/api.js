import axios from 'axios';
import Cookies from 'js-cookie';

import { writable } from 'svelte/store';

export const api = axios.create({
	baseURL: '/api',
	headers: {
		'Content-Type': 'application/json'
	}
});

export const user = createStore();

export const setToken = (accessToken, refreshToken) => {
	Cookies.set('accessToken', accessToken, { expires: 1 });
	Cookies.set('refreshToken', refreshToken, { expires: 30 });

	if (accessToken) {
		api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
	}
};

api.interceptors.request.use(
	(config) => {
		const accessToken = Cookies.get('accessToken');

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		if (error.response.data.error === 'Access Token이 만료되었습니다.') {
			const refreshToken = Cookies.get('refreshToken');

			const response = await api.post('/auth/refresh', { refreshToken });

			Cookies.set('accessToken', response.data.accessToken, { expires: 1 });
			Cookies.set('refreshToken', response.data.refreshToken, { expires: 30 });

			originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

			return api(originalRequest);
		}

		return Promise.reject(error);
	}
);

if (Cookies.get('accessToken')) {
	api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('accessToken')}`;
}

function createStore() {
	const { subscribe, set } = writable(0);

	return {
		subscribe,
		set
	};
}
