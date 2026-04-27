/**
 * @type {string[]} - ListGameType
 * @function Validation
 * @interface /interface/validation.interface
 */
import { NextRequest, NextResponse } from "next/server";
import { isJson } from "@/lib/isJson";
import { CheckGamesResponse } from "@/interfaces/check-games.interface";
import { PrismaConnect } from "@/lib/prisma-config";

import ListGamesClass, { ClassListGamesResponse } from "@/lib/ListGames/ListGames.class";
import CheckGames from "@/lib/checkGames";

/**
 * @function POST
 * @constant
 * @param {Request} request
 * @type {string | null | Record<string,any> | undefined}
 * @returns {Promise<NextResponse>}
 */

export async function POST(request: NextRequest): Promise<NextResponse> {
   const params: string | null = new URL(request.url).searchParams.get("type") ?? null;
   const contentType = request.headers.get("Content-Type") ?? "";
   const apiKeyHeader = request.headers.get("x-api-key") ?? "";

   // Validate API key
   if (!apiKeyHeader) {
      return NextResponse.json(
         {
            message: "401 - Missing API Key. Provide 'x-api-key' header.",
            status: 401,
         },
         { status: 401 }
      );
   }

   const apiKeyRecord = await PrismaConnect.apiKey.findUnique({
      where: { key: apiKeyHeader },
      include: { user: { select: { id: true, role: true, isActive: true } } },
   });

   if (!apiKeyRecord || !apiKeyRecord.isActive) {
      return NextResponse.json(
         {
            message: "401 - Invalid or revoked API Key.",
            status: 401,
         },
         { status: 401 }
      );
   }

   if (!apiKeyRecord.user.isActive) {
      return NextResponse.json(
         {
            message: "403 - Account disabled. Contact support.",
            status: 403,
         },
         { status: 403 }
      );
   }

   // Rate limit check
   const { role } = apiKeyRecord.user;
   if (role === "MEMBER") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCount = await PrismaConnect.apiLog.count({
         where: { userId: apiKeyRecord.user.id, createdAt: { gte: today } },
      });
      if (todayCount >= 1000) {
         return NextResponse.json(
            {
               message: "429 - Daily rate limit exceeded (1000/day). Upgrade to VIP for unlimited access.",
               status: 429,
            },
            { status: 429 }
         );
      }
   }

   if (!params) {
      return NextResponse.json(
         {
            message: "400 - Missing {type} query.",
            status: 400,
         },
         { status: 400 }
      );
   }

   if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
         {
            message: "400 - Content-Type must be application/json.",
            status: 400,
         },
         { status: 400 }
      );
   }

   const jsonValidation: Record<string, any> = await isJson(request);

   if (!jsonValidation?.isValid) {
      const { isValid, ...newestResponse } = jsonValidation as Partial<{ isValid: boolean; message: string; status: number }>;
      return NextResponse.json(newestResponse, { status: newestResponse.status });
   }

   const ListGames = new ListGamesClass()
   const type: ClassListGamesResponse = await ListGames.findFirst({ codeGame: params })

   if (!type.data) {
      return NextResponse.json(
         {
            message: "404 - Types for game does not exist.",
            status: 404,
            ref: "Fetch [GET] : /api/list-game for available types",
         },
         { status: 404 }
      );
   }

   const { userId, serverId } = jsonValidation
   if (!userId) {
      return NextResponse.json({
         status: 400,
         message: "Invalid parameters {userId} or {zoneId}."
      }, { status: 400 })
   }

   console.log(`[REQUEST FROM ${request.headers.get("x-forwarded-for")}] -> ${type.data?.name}`)
   const isValid: CheckGamesResponse | null = await CheckGames.check({ prefix: type.data.prefix, data: jsonValidation as { userId: string, serverId: string } });

   // Log the request
   await PrismaConnect.apiLog.create({
      data: {
         apiKeyId: apiKeyRecord.id,
         userId: apiKeyRecord.user.id,
         endpoint: `/api/check-games?type=${params}`,
         method: "POST",
         status: isValid?.status ?? 500,
         ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null,
      },
   });

   if (isValid?.status !== 200) {
      return NextResponse.json(
         {
            status: isValid.status,
            message: isValid.message,
         },
         { status: isValid.status }
      );
   }
   return NextResponse.json({ ...isValid }, { status: isValid?.status });
}
