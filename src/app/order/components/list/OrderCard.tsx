"use client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { callOrder } from "@/services/orders/call";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToppingBadge } from "./ToppingBadge";

export function OrderCardSkeleton() {
  return (
    <Card className="border p-2 animate-pulse">
      <CardHeader>
        <CardTitle className="h-4 w-1/4 bg-gray-300 rounded"></CardTitle>
        <CardDescription className="h-3 w-1/6 bg-gray-300 rounded mt-2"></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-3 w-3/4 bg-gray-300 rounded mt-2"></div>
        <div className="h-3 w-2/4 bg-gray-300 rounded mt-2"></div>
        <div className="h-8 w-1/4 bg-gray-300 rounded mt-4"></div>
      </CardContent>
    </Card>
  );
}

export default function OrderCard(props: {
  order: {
    id: number;
    status: number;
    tag: number;
    items: {
      name: string;
      toppings: {
        name: string;
        quantity: number;
      }[];
    }[];
  };
  isAdmin?: boolean;
}) {
  const { order, isAdmin } = props;

  const queryClient = useQueryClient();

  const callOrderMutation = useMutation({
    mutationFn: (orderId: number) => callOrder(orderId, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const completeOrderMutation = useMutation({
    mutationFn: (orderId: number) => callOrder(orderId, 2),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleOrderCall = () => {
    callOrderMutation.mutate(order.id);
  };

  const handleOrderComplete = () => {
    completeOrderMutation.mutate(order.id);
  };

  return (
    <div className={`border rounded-md shadow-md`}>
      <div
        className={`flex items-center justify-evenly p-3 border-b ${
          order.status === 0
            ? "bg-orange-200"
            : order.status === 1
            ? "bg-green-200"
            : "bg-gray-200"
        }`}
      >
        <div className="flex text-8xl font-extrabold">{order.tag}</div>
        {isAdmin && (
          <div className="flex flex-col gap-2">
            <Button
              disabled={order.status !== 0}
              className="bg-green-500"
              onClick={handleOrderCall}
            >
              呼び出し
            </Button>
            <Button
              disabled={order.status !== 1}
              variant="destructive"
              onClick={handleOrderComplete}
            >
              完了
            </Button>
          </div>
        )}
        <Badge
          className={`text-3xl ${
            order.status === 0
              ? "bg-orange-500 text-white"
              : order.status === 1
              ? "bg-green-500 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          {order.status === 0
            ? "調理中"
            : order.status === 1
            ? "完成！"
            : "完了"}
        </Badge>
      </div>
      <div className="flex justify-center items-center py-2 relative">
        <div className="flex flex-col gap-2 w-80">
          {order.items.map((item) => (
            <div
              key={`${order.id}-${item.name}-${Math.random()}`}
              className="border rounded-md p-2 flex justify-between items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={`/${
                    item.name === "パンケーキ" ? "pancake" : "crepe"
                  }.svg`}
                  alt={item.name}
                  width={48}
                  height={48}
                />
                <div className="text-xl font-bold">{item.name}</div>
              </div>
              <div className="flex flex-col gap-1 items-end">
                {item.toppings.flatMap((topping) =>
                  Array.from({ length: topping.quantity }).map((_, i) => (
                    <ToppingBadge
                      key={`${topping.name}-${i}`}
                      name={topping.name}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
