"use server"

import { prisma } from "@/prisma";
import { formatStatus } from "@/utils";

export const fetchOrders = async () =>{
  const orders = await prisma.order.findMany()
  return orders.map(o => ({
    id: o.id,
    status: formatStatus(o.status),
    ...JSON.parse(o.data as string)
  }))
};