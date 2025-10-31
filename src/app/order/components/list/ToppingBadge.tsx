import { Badge } from "@/components/ui/badge";

const colored = (name: string) => {
  switch (name) {
    case "チョコソース":
      return "bg-[#6C3524]";
    case "蜂蜜":
    case "はちみつ":
      return "bg-orange-200 text-base-800";
    case "メープルシロップ":
      return "bg-[#C55A39]";
    case "ケチャップ":
      return "bg-red-500";
    case "マスタード":
      return "bg-yellow-500";
    case "キャラメル":
      return "bg-teal-400";
  }
};

const icons = (name: string) => {
  switch (name) {
    case "チョコソース":
      return "🍫";
    case "蜂蜜":
    case "はちみつ":
      return "🍯";
    case "メープルシロップ":
      return "🍁";
    case "ケチャップ":
      return "🍅";
    case "マスタード":
      return "🌭";
    case "キャラメル":
      return "🍬";
  }
};

export function ToppingBadge(props: { name: string }) {
  return (
    <div className="flex items-center gap-2">
      <Badge className={colored(props.name)}>
        {icons(props.name)} {props.name}
      </Badge>
    </div>
  );
}
