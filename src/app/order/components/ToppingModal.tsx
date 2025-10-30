import React, { useState } from 'react';
import { Topping, SelectedTopping } from '@/types';

// トッピングデータ：アイテム名でキー分け
const TOPPINGS_DATA: { [key: string]: Topping[] } = {
    'クレープ': [
        { name: '蜂蜜', price: 200 },
        { name: 'メープルシロップ', price: 200 },
        { name: 'チョコソース', price: 200 },
        { name: 'ケチャップ', price: 200 },
        { name: 'マスタード', price: 200 },
    ],
    'パンケーキ': [
        { name: '蜂蜜', price: 200 },
        { name: 'メープルシロップ', price: 200 },
        { name: 'チョコソース', price: 200 },
        { name: 'ケチャップ', price: 200 },
        { name: 'マスタード', price: 200 },
    ],
};

interface ToppingModalProps {
  itemName: string; 
  onConfirm: (toppings: SelectedTopping[]) => void; 
  onClose: () => void;
}

export const ToppingModal: React.FC<ToppingModalProps> = ({ itemName, onConfirm, onClose }) => {
  
  // 受け取ったアイテム名に対応するトッピングリストを取得
  const availableToppings = TOPPINGS_DATA[itemName] || []; 
  
  
  const [selectedToppingQuantities, setSelectedToppingQuantities] = useState<SelectedTopping[]>([]);
  React.useEffect(() => {
    console.log(selectedToppingQuantities);
  }, [selectedToppingQuantities])
  // ... (handleToppingQuantityChange, decrementItemQuantity, incrementItemQuantity, handleConfirm, totalToppingPrice のロジック)

  const handleToppingQuantityChange = (toppingName: Topping['name'], operator: 'plus' | 'minus')=> {
    setSelectedToppingQuantities((prev) => {
      const delta = operator === 'plus' ? 1 : -1;
      const existingTopping = prev.find(t => t.name === toppingName);
      const currentQty = existingTopping?.qty || 0;
      const newQty = Math.max(0, currentQty + delta);

      if (newQty === 0) {
        return prev.filter(t => t.name !== toppingName);
      }
      
      const toppingPrice = availableToppings.find(t => t.name === toppingName)?.price || 0;
      if (existingTopping) {
        return prev.map(t =>
          t.name === toppingName ? { ...t, qty: newQty } : t
        );
      } else {
        return [...prev, { name: toppingName, price: toppingPrice, qty: newQty }];
      }
    })
  };

  const handleConfirm = () => {
    onConfirm(selectedToppingQuantities);
  };
  
  const totalToppingPrice = selectedToppingQuantities
    .map(t => ({ qty: t.qty, price: t.price }))
    .reduce((sum, t) => sum + (t.price * t.qty), 0);
  
  const totalItemPrice = totalToppingPrice


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-semibold mb-4">{itemName}のトッピングを選択</h3> {/* アイテム名を表示 */}
        
        {/* トッピング選択エリア */}
        <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2 border-b pb-4">
          <p className="font-medium text-sm">トッピング選択:</p>
          {availableToppings.map((topping) => {
            const currentQty = selectedToppingQuantities.find(t => t.name === topping.name)?.qty || 0;
            return (
              <div
                key={topping.name}
                className={`w-full flex justify-between items-center p-3 border rounded-lg transition duration-150 ${
                  currentQty > 0
                    ? 'bg-indigo-500 text-white border-indigo-500'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                }`}
              >
                <span className="font-medium">{topping.name} (+{topping.price}円)</span>
                
                {/* 個数選択ボタン */}
                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => handleToppingQuantityChange(topping.name, 'minus')}
                        disabled={currentQty === 0}
                        className="p-1 w-6 h-6 bg-red-400 text-white rounded-md disabled:bg-gray-400 flex items-center justify-center"
                    >−
                    </button>
                    <span className="text-base font-bold w-4 text-center">{currentQty}</span>
                    <button
                        onClick={() => handleToppingQuantityChange(topping.name, 'plus')}
                        className="p-1 w-6 h-6 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center justify-center"
                    >+
                    </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* メインアイテム数量選択 */}
        {/* <div className="flex justify-between items-center mb-4">
            <span className="font-bold">メインアイテム個数:</span>
            <div className="flex items-center space-x-2">
                <button onClick={decrementItemQuantity} disabled={mainItemQuantity <= 1} className="px-3 py-1 bg-red-500 text-white rounded-md disabled:bg-gray-400">−
                </button>
                <span className="text-xl font-bold w-8 text-center">{mainItemQuantity}</span>
                <button onClick={incrementItemQuantity} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">+
                </button>
            </div>
        </div> */}

        <div className="flex justify-between items-center mb-4 pt-3 border-t">
            <span className="font-bold">トッピング総額:</span>
            <span className="text-lg font-bold text-indigo-600">{totalItemPrice}円</span>
        </div>

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">キャンセル
          </button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50">
            確定
          </button>
        </div>
      </div>
    </div>
  );
};