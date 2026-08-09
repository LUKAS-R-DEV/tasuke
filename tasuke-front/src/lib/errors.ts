export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as {
      response?: {
        status?: number;
        data?: { message?: string; errors?: string[] };
      };
    }).response;
    if (response?.data?.message) return response.data.message;
    if (response?.data?.errors?.length) return response.data.errors.join(", ");
    if (response?.status === 403) return "Você não possui permissão para executar esta ação.";
  }
  return fallback;
}
