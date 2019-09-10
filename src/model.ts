export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    tax: Tax;
}
export interface Tax {
    state: number;
    county: number;
    city: number;
    total: number;
}
export interface PosState {
    products: Array<Product>;
    cart: Array<Product>;
    subtotal: number;
    totalTax: number;
    totalStateTax: number;
    totalCountyTax: number;
    totalCityTax: number;
    total: number;
    amountPaidByCustomer: number;
    customerChange: number;
}
