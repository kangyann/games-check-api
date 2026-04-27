import { ApiFetch } from "./api";
import {
   CheckGamesParams,
   CheckGamesResponse,
} from "../interfaces/check-games.interface";

/**
 * @class CheckGames
 */

export default class CheckGames {

   private static url: string = `${process.env.GAME_API_URL!}/api/game`
   private static key: string = process.env.GAME_API_KEY!

   /**
    * @function check
    * @static
    * @constant
    * @param {CheckGamesParams} params - Parameter Request {userId} {zoneId}
    * @returns {Promise<CheckGamesResponse>}
    */


   static async check({ data, prefix }: CheckGamesParams): Promise<CheckGamesResponse> {
      const { userId, serverId } = data
      const url = `${this.url}/${prefix}?id=${userId}&zone=${serverId}&key=${this.key}`
      const result: Record<string, any> = await ApiFetch({ url: url, method: "GET" });

      if (result && !result.data) {
         return {
            message: `Not found user with this userId: ${userId}`,
            status: 404,
         };
      }

      return {
         status: 200,
         message: "Data successfully retrieved ",
         data: result?.data
      };
   }
}
