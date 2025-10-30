export interface Topping {
  name: string;
  price: number;
}

export interface SelectedTopping extends Topping {
  qty: number;
}

export interface CartItem {
  name: string;
  toppings: SelectedTopping[]
  price: number;
}