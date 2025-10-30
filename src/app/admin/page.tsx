'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import useSWR from 'swr';
import { prisma } from '@/prisma';
import { fetchOrders } from '@/services/fetchOrders';
import { formatStatus } from '@/utils';

// type Order = {
//   id: string;
//   order_number: number;
//   items: { name: string; qty: number }[];
//   status: string;
// };

export default function AdminPage() {
  const { data: orders, error, mutate } = useSWR('orders', fetchOrders);
  
  useEffect(() => {
    console.log(orders)
  }, [orders])

  if (error) return <div>Error loading orders</div>;
  if (!orders) return <div>Loading...</div>;

  // TODO: mutate after calling

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
              {order.toppings.map((topping: { name: string; qty: number }) => (
                <span key={topping.name}>
                  {topping.name}({topping.qty}){' '}
                </span>
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
