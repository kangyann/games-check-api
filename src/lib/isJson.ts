export async function isJson(request: Request): Promise<Record<string, string | number | boolean>> {
    try {
        const data: Record<string, any> = await request.json()


        if (Object.keys(data).length == 0) {
            return {
                message: "Required data body {userId} or {serverId}.",
                status: 400,
                isValid: false
            }
        }
        return {
            isValid: true,
            ...data
        };
    } catch (error) {
        return {
            message: "Invalid JSON.",
            status: 400,
            isValid: false
        }
    }
}