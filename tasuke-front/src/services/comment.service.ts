import {api} from "@/lib/Axios.ts";
import type {ApiResponse} from "@/types/api.ts";
import type {CreateCommentRequest, TicketComment} from "@/types/ticket.ts";

class CommentService {
    async getByTicket(ticketId: number): Promise<TicketComment[]> {
        const response = await api.get<ApiResponse<TicketComment[]>>(`/comments/tickets/${ticketId}/comments`);
        return response.data.data;
    }

    async create(request: CreateCommentRequest): Promise<TicketComment> {
        const response = await api.post<ApiResponse<TicketComment>>("/comments", request);
        return response.data.data;
    }
}

export default new CommentService();
