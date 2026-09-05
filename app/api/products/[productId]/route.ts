import { supabase } from '@/lib/supabase';
import type { ErrorResponse, MatchaProduct, ProductImage, RouteContext } from '@/lib/types';

export async function GET(
  _request: Request,
  { params }: RouteContext<{ productId: string }>,
): Promise<Response> {
  const { productId } = await params;
  const { data, error } = await supabase
    .from('matcha_products')
    .select('*, matcha_product_images(*)')
    .eq('id', productId)
    .single();

  if (error) {
    const body: ErrorResponse = { error: error.message };
    return Response.json(body, { status: 500 });
  }

  const productWithImages = data as MatchaProduct & {
    matcha_product_images?: ProductImage[];
  };
  const { matcha_product_images: images, ...product } = productWithImages;

  return Response.json({
    ...product,
    images: images ?? [],
  } satisfies MatchaProduct);
}
