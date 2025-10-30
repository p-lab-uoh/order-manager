"use server";
import { prisma } from "@/prisma";

export const listAllWithoutCompletedOrders = async () => {
  const orders = await prisma.order.findMany({
    where: {
      status: {
        not: 2,
      },
    },
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
    tag: o.tag,
    items: o.items.map((item) => ({
      name: item.name,
      toppings: item.toppings.map((topping) => ({
        name: topping.name,
        quantity: topping.quantity,
      })),
    })),
  }));
};

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
    tag: o.tag,
    items: o.items.map((item) => ({
      name: item.name,
      toppings: item.toppings.map((topping) => ({
        name: topping.name,
        quantity: topping.quantity,
      })),
    })),
  }));
};
