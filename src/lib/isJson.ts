import { PrismaListGames } from "../class/ListGames.class";

export interface JsonValidationResponse {
  isValid: boolean;
  message?: string;
  status?: number;
  data?: { userId?: string; serverId?: string };
}
export async function isJson(request: Request, database: PrismaListGames): Promise<JsonValidationResponse> {
  if (!request.body) {
    return {
      isValid: false,
      message: "Request body is empty.",
      status: 400,
    };
  }
  
  try {
    const data: { userId: string; serverId?: string } = await request.json();

    if (database.userId && !data.userId && database.serverId && !data.serverId) {
      return {
        isValid: false,
        message: "Required parameter {userId} or {serverId}.",
        status: 400,
      };
    }

    if (database.userId && !data.userId) {
      return {
        isValid: false,
        message: "Required parameter {userId}.",
        status: 400,
      };
    }
    if (database.serverId && !data.serverId) {
      return {
        isValid: false,
        message: "Required parameter {serverId}.",
        status: 400,
      };
    }
    return {
      isValid: true,
      data: { ...data },
    };
  } catch (error) {
    return {
      message: "Invalid Request Body. Check data body {userId} or {serverId}.",
      status: 400,
      isValid: false,
    };
  }
}
