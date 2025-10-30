"use server";
import { prisma } from "@/prisma";

export const listAllOrders = async () => {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          toppings: true,
        },
      },
    },
  });

  return orders.map((o) => ({
    id: o.id,
    status: o.status,
    items: o.items.map((item) => ({
      name: item.name,
      toppings: item.toppings.map((topping) => ({
        name: topping.name,
        quantity: topping.quantity,
      })),
    })),
  }));
};
