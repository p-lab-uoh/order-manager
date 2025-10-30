import React from "react";
import { listAllOrders } from "@/services/orders/listAll";
import OrderList from "./list";

export default async function AdminPage() {
  const initialData = await listAllOrders();
  return <OrderList initialData={initialData} />;
}
