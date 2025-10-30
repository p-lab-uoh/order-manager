"use client";
import { listAllWithoutCompletedOrders } from "@/services/orders/listAll";
import { useQuery } from "@tanstack/react-query";
import OrderCard, {
  OrderCardSkeleton,
} from "./order/components/list/OrderCard";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: listAllWithoutCompletedOrders,
    refetchInterval: 15000,
  });

  if (isLoading)
    return (
      <div className="p-4 space-y-4">
        <OrderCardSkeleton></OrderCardSkeleton>
      </div>
    );
  if (error) return <div>Error loading orders</div>;
  if (!data) return <div>No orders found</div>;

  const displayOrders = data.toSorted((a, b) => b.status - a.status);

  if (displayOrders.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <span className="text-xl">😭</span>
          </EmptyMedia>
          <EmptyTitle>注文がありません...</EmptyTitle>
          <EmptyDescription>
            Pancake Lab / AIクレープは3日とも元気に営業中！！！！！！！！！！
          </EmptyDescription>
          <EmptyContent>
            買いに来てね！！！！！！！！！！！！！！！！！！
          </EmptyContent>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {displayOrders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
