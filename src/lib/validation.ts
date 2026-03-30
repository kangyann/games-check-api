/**
 * @class CheckGames
 * @interface /interfaces/validation.interface
 */

import { ValidationParams, ValidationResponse } from '../interfaces/validation.interface';
import CheckGames from './checkGames';

/**
 * @function Validation
 * @param {ValidationParams} params - ID User
 * @returns {Promise<ValidationResponse>}
 */
export default async function Validation({ name, data }: ValidationParams): Promise<ValidationResponse> {

    /**
     * @var name as "mobile-legends"
     * @constant
     * @returns {object | Record<string,any>}
     */

    if (name === "mobile-legends") {
        const { userId, zoneId } = data as { userId: string, zoneId: string }
        return await CheckGames.isMobileLegends({ userId, zoneId })
    }

    /**
     * @var name as "free-fire"
     * @constant
     * @returns {object | Record<string,any>}
     */

    if (name === "free-fire") {
        const { userId } = data as { userId: string }
        return {
            status: 503,
            message: "Maintenance : API Free-Fire is currently unavailable. Please try again later."
        }
        return await CheckGames.isFreeFire({ userId })
    }

    /**
      * @var name as "point-blank"
      * @constant
      * @returns {object | Record<string,any>}
      */

    if (name === "point-blank") {
        const { userId } = data as { userId: string }
        return await CheckGames.isPointBlank({ userId })
    }

    /** If not exist on ListGames */
    return {
        status: 404,
        message: "Value of query {type} does not exist. Validation failed."
    }
}