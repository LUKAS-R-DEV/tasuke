import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import UserService from "@/services/user.service";

export function useUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: UserService.getAll,
    });
}

export function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: UserService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["users"]});
        },
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, request}: {id: number; request: Parameters<typeof UserService.update>[1]}) =>
            UserService.update(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["users"]});
        },
    });
}

export function useSetUserActive() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, active}: {id: number; active: boolean}) =>
            active ? UserService.activate(id) : UserService.deactivate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["users"]});
        },
    });
}
