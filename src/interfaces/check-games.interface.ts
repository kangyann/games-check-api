
export interface CheckGamesParams {
    data: {
        userId: string,
        serverId: string
    }
    prefix: string
}
export interface CheckGamesResponse {
    status: number,
    message: string,
    data?: { username: string } | Record<string, any>
}
