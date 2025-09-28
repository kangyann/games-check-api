
/**
 * @function ApiFetch
 * @constant
 * @param {Record<string,any>}
 * @returns {Promise<Record<string,any>>}
 */

type Method = "POST" | "GET"

export async function ApiFetch({ data, method, url }: { data?: Record<string, any>, method: Method, url?: string }): Promise<Record<string, any>> {
    let config: RequestInit = {
        headers: {
            "Content-Type": "application/json",
        },
        method: method,
        cache: "no-cache"
    };
    const uri = url ? url : "https://order-sg.codashop.com/initPayment.action"

    if (data) {
        config = {
            ...config,
            body: data ? JSON.stringify(data) : null,
        }
    }
    try {
        const get = await fetch(uri, config)
        return await get.json()

    } catch (error) {
        return {
            "status": 500,
            "message": "Internal Server Error."
        }
    }
}