import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import NotificationService from "@/services/notification.service";

export function useNotifications() {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: NotificationService.getAll,
        refetchInterval: 30_000,
    });
}

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: NotificationService.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["notifications"]});
        },
    });
}

export function useDeleteNotification() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: NotificationService.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["notifications"]});
        },
    });
}
