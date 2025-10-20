'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

import { AddToItemButton } from './components/AddToItemButton';

// --- 型定義 ---
interface SelectedTopping {
    id: string;
    name: string;
    price: number;
    qty: number;
}

// CartItem の型定義
interface CartItem {
    name: string;
    qty: number;
    toppings: { name: string; qty: number }[]; 
}
// -----------------

// Supabaseクライアントの初期化 (元のファイルから流用)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabaseの環境変数が設定されていません');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function OrderPage() {
  // itemsの状態をトッピング情報を含む新しい型に変更
  const [items, setItems] = useState<CartItem[]>([]);
  const [success, setSuccess] = useState(false);

  // 2. トッピングと数量を含むアイテム追加処理
  const handleAddItemToCart = (itemName: string, selectedToppings: SelectedTopping[], newQty: number) => { 
    
    // トッピングの配列を、比較しやすいように整形してソート
    const toppingDataForComparison = selectedToppings
      .map(t => ({ name: t.name, qty: t.qty }))
      .sort((a, b) => a.name.localeCompare(b.name));

    setItems((prev) => {
      // 既存のアイテムを検索: メインアイテム名と、トッピングの構成が完全に一致するか
      const existing = prev.find(
        (i) => i.name === itemName && 
               JSON.stringify(i.toppings.sort((a, b) => a.name.localeCompare(b.name))) === JSON.stringify(toppingDataForComparison)
      );

      if (existing) {
        // 完全に一致するアイテムがあれば、受け取った数量 (newQty) を加算
        return prev.map((i) =>
          i === existing ? { ...i, qty: i.qty + newQty } : i
        );
      }
      
      // 一致するアイテムがなければ、新規アイテムとして追加
      return [...prev, { name: itemName, qty: newQty, toppings: toppingDataForComparison }];
    });
  };

  // 3. 注文送信ロジック (元のファイルから流用し、itemsをクリアする処理を追加)
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
      setItems([]); // 注文完了時にカートをクリア
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">P-lab 注文システム</h1>
      
      {/* 4. 統合されたボタンコンポーネントを使用 */}
      <div className="flex space-x-4">
        <AddToItemButton
          itemName="クレープ"
          onAddItem={handleAddItemToCart}
        />
        <AddToItemButton
          itemName="パンケーキ"
          onAddItem={handleAddItemToCart}
        />
      </div>

      <div>
        <h2 className="text-lg">選択中：</h2>
        {/* 5. カートの中身をトッピング数量付きで表示 */}
        {items.map((item, index) => (
          <div key={index} className="border-b pb-1 mb-2">
            <p>
                <span className="font-semibold">{item.name}</span>: {item.qty} 個
            </p>
            {/* トッピング情報も数量付きで表示 */}
            {item.toppings.length > 0 && (
              <ul className="text-sm text-gray-600 ml-4 list-disc">
                {item.toppings.map((t, tIndex) => (
                    <li key={tIndex}>{t.name}: {t.qty} 個</li>
                ))}
              </ul>
            )}
          </div>
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
};