export type TicketStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH";

export interface TicketComment {
  id: number;
  message: string;
  userName: string;
  ticketTitle: string;
  createdAt: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  userId: number;
  priority: TicketPriority;
}

export interface CreateCommentRequest {
  message: string;
  ticketId: number;
  userId: number;
}
