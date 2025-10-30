"use server";
import { prisma } from "@/prisma";
import { CartItem } from "@/types";

export const createOrder = async (items: CartItem[]) => {
  try {
    await prisma.order.create({
      data: {
        status: 0,
        items: {
          create: items.map((item) => ({
            name: item.name,
            price: item.price,
            toppings: {
              create: item.toppings.map((topping) => ({
                name: topping.name,
                quantity: topping.qty,
              })),
            },
          })),
        },
      },
    });
  } catch (e) {
    console.error("Prisma 注文作成エラー:", e);
    throw new Error("注文作成中にエラーが発生しました。");
  }
};
