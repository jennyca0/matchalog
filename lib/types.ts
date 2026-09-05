export interface MatchaProduct {
  id: string;
  name: string;
  brand: string | null;
  origin: string | null;
  image_url: string | null;
  price: number | string | null;
  description: string | null;
  created_at?: string;
  [key: string]: unknown;
}

export interface Review {
  id: string;
  product_id: string;
  username: string | null;
  rating: number | null;
  comment: string | null;
  [key: string]: unknown;
}

export interface StashItem {
  id: string;
  user_id: string;
  status: string | null;
  rating: number | null;
  matcha_products: MatchaProduct | null;
  [key: string]: unknown;
}

export interface Recipe {
  id: string;
  name: string;
  creator: string | null;
  image_url: string | null;
  description: string | null;
  [key: string]: unknown;
}

export interface ProductsResponse {
  products: MatchaProduct[];
  count: number;
}

export interface ReviewsResponse {
  reviews: Review[];
}

export interface StashResponse {
  stash: StashItem[];
}

export interface ErrorResponse {
  error: string;
}

export interface RouteContext<TParams extends Record<string, string>> {
  params: Promise<TParams>;
}
