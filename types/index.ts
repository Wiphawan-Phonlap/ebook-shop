export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  cover_image: string;
}

export interface Order {
  id: string;
  book_id: string;
  customer_name: string;
  customer_email: string;
  status: 'PENDING' | 'PAID';
  total_price: number;
  created_at?: string;
}