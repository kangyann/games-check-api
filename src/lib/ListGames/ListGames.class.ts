import { PrismaConnect } from "../prisma-config";
export type PrefixTypes = "mobile-legends" | "free-fire" | "point-blank"

interface PrismaListGames {
    name: string
    prefix: string
}
export interface ClassListGamesResponse {
    message: string,
    status: number,
    data?: PrismaListGames
}

export default class ListGamesClass {

    async findFirst({ prefix }: { prefix: PrefixTypes }): Promise<ClassListGamesResponse> {
        try {
            const IsHaveGame: PrismaListGames = await PrismaConnect.listGames.findFirstOrThrow({
                where: { prefix },
                select: {
                    name: true,
                    prefix: true
                }
            })
            return { message: "Game found.", status: 200, data: IsHaveGame }
        } catch (error) {
            console.log(error)
            return { message: "Game not found.", status: 404 }
        }
    }

}