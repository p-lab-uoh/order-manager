"use server";
import { prisma } from "@/prisma";

export const callOrder = async (id: number, status: number) => {
  try {
    await prisma.order.update({
      where: { id },
      data: {
        status,
      },
    });
  } catch (e) {
    console.error("Prisma 注文更新エラー:", e);
    throw new Error("注文更新中にエラーが発生しました。");
  }
};
