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
          ...(checking.serverId && { serverId: checking.serverId }),
          ...(checking.region && { region: checking.region }),
        },
      };
    } catch (error) {
      return { status: 404, message: "Transaction not found." };
    }
  }

  public async Create(data: {
    nickname: string;
    listGamesId: number;
    targetId: string;
    serverId: string;
    region?: string;
  }) {
    console.log(
      `Creating transaction for userId: ${data.targetId}, username: ${data.nickname}, serverId: ${data.serverId}`,
    );
    try {
      await PrismaConnect.transaction.create({
        data: { ...data, status: "SUCCESS" },
      });
      return { status: 200, message: "Transaction created successfully." };
    } catch (error) {
      return { status: 500, message: "Error creating transaction." };
    }
  }
}
