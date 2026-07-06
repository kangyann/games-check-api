import { PrismaConnect } from "@/lib/prisma-config";
import { Role } from "../../generated/prisma/client";

export interface CreateApiLogRequest {
  apiKeyId: number;
  userId: number;
  endpoint: string;
  method: string;
  status: number;
  ip: string | null;
}
export default class ApiLogClass {
  public CreateLog(request: CreateApiLogRequest) {
    try {
      console.log(`[ApiLog][${request.endpoint}][${request.ip}] - Log created successfully.`);
      PrismaConnect.apiLog.create({
        data: { ...request },
      });
    } catch (error) {
      console.log(`[ApiLog][${request.endpoint}] - Error creating log:`, error);
      return { message: "500 - Internal Server Error.", status: 500 };
    }
  }

  public async CheckLog(role: Role, userId: number): Promise<{ message: string; status: number }> {
    if (role === "MEMBER") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCount = await PrismaConnect.apiLog.count({
        where: { userId, createdAt: { gte: today } },
      });
      if (todayCount >= 1000) {
        return {
          message: "429 - Daily rate limit exceeded (1000/day). Upgrade to VIP for unlimited access.",
          status: 429,
        };
      }
    }

    if (role === "VIP") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCount = await PrismaConnect.apiLog.count({
        where: { userId, createdAt: { gte: today } },
      });
      if (todayCount >= 10000) {
        return {
          message: "429 - Daily rate limit exceeded (10000/day).",
          status: 429,
        };
      }
    }

    return {
      message: "200 - Log check passed.",
      status: 200,
    };
  }
}
