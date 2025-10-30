"use client";

import { useState } from "react";
import { AddToItemButton } from "./components/AddToItemButton";
import { CartItem, SelectedTopping } from "@/types";
import { createOrder } from "@/services/orders/create";
import { MENU_ITEMS } from "@/menu";

export default function OrderPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [success, setSuccess] = useState(false);

  const handleAddItemToCart = (
    itemName: "パンケーキ" | "クレープ",
    selectedToppings: SelectedTopping[]
  ) => {
    const toppingDataForComparison = selectedToppings.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.name === itemName &&
          JSON.stringify(
            i.toppings.sort((a, b) => a.name.localeCompare(b.name))
          ) === JSON.stringify(toppingDataForComparison)
      );

      if (existing) {
        return prev.map((i) => (i === existing ? { ...i } : i));
      }

      const price =
        MENU_ITEMS.find((item) => item.name === itemName)?.price || 0;

      // 一致するアイテムがなければ、新規アイテムとして追加
      return [
        ...prev,
        { name: itemName, toppings: toppingDataForComparison, price },
      ];
    });
  };

  const handleSubmit = async () => {
    try {
      await createOrder(items);

      setSuccess(true);
      setItems([]);
    } catch (e) {
      // サービス層から投げられたエラーを処理
      alert("注文に失敗しました。管理者にお問い合わせください。");
      setSuccess(false);
    }
  };
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">P-lab 注文システム</h1>

      {/* 4. 統合されたボタンコンポーネントを使用 */}
      <div className="flex space-x-4">
        <AddToItemButton itemName="クレープ" onAddItem={handleAddItemToCart} />
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
              <span className="font-semibold">{item.name}</span> {item.price} 円
            </p>
            {/* トッピング情報も数量付きで表示 */}
            {item.toppings.length > 0 && (
              <ul className="text-sm text-gray-600 ml-4 list-disc">
                {item.toppings.map((t, tIndex) => (
                  <li key={tIndex}>
                    {t.name}: {t.qty} 個
                  </li>
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
}
