/**
 * @function ApiFetch;
 * @interface /interfaces/mobile-legends.interface
 */

import { ApiFetch } from "./api";
import {
   CheckGamesParams,
   CheckGamesResponse,
} from "../interfaces/check-games.interface";
/**
 * @class CheckGames
 */

export default class CheckGames {
   /**
    * @function isMobileLegends
    * @static
    * @constant
    * @type {Record<string,any> | MobileLegendsConfirm}
    * @param {MobileLegendsParams} params - Parameter Request {userId} {zoneId}
    * @returns {Promise<MobileLegendsResponse>}
    */

   private static url: string = `${process.env.GAME_API_URL!}`
   private static key: string = process.env.GAME_API_KEY!

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
