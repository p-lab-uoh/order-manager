"use server"
import { prisma } from '@/prisma';
import { CartItem } from '@/types';
import { PrismaClient } from '@prisma/client';

export async function submitOrder(items: CartItem[]) {
    // 注文オブジェクトを作成
    const orderData = {
        items,
        status: 'pending',
    };
    
    try {
        await prisma.order.create({
            data: {
                data: JSON.stringify(orderData),
            }
        })
    } catch (e) {
        console.error('Prisma 注文送信エラー:', e);
        throw new Error('注文処理中にエラーが発生しました。'); // エラーを投げる
    }

    return { success: true, message: '注文が正常に送信されました。' };
}