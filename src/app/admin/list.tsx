"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { callOrder } from "@/services/orders/call";
import { listAllOrders } from "@/services/orders/listAll";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function OrderList({
  initialData,
}: {
  initialData: Awaited<ReturnType<typeof listAllOrders>>;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: listAllOrders,
    initialData,
    // refetchInterval: 5000,
  });

  const queryClient = useQueryClient();

  const callOrderMutation = useMutation({
    mutationFn: (orderId: number) => callOrder(orderId, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">注文一覧</h1>
      {data.map((order) => (
        <Card key={order.id} className="border p-2">
          <CardHeader>
            <CardTitle>注文番号: {order.id}</CardTitle>
            <CardDescription>状態: {order.status}</CardDescription>
          </CardHeader>
          <CardContent>
            {order.items.map((item) => (
              <div key={`${order.id}-${item.name}-${Math.random()}`}>
                {item.name}
                <p>トッピング:</p>
                {item.toppings.map((topping) => (
                  <div key={topping.name}>
                    {topping.name} x {topping.quantity}
                  </div>
                ))}
              </div>
            ))}
            <Button onClick={() => callOrderMutation.mutate(order.id)}>
              呼び出し
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
