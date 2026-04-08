import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
    const session = localStorage.getItem('cv_session');
    if (session) {
        try {
            const parsed = JSON.parse(session);
            if (parsed?.access_token) {
                config.headers.Authorization = `Bearer ${parsed.access_token}`;
            }
        } catch {
            // Ignore malformed session
        }
    }
    return config;
});

// Global response error handler
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If 401 from any endpoint, clear local session
        if (error.response?.status === 401) {
            localStorage.removeItem('cv_session');
            localStorage.removeItem('cv_auth_user');
        }
        return Promise.reject(error);
    }
);

export default api;
