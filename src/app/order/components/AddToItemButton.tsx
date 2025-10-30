import React, { useState } from 'react';
import { ToppingModal } from './ToppingModal'; 
import { SelectedTopping } from '@/types';

interface AddToItemButtonProps {
  itemName: string; 
  onAddItem: (item: string, toppings: SelectedTopping[]) => void;
}

export const AddToItemButton: React.FC<AddToItemButtonProps> = ({ itemName, onAddItem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmToppings = (toppings: SelectedTopping[]) => {
    onAddItem(itemName, toppings);
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