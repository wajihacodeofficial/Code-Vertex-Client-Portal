import axios from 'axios';

// Automatically strip trailing /api from VITE_API_URL if the user mistakenly added it in Vercel settings
let RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
if (RAW_API_URL.endsWith('/api')) {
    RAW_API_URL = RAW_API_URL.slice(0, -4);
}

const api = axios.create({
    baseURL: RAW_API_URL,
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
