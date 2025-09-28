export interface PointBlankParams {
    userId: string
}
export interface PointBlankResponse {
    status: number,
    message: string,
    data?: {
        username: string,
        country: string
    }
}
export interface PointBlankConfirm {
    success: boolean,
    user?: {
        userId: string
    },
    confirmationFields?: {
        userId: string,
        country: string,
        roles: [
            {
                role: string
            }
        ]
    }
}