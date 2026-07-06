import { Role } from "../../generated/prisma/client";
import { PrismaConnect } from "../lib/prisma-config";
import { User } from "../../generated/prisma/browser";

export interface ApiKeyClassResponse {
  message: string;
  status: number;
  data?: {
    id: number;
    userId: number;
    isActive: boolean;
    user: { id: number; role: Role; isActive: boolean };
  };
}
export default class ApiKeyClass {
  public async findUnique(key: string): Promise<ApiKeyClassResponse> {
    try {
      const apiKeyRecord = await PrismaConnect.apiKey.findUnique({
        where: { key },
        select: {
          id: true,
          userId: true,
          isActive: true,
          user: {
            select: {
              id: true,
              role: true,
              isActive: true,
            },
          },
        },
      });

      if (!apiKeyRecord || !apiKeyRecord.isActive) {
        return {
          message: "401 - Invalid or revoked API Key.",
          status: 401,
        };
      }
      if (!apiKeyRecord.user.isActive) {
        return {
          message: "403 - Account disabled. Contact support.",
          status: 403,
        };
      }
      return {
        message: "200 - API Key is valid.",
        status: 200,
        data: apiKeyRecord,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "500 - Internal Server Error.",
        status: 500,
      };
    }
  }
}
