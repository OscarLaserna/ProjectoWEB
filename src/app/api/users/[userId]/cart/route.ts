import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getCart, UpdateCartItemResponse } from '@/lib/handlers';

export async function GET(
  request: NextRequest,
  {
    params,
  }:{
    params: { userId: string};
  }
): Promise <NextResponse<UpdateCartItemResponse> | {}> {
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({}, { status: 400 });
  }

  const cart = await getCart(params.userId);

  if (cart === null) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(cart);
}