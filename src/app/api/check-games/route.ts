/**
 * @type {string[]} - ListGameType
 * @function Validation
 * @interface /interface/validation.interface
 */
import { NextRequest, NextResponse } from "next/server";
import { isJson } from "@/lib/isJson";
import { CheckGamesResponse } from "@/interfaces/check-games.interface";

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
   const jsonValidation: Record<string, any> = await isJson(request);

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
