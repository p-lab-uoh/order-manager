'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import useSWR from 'swr';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Order = {
  id: string;
  order_number: number;
  items: { name: string; qty: number }[];
  status: string;
};

const fetchOrders = async () =>{
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('order_number', { ascending: true });
  if (error) throw new Error(error.message);
  return data as Order[]; 
};

export default function AdminPage() {
  const { data: orders, error, mutate } = useSWR('orders', fetchOrders);

  React.useEffect(() => {
    const subscription = supabase
      .channel('order-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        mutate();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [mutate]);

  const handleCall = async (id: string) => {
    await supabase
      .from('orders')
      .update({ status: 'called', called_at: new Date().toISOString() })
      .eq('id', id);
      mutate(); // 更新後に再フェッチ
    };

  if (error) return <div>Error loading orders</div>;
  if (!orders) return <div>Loading...</div>;

  
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">注文一覧</h1>
      {orders.map((order) => (
        <div key={order.id} className="border p-2">
          <p>注文番号: {order.order_number}</p>
          <p>状態: {order.status}</p>
          <ul>
            {order.items.map((i) => (
              <li key={i.name}>
                {i.name} x {i.qty}
              </li>
            ))}
          </ul>
          {order.status !== 'called' && (
            <button
              onClick={() => handleCall(order.id)}
              className="bg-orange-500 text-white px-2 py-1 mt-2"
            >
              呼び出し
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
