import {api} from "@/lib/Axios.ts";
import type {ApiResponse} from "@/types/api.ts";
import type {CreateTicketRequest, Ticket} from "@/types/ticket.ts";

class TicketService {
    async getAll(): Promise<Ticket[]> {
        const response = await api.get<ApiResponse<Ticket[]>>("/tickets");
        return response.data.data;
    }

    async getById(id: number): Promise<Ticket> {
        const response = await api.get<ApiResponse<Ticket>>(`/tickets/${id}`);
        return response.data.data;
    }

    async create(request: CreateTicketRequest): Promise<Ticket> {
        const response = await api.post<ApiResponse<Ticket>>("/tickets", request);
        return response.data.data;
    }

    async setInProgress(id: number): Promise<Ticket> {
        const response = await api.patch<ApiResponse<Ticket>>(`/tickets/in-progress/${id}`);
        return response.data.data;
    }

    async setClosed(id: number): Promise<Ticket> {
        const response = await api.patch<ApiResponse<Ticket>>(`/tickets/closed/${id}`);
        return response.data.data;
    }
}

export default new TicketService();
