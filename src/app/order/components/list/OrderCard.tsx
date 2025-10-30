"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Item } from "@/components/ui/item";
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

  return (
    <div className={`border rounded-md shadow-md`}>
      <div
        className={`flex items-center justify-evenly p-4 border-b ${
          order.status === 0
            ? "bg-orange-200"
            : order.status === 1
            ? "bg-green-200"
            : "bg-gray-200"
        }`}
      >
        <div className="flex text-8xl font-extrabold">{order.id}</div>
        {isAdmin && (
          <div className="flex flex-col gap-2">
            <Button
              disabled={order.status !== 0}
              className="bg-green-500"
              onClick={() => callOrderMutation.mutate(order.id)}
            >
              呼び出し
            </Button>
            <Button
              disabled={order.status !== 1}
              variant="destructive"
              onClick={() => completeOrderMutation.mutate(order.id)}
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
        <div className="flex">
          <div className="flex flex-col max-w-64 md:min-w-96 gap-2">
            {order.items.map((item) => (
              <Item
                key={`${order.id}-${item.name}-${Math.random()}`}
                variant="outline"
                className="flex flex-col items-center"
              >
                <div className="text-xl font-bold">{item.name}</div>
                <div className="flex flex-wrap gap-2">
                  {item.toppings.map((topping) => (
                    <div key={topping.name} className="flex items-center gap-2">
                      <ToppingBadge
                        name={topping.name}
                        quantity={topping.quantity}
                      />
                    </div>
                  ))}
                </div>
              </Item>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
