export class InventoryOrder {
  note: string;
  products: [
    {
      productId: string,
      quantity: string
    }
  ]
  warehouseId: string;
}