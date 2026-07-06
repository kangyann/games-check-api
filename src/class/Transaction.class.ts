import { PrismaConnect } from "@/lib/prisma-config";

export default class TransactionClass {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
  public async Check(): Promise<{ status: number; message: string; data?: any }> {
    try {
      const checking = await PrismaConnect.transaction.findFirstOrThrow({
        where: { targetId: this.userId },
      });
      return {
        status: 200,
        message: "Data retrieved successfully.",
        data: {
          username: checking.nickname,
          userId: checking.targetId,
          serverId: checking.serverId,
        },
      };
    } catch (error) {
      console.log(error);
      return { status: 404, message: "Transaction not found." };
    }
  }
  public async Create(userId: string, username: string, gameId: number, serverId?: string) {
    console.log(`Creating transaction for userId: ${userId}, username: ${username}, gameId: ${gameId}, serverId: ${serverId}`);
    try {
      await PrismaConnect.transaction.create({
        data: {
          nickname: username,
          listGamesId: gameId,
          targetId: userId,
          serverId: serverId,
          status: "SUCCESS",
        },
      });
      return { status: 200, message: "Transaction created successfully." };
    } catch (error) {
      console.log(error);
      return { status: 500, message: "Error creating transaction." };
    }
  }
}
