import React, { useState } from 'react';
import { ToppingModal } from './ToppingModal'; 

// --- 型定義 ---
interface SelectedTopping { id: string; name: string; price: number; qty: number; }
// -----------------

interface AddToItemButtonProps {
  itemName: string; 
  onAddItem: (item: string, toppings: SelectedTopping[], qty: number) => void;
}

export const AddToItemButton: React.FC<AddToItemButtonProps> = ({ itemName, onAddItem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmToppings = (toppings: SelectedTopping[], qty: number) => {
    onAddItem(itemName, toppings, qty);
    setIsModalOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-150 ease-in-out"
      >
        {itemName} を追加 (トッピング/個数選択)
      </button>

      {isModalOpen && (
        <ToppingModal 
          itemName={itemName} 
          onConfirm={handleConfirmToppings}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
};