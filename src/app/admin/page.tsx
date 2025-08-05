'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

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

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('order_number', { ascending: true });
      setOrders(data as Order[]);
    };

    fetchOrders();

    const sub = supabase
      .channel('order-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, []);

  const handleCall = async (id: string) => {
    await supabase
      .from('orders')
      .update({ status: 'called', called_at: new Date().toISOString() })
      .eq('id', id);
  };

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
