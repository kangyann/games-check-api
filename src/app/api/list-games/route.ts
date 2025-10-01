/**
 * @type {string[]} - ListGameType
 */

import { ListGames } from "@/data/list-games";
import { NextResponse } from "next/server";

/**
 * @constant
 * @function GET
 * @type {object[]}
 * @returns {Promise<NextResponse>} - JSON
 */

export async function GET(): Promise<NextResponse> {
   return NextResponse.json(
      {
         message: "200 - Data successfully retrieved",
         status: 200,
         data: ListGames,
      },
      { status: 200 }
   );
}
