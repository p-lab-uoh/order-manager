import React, { useState } from 'react';

interface Topping {
  id: string;
  name: string;
  price: number;
}

interface ToppingModalProps {
  onConfirm: (toppings: Topping[]) => void;
  onClose: () => void;
}

// ダミーのトッピングデータ
const availableToppings: Topping[] = [
  { id: 'c1', name: 'はちみつ', price: 100 },
  { id: 'c2', name: 'チョコレートソース', price: 100 },
  { id: 'c3', name: 'ケチャップ', price: 100 },
  { id: 'c4', name: 'マスタード', price: 100 },
  { id: 'c5', name: 'メープルシロップ', price: 100 }
];

export const ToppingModal: React.FC<ToppingModalProps> = ({ onConfirm, onClose }) => {
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings(prev => {
      // 既に選択されていれば削除、そうでなければ追加
      const isSelected = prev.some(t => t.id === topping.id);
      return isSelected
        ? prev.filter(t => t.id !== topping.id) // 削除 (選択解除)
        : [...prev, topping];                     // 追加 (新規選択)
    });
  };

  const handleConfirm = () => {
    onConfirm(selectedToppings);
    // onClose() は AddToItemButton.tsx の onConfirm 処理内で呼び出されるため、ここでは不要
  };
  
  const totalPrice = selectedToppings.reduce((sum, topping) => sum + topping.price, 0);

  return (
    // ポップアップの背景
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" 
      onClick={onClose}
    >
      {/* ポップアップの本体 */}
      <div 
        className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full" 
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-4">トッピングを選択</h3>
        
        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
          {availableToppings.map((topping) => (
            <button
              key={topping.id}
              onClick={() => toggleTopping(topping)}
              className={`w-full text-left p-3 border rounded-lg transition duration-150 ${
                selectedToppings.some(t => t.id === topping.id)
                  ? 'bg-indigo-500 text-white border-indigo-500'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {topping.name} (+{topping.price}円)
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4 pt-3 border-t">
            <span className="font-bold">合計金額（トッピングのみ）:</span>
            <span className="text-lg font-bold text-indigo-600">{totalPrice}円</span>
        </div>

        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            キャンセル
          </button>
          <button 
            onClick={handleConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            確定 ({selectedToppings.length} 種)
          </button>
        </div>
      </div>
    </div>
  );
};