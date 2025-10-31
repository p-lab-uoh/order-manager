"use client";

import { listAllOrders } from "@/services/orders/listAll";
import { useQuery } from "@tanstack/react-query";
import OrderCard, {
  OrderCardSkeleton,
} from "../order/components/list/OrderCard";

export default function OrderList({
  initialData,
}: {
  initialData: Awaited<ReturnType<typeof listAllOrders>>;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: listAllOrders,
    initialData,
    refetchInterval: 15000,
  });

  data.sort((a, b) => {
    const aScore = a.status === 1 ? 100 : a.status === 0 ? 50 : 0;
    const bScore = b.status === 1 ? 100 : b.status === 0 ? 50 : 0;
    return bScore - aScore;
  });

  if (isLoading)
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-xl font-bold">注文一覧</h1>
        <OrderCardSkeleton />
      </div>
    );
  if (error) return <div>Error loading orders</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 m-2">
      {data.map((order) => (
        <OrderCard key={order.id} order={order} isAdmin />
      ))}
    </div>
  );
}
