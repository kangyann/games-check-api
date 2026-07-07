import { PrismaConnect } from "../lib/prisma-config";

export interface PrismaListGames {
  id: number;
  name: string;
  prefix: string;
  status: boolean;
  userId: boolean;
  serverId: boolean;
}
export interface ClassListGamesResponse {
  message: string;
  status: number;
  ref?: string;
  data?: PrismaListGames;
}

export default class ListGamesClass {
  public async findFirst({ codeGame }: { codeGame: string }): Promise<ClassListGamesResponse> {
    try {
      const IsHaveGame: PrismaListGames = await PrismaConnect.listGames.findFirstOrThrow({
        where: { codeGame },
        select: {
          id: true,
          name: true,
          prefix: true,
          status: true,
          userId: true,
          serverId: true,
        },
      });
      if (!IsHaveGame) {
        return {
          message: "404 - Types for game does not exist.",
          status: 404,
          ref: "Fetch [GET] : /api/list-game for available types",
        };
      }

      if (IsHaveGame.status === false) {
        return {
          message: "403 - This game under maintenance.",
          status: 403,
        };
      }
      return { message: "Game found.", status: 200, data: IsHaveGame };
    } catch (error) {
      return { message: "404 - Types for game does not exist.", status: 404 };
    }
  }
}
