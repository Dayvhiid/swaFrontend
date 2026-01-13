import api from './api';

export interface User {
    id?: string;
    name: string;
    email: string;
    role: string;
    parishId?: string;
    areaId?: string;
    zonalId?: string;
}

export interface SignupData extends User {
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export const authService = {
    signup: async (data: SignupData): Promise<AuthResponse> => {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    getProfile: async (): Promise<any> => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<any> => {
        const response = await api.post('/auth/change-password', data);
        return response.data;
    },

    forgotPassword: async (email: string): Promise<any> => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (data: { token: string; newPassword: string }): Promise<any> => {
        const response = await api.post('/auth/reset-password', data);
        return response.data;
    },
};
