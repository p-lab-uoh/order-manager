import React, { useState } from 'react';
import { ToppingModal } from './ToppingModal_Creap'; 

interface Topping {
  id: string;
  name: string;
  price: number;
}

interface AddToItemButtonProps {
  itemName: string; // どのアイテムに対するボタンか
  onAddItem: (item: string, toppings: Topping[]) => void;
}

export const AddToItemButton: React.FC<AddToItemButtonProps> = ({ itemName, onAddItem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modalから確定ボタンが押されたときに実行される関数
  const handleConfirmToppings = (toppings: Topping[]) => {
    // 親（page.tsx）にアイテム名と選択されたトッピングを渡す
    onAddItem(itemName, toppings); 
    setIsModalOpen(false); // モーダルを閉じる
  };

  return (
    <>
      {/* クリックでモーダルを開くボタン */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-150 ease-in-out"
      >
        {itemName} を追加 (トッピング選択へ)
      </button>

      {/* isModalOpen が true のときだけ ToppingModal を表示 */}
      {isModalOpen && (
        <ToppingModal 
          onConfirm={handleConfirmToppings}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
};