/**
 * @interface ValidationParams
 * @property {string} name
 * @property {Record<string, string>} data
 */

export interface ValidationParams {
    name: string,
    data: Record<string, string>
}
/**
 * @interface ValidationResponse
 * @property {number} status
 * @property {string} message
 * @property {Record<string, any>} data
 */
export interface ValidationResponse {
    status: number,
    message: string,
    data?: Record<string, any>
}