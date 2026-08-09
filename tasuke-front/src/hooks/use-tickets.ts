import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import CommentService from "@/services/comment.service";
import TicketService from "@/services/ticket.service";

export function useTickets() {
    return useQuery({
        queryKey: ["tickets"],
        queryFn: TicketService.getAll,
    });
}

export function useTicket(id: number) {
    return useQuery({
        queryKey: ["ticket", id],
        queryFn: () => TicketService.getById(id),
        enabled: Number.isFinite(id),
    });
}

export function useTicketComments(ticketId: number) {
    return useQuery({
        queryKey: ["comments", ticketId],
        queryFn: () => CommentService.getByTicket(ticketId),
        enabled: Number.isFinite(ticketId),
    });
}

export function useCreateTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: TicketService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["tickets"]});
        },
    });
}

export function useSetTicketInProgress() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: TicketService.setInProgress,
        onSuccess: (ticket) => {
            queryClient.invalidateQueries({queryKey: ["tickets"]});
            queryClient.invalidateQueries({queryKey: ["ticket", ticket.id]});
        },
    });
}

export function useSetTicketClosed() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: TicketService.setClosed,
        onSuccess: (ticket) => {
            queryClient.invalidateQueries({queryKey: ["tickets"]});
            queryClient.invalidateQueries({queryKey: ["ticket", ticket.id]});
        },
    });
}

export function useCreateComment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: CommentService.create,
        onSuccess: (_comment, variables) => {
            queryClient.invalidateQueries({queryKey: ["comments", variables.ticketId]});
            queryClient.invalidateQueries({queryKey: ["ticket", variables.ticketId]});
        },
    });
}
