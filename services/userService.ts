import api from './api';

export interface NotificationSettings {
    followUpReminders: boolean;
    pendingActions: boolean;
    newConverts: boolean;
    weeklyReports: boolean;
}

export const userService = {
    getNotifications: async (): Promise<any[]> => {
        const response = await api.get('/user/notifications');
        return response.data;
    },

    updateNotificationSettings: async (settings: NotificationSettings): Promise<any> => {
        const response = await api.patch('/user/notifications/settings', settings);
        return response.data;
    },

    updateProfile: async (data: any): Promise<any> => {
        const response = await api.patch('/user/profile', data);
        return response.data;
    },
};
