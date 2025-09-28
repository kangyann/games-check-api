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

        if (!userId || !zoneId) {
            return {
                status: 404,
                message: "[ MOBILE-LEGENDS ] - invalid parameters {userId} or {zoneId}."
            }
        }

        return await CheckGames.isMobileLegends({ userId, zoneId })
    }

    /**
     * @var name as "free-fire"
     * @constant
     * @returns {object | Record<string,any>}
     */

    if (name === "free-fire") {
        const { userId } = data as { userId: string }

        if (!userId) {
            return {
                status: 404,
                message: "[ FREE-FIRE ] - invalid parameters {userId}."
            }
        }

        return await CheckGames.isFreeFire({ userId })
    }

    if (name === "point-blank") {
        const { userId } = data as { userId: string }

        if (!userId) {
            return {
                status: 404,
                message: "[ POINT-BLANK ] - invalid parameters {userId}."
            }
        }
        return await CheckGames.isPointBlank({ userId })
    }
    return {
        status: 404,
        message: "Value of query {type} does not exist. Validation failed."
    }
}