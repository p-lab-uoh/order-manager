import { CartItem } from '@/types';
import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントの初期化をここに移動
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabaseの環境変数が設定されていません');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 注文データを送信する関数を定義
export async function submitOrder(items: CartItem[]) {
    
    // 注文オブジェクトを作成
    const orderData = {
        items,
        status: 'pending',
    };

    const { data, error } = await supabase.from('orders').insert([orderData]);

    if (error) {
        // エラーの詳細をログに残すなどの処理をここで行う
        console.error('Supabase 注文送信エラー:', error);
        throw new Error('注文処理中にエラーが発生しました。'); // エラーを投げる
    }

    return data; // 成功データを返す
}