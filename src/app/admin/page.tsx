"use client";

import React from "react";
import useSWR from "swr";
import { listAllOrders } from "@/services/orders/listAll";

export default function AdminPage() {
  const { data: orders, error, mutate } = useSWR("orders", listAllOrders);

  if (error) return <div>Error loading orders</div>;
  if (!orders) return <div>Loading...</div>;

  // TODO: polling with tanstack

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">注文一覧</h1>
      {orders.map((order) => (
        <div key={order.id} className="border p-2">
          <p>注文番号: {order.id}</p>
          <p>状態: {order.status}</p>
          {order.items.map((order) => (
            <div key={order.name}>
              {order.name}
              <p>トッピング:</p>
              {order.toppings.map((topping) => (
                <div key={topping.name}>
                  {topping.name} x {topping.quantity}
                </div>
              ))}
            </div>
          ))}
          {/* <ul>
            {order.items.map((i) => (
              <li key={i.name}>
                {i.name} x {i.qty}
              </li>
            ))}
          </ul> */}
          {/* {order.status !== 'called' && (
            <button
              onClick={() => handleCall(order.id)}
              className="bg-orange-500 text-white px-2 py-1 mt-2"
            >
              呼び出し
            </button>
          )} */}
        </div>
      ))}
    </div>
  );
}
