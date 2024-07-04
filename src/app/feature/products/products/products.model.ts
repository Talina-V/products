export interface Product {
  id: number;
  name: string;
  expiration_type: 'expirable' | 'non_expirable';
  category_id: number;
  fields: Field[];
  manufacture_date: string;
  expiration_date: string | null;
  comment: string;
  created_at?: string;
  updated_at?: string;
}

export interface Field {
  name: string;
  value: string;
  is_date: boolean;
}
