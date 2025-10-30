export interface Topping {
  name: string;
}

export interface SelectedTopping extends Topping {
  qty: number;
}

export interface CartItem {
  name: string;
  toppings: SelectedTopping[];
  price: number;
}
