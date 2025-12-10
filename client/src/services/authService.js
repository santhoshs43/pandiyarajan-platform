import API from './axios';

const register = async (userData) => {
    const response = await API.post('/auth/register', userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const login = async (userData) => {
    const response = await API.post('/auth/login', userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getMe = async () => {
    const response = await API.get('/auth/me');
    return response.data;
};

const authService = {
    register,
    login,
    logout,
    getMe,
};

export default authService;
