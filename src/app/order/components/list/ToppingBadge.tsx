import { Badge } from "@/components/ui/badge";

const colored = (name: string) => {
  switch (name) {
    case "チョコソース":
      return "bg-[#6C3524]";
    case "蜂蜜":
      return "bg-[#E7BB5E]";
    case "メープルシロップ":
      return "bg-[#C55A39]";
    case "ケチャップ":
      return "bg-[#EA5549]";
    case "マスタード":
      return "bg-[#E1AD01]";
  }
};

export function ToppingBadge(props: { name: string; quantity: number }) {
  return (
    <div className="flex items-center gap-2">
      <Badge className={colored(props.name)}>{props.name}</Badge>x{" "}
      {props.quantity}
    </div>
  );
}
