export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number; // Note: number, not string
  stockQty: number; // This matches what ProductsTable expects
  reorderLevel: number;
  status?: "Active" | "Inactive" | "Out of Stock";
  description?: string;
}

export type ProductFormData = {
  name: string;
  sku: string;
  category: string;
  price: string; // Form data comes as string
  stockQty: number;
  reorderLevel: number;
  status?: "Active" | "Inactive" | "Out of Stock";
};