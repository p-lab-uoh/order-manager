import React, { useState } from 'react';

// --- 型定義 ---
interface Topping { id: string; name: string; price: number; }
interface SelectedTopping { id: string; name: string; price: number; qty: number; }
// -----------------

// トッピングデータ：アイテム名でキー分け
const TOPPINGS_DATA: { [key: string]: Topping[] } = {
    'クレープ': [
        { id: 'c1', name: '蜂蜜', price: 200 },
        { id: 'c2', name: 'メープルシロップ', price: 200 },
        { id: 'c3', name: 'チョコソース', price: 200 },
        { id: 'c4', name: 'ケチャップ', price: 200 },
        { id: 'c5', name: 'マスタード', price: 200 },
    ],
    'パンケーキ': [
        { id: 'p1', name: '蜂蜜', price: 200 },
        { id: 'p2', name: 'メープルシロップ', price: 200 },
        { id: 'p3', name: 'チョコソース', price: 200 },
        { id: 'p4', name: 'ケチャップ', price: 200 },
        { id: 'p5', name: 'マスタード', price: 200 },
    ],
};

interface ToppingModalProps {
  itemName: string; 
  onConfirm: (toppings: SelectedTopping[], qty: number) => void; 
  onClose: () => void;
}

export const ToppingModal: React.FC<ToppingModalProps> = ({ itemName, onConfirm, onClose }) => {
  
  // 受け取ったアイテム名に対応するトッピングリストを取得
  const availableToppings = TOPPINGS_DATA[itemName] || []; 
  
  
  const [selectedToppingQuantities, setSelectedToppingQuantities] = useState<{ [id: string]: number }>({});
  const [mainItemQuantity, setMainItemQuantity] = useState(1); 
  
  // ... (handleToppingQuantityChange, decrementItemQuantity, incrementItemQuantity, handleConfirm, totalToppingPrice のロジック)

  const handleToppingQuantityChange = (toppingId: string, delta: 1 | -1) => {
    setSelectedToppingQuantities(prev => {
      const currentQty = prev[toppingId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      if (newQty === 0) {
        const { [toppingId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [toppingId]: newQty };
    });
  };
  
  const decrementItemQuantity = () => { setMainItemQuantity(prev => Math.max(1, prev - 1)); };
  const incrementItemQuantity = () => { setMainItemQuantity(prev => prev + 1); };

  const handleConfirm = () => {
    const finalToppings: SelectedTopping[] = availableToppings
      .filter(t => selectedToppingQuantities[t.id] > 0)
      .map(t => ({
        ...t,
        qty: selectedToppingQuantities[t.id],
      }));
      
    onConfirm(finalToppings, mainItemQuantity);
  };
  
  const totalToppingPrice = availableToppings.reduce((sum, topping) => {
    const qty = selectedToppingQuantities[topping.id] || 0;
    return sum + (topping.price * qty);
  }, 0);
  
  const totalItemPrice = totalToppingPrice * mainItemQuantity;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-semibold mb-4">{itemName}のトッピングを選択</h3> {/* アイテム名を表示 */}
        
        {/* トッピング選択エリア */}
        <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2 border-b pb-4">
          <p className="font-medium text-sm">トッピング選択:</p>
          {availableToppings.map((topping) => {
            const currentQty = selectedToppingQuantities[topping.id] || 0;
            return (
              <div
                key={topping.id}
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
                        onClick={() => handleToppingQuantityChange(topping.id, -1)}
                        disabled={currentQty === 0}
                        className="p-1 w-6 h-6 bg-red-400 text-white rounded-md disabled:bg-gray-400 flex items-center justify-center"
                    >−
                    </button>
                    <span className="text-base font-bold w-4 text-center">{currentQty}</span>
                    <button
                        onClick={() => handleToppingQuantityChange(topping.id, 1)}
                        className="p-1 w-6 h-6 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center justify-center"
                    >+
                    </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* メインアイテム数量選択 */}
        <div className="flex justify-between items-center mb-4">
            <span className="font-bold">メインアイテム個数:</span>
            <div className="flex items-center space-x-2">
                <button onClick={decrementItemQuantity} disabled={mainItemQuantity <= 1} className="px-3 py-1 bg-red-500 text-white rounded-md disabled:bg-gray-400">−
                </button>
                <span className="text-xl font-bold w-8 text-center">{mainItemQuantity}</span>
                <button onClick={incrementItemQuantity} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">+
                </button>
            </div>
        </div>

        <div className="flex justify-between items-center mb-4 pt-3 border-t">
            <span className="font-bold">トッピング総額:</span>
            <span className="text-lg font-bold text-indigo-600">{totalItemPrice}円</span>
        </div>

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">キャンセル
          </button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50" disabled={mainItemQuantity < 1}>
            {mainItemQuantity} 個を確定
          </button>
        </div>
      </div>
    </div>
  );
};