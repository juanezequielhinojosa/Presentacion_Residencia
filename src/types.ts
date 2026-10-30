export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  category?: 'figuras' | 'decoracion' | 'gadgets' | 'stl' | string;
  image_url?: string;
  mercadopago_url?: string;
  badge?: string;
  material?: string;
  printTime?: string;
  weightGrams?: number;
  layerHeight?: string;
  infill?: string;
  colorOptions?: string[];
  dimensions?: string;
  rating?: number;
  salesCount?: number;
}

export interface CartItem {
  id?: string | number;
  name: string;
  price: number;
  qty: number;
  image_url?: string;
  selectedColor?: string;
  selectedMaterial?: string;
}

export interface QuoteData {
  material: string;
  weightGrams: number;
  infillPercent: number;
  quality: 'ultra' | 'standard' | 'draft';
  finish: 'raw' | 'primed' | 'painted';
  quantity: number;
  notes: string;
}
