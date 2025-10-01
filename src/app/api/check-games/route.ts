/**
 * @type {string[]} - ListGameType
 * @function Validation
 * @interface /interface/validation.interface
 */
import { ListGames, ListGamesTypes } from "@/data/list-games";
import Validation from "@/lib/validation";
import { NextResponse } from "next/server";
import { ValidationResponse } from "../../../interfaces/validation.interface";
import { isJson } from "@/lib/isJson";

/**
 * @function POST
 * @constant
 * @param {Request} request
 * @type {string | null | Record<string,any> | undefined | ValidationResponse}
 * @returns {Promise<NextResponse>}
 */

export async function POST(request: Request): Promise<NextResponse> {
   const params: string | null = new URL(request.url).searchParams.get("type") ?? null;
   const contentType = request.headers.get("Content-Type") ?? "";

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
   const data: Record<string, any> = await isJson(request);

   if (!data?.isValid) {
      const { isValid, ...newestResponse } = data as Partial<{ isValid: boolean; message: string; status: number }>;
      return NextResponse.json(newestResponse, { status: newestResponse.status });
   }

   const type: ListGamesTypes | undefined = ListGames.find((x) => x.prefix == params);

   if (!type) {
      return NextResponse.json(
         {
            message: "400 - Query {type} does not exist.",
            status: 400,
            ref: "Fetch [GET] : /api/list-game for available types",
         },
         { status: 400 }
      );
   }

   const isValid: ValidationResponse | null = await Validation({ name: type.prefix, data });

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
