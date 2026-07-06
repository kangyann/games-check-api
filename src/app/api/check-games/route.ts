/**
 * @type {string[]} - ListGameType
 * @function Validation
 * @interface /interface/validation.interface
 */
import { NextRequest, NextResponse } from "next/server";
import { isJson, JsonValidationResponse } from "@/lib/isJson";
import { CheckGamesResponse } from "@/interfaces/check-games.interface";

import ListGamesClass, { ClassListGamesResponse } from "@/class/ListGames.class";
import CheckGames from "@/lib/checkGames";
import ApiKeyClass, { ApiKeyClassResponse } from "@/class/ApiKey.class";
import ValidationRouteApi from "@/lib/validation-route-api";
import ApiLogClass from "@/class/ApiLog.class";

/**
 * @function POST
 * @constant
 * @param {Request} request
 * @type {string | null | Record<string,any> | undefined}
 * @returns {Promise<NextResponse>}
 */

export async function POST(request: NextRequest): Promise<NextResponse> {
  //  Request Parameters
  const params: string = new URL(request.url).searchParams.get("type") ?? "";
  const contentType: string = request.headers.get("Content-Type") ?? "";
  const apiKeyHeader: string = request.headers.get("x-api-key") ?? "";
  const realIp: string | null = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? null;

  //  Check Request & Validation Route
  const RouteValidation = new ValidationRouteApi(params, contentType, apiKeyHeader);

  if (!params || !contentType || !apiKeyHeader) {
    const CheckValidation = RouteValidation.checking();
    if (CheckValidation.status !== 200) {
      return NextResponse.json({ ...CheckValidation }, { status: CheckValidation.status });
    }
  }

  //  Check API Key
  const ApiKey = new ApiKeyClass();
  const CheckApiKey: ApiKeyClassResponse = await ApiKey.findUnique(apiKeyHeader);

  if (CheckApiKey.status !== 200 || !CheckApiKey.data) {
    return NextResponse.json({ ...CheckApiKey }, { status: CheckApiKey.status });
  }

  const { role, id } = CheckApiKey.data.user;

  //  Check API Log
  const ApiLog = new ApiLogClass();
  const CheckApiLog = await ApiLog.CheckLog(role, id);

  if (CheckApiLog.status !== 200) {
    return NextResponse.json({ ...CheckApiLog }, { status: CheckApiLog.status });
  }

  //  Check Game List
  const ListGames = new ListGamesClass();
  const CheckGamesList: ClassListGamesResponse = await ListGames.findFirst({ codeGame: params });

  if (CheckGamesList.status !== 200 || !CheckGamesList.data) {
    return NextResponse.json({ ...CheckGamesList }, { status: CheckGamesList.status });
  }

  // Validation data request body with actual game data on database.
  const ValidationDataJson: JsonValidationResponse = await isJson(request, CheckGamesList.data);

  if (!ValidationDataJson.isValid || !ValidationDataJson.data) {
    const { data, isValid, ...ValidationDataJsonResponse } = ValidationDataJson;
    return NextResponse.json({ ...ValidationDataJsonResponse }, { status: ValidationDataJson.status });
  }

  // Request to external game API & return output to client.
  const OutputGameValidation: CheckGamesResponse | null = await CheckGames.check({
    prefix: CheckGamesList.data.prefix,
    data: ValidationDataJson.data as { userId: string; serverId: string },
  });

  // Create Log to Database.
  console.log(`[${realIp}][${CheckGamesList.data?.name}][${OutputGameValidation.status}]`);
  ApiLog.CreateLog({
    apiKeyId: CheckApiKey.data.id,
    userId: CheckApiKey.data.user.id,
    endpoint: `/api/check-games?type=${params}`,
    method: "POST",
    status: OutputGameValidation?.status ?? 500,
    ip: realIp,
  });

  return NextResponse.json({ ...OutputGameValidation }, { status: OutputGameValidation?.status });
}
