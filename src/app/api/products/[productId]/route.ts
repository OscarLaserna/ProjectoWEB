import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getProductsid, ProductsResponse } from '@/lib/handlers';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { productId: string };
  }
): Promise <NextResponse<ProductsResponse> | {}> {
  if (!Types.ObjectId.isValid(params.productId)) {
    return NextResponse.json({}, { status: 400 });
  }

  const products = await getProductsid(params.productId);

  if (products === null) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(products);
}