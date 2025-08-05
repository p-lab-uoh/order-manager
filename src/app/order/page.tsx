'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabaseの環境変数が設定されていません');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function OrderPage() {
  const [items, setItems] = useState<{ name: string; qty: number }[]>([]);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const { error } = await supabase.from('orders').insert([
      {
        items,
        status: 'pending',
      },
    ]);
    if (error) {
			// エラー内容を確認
      alert('注文に失敗しました');
			alert(JSON.stringify(error, null, 2)); // エラーメッセージを表示
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">P-lab 注文システム</h1>
      {/* 選択用ボタン */}
      {['クレープ', 'パンケーキ', 'ハラールカレー'].map((item) => (
        <button
          key={item}
          onClick={() =>
            setItems((prev) => {
              const existing = prev.find((i) => i.name === item);
              if (existing) {
                return prev.map((i) =>
                  i.name === item ? { ...i, qty: i.qty + 1 } : i
                );
              }
              return [...prev, { name: item, qty: 1 }];
            })
          }
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {item} を追加
        </button>
      ))}

      <div>
        <h2 className="text-lg">選択中：</h2>
        {items.map((item) => (
          <p key={item.name}>
            {item.name}: {item.qty}
          </p>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        注文する
      </button>

      {success && <p className="text-green-600">注文完了！</p>}
    </div>
  );
}
