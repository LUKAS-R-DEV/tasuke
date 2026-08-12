import {api} from "@/lib/Axios.ts";
import type {ApiResponse} from "@/types/api.ts";
import type {Notification} from "@/types/notification.ts";

class NotificationService {
    async getAll(): Promise<Notification[]> {
        const response = await api.get<ApiResponse<Notification[]>>("/notifications");
        return response.data.data;
    }

    async markAsRead(id: number): Promise<Notification> {
        const response = await api.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
        return response.data.data;
    }

    async remove(id: number): Promise<Notification> {
        const response = await api.delete<ApiResponse<Notification>>(`/notifications/${id}`);
        return response.data.data;
    }
}

export default new NotificationService();
