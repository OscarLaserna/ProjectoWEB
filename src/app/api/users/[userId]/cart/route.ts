import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getCart, UserResponse } from '@/lib/handlers';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { cartItem: string };
  }
): Promise <NextResponse<UserResponse> | {}> {
  if (!Types.ObjectId.isValid(params.cartItem)) {
    return NextResponse.json({}, { status: 400 });
  }

  const user = await getCart(params.cartItem);

  if (user === null) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(user);
}