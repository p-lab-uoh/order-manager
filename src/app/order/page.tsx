'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AddToItemButton as AddToItemButton_Pancake} from './components/AddToItemButton_Pancake';
import { AddToItemButton as AddToItemButton_Creap } from './components/AddToItemButton_Creap';

interface Topping {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
    name: string;
    qty: number;
    toppings: string[]; // カートの状態には名前のみを保存
}
// -----------------

// Supabaseクライアントの初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabaseの環境変数が設定されていません');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function OrderPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [success, setSuccess] = useState(false);

  // AddToItemButtonから呼び出される、アイテム追加処理
  const handleAddItemToCart = (itemName: string, selectedToppings: Topping[]) => {
    const toppingNames = selectedToppings.map(t => t.name).sort();

    setItems((prev) => {
      // 名前とトッピングリストが完全に一致する既存のアイテムを探す
      const existing = prev.find(
        (i) => i.name === itemName && JSON.stringify(i.toppings.sort()) === JSON.stringify(toppingNames)
      );

      if (existing) {
        // 完全に一致するアイテムがあれば数量を +1
        return prev.map((i) =>
          i === existing ? { ...i, qty: i.qty + 1 } : i
        );
      }
      
      // 一致するアイテムがなければ、新規アイテムとして追加
      return [...prev, { name: itemName, qty: 1, toppings: toppingNames }];
    });
  };
  
  const handleSubmit = async () => {
    //Supabaseのテーブル定義に応じて、itemsの構造変更が必要です
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
      setItems([]); // 注文完了時にカートをクリア
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">P-lab 注文システム</h1>
      
      {/* アイテム追加ボタン（トッピング選択機能付き） */}
      <div className="flex space-x-4">
        <AddToItemButton_Creap
          itemName="クレープ"
          onAddItem={handleAddItemToCart}
        />
        <AddToItemButton_Pancake
          itemName="パンケーキ"
          onAddItem={handleAddItemToCart}
        />
      </div>

      <div>
        <h2 className="text-lg">選択中：</h2>
        {items.map((item, index) => (
          <p key={index} className="border-b pb-1">
            <span className="font-semibold">{item.name}</span>: {item.qty} 個
            {item.toppings.length > 0 && (
              <span className="text-sm text-gray-600 ml-2">
                （トッピング: {item.toppings.join(', ')}）
              </span>
            )}
          </p>
        ))}
        {items.length === 0 && <p>カートは空です。</p>}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={items.length === 0}
      >
        注文する
      </button>

      {success && <p className="text-green-600">注文完了！</p>}
    </div>
  );
}