import { NextRequest, NextResponse } from 'next/server';
import { createUser, CreateUserResponse, updateCartItem, UpdateCartItemResponse } from '@/lib/handlers';

export async function PUT(
  request: NextRequest,
  {
    params,
  }:{
    params: { userId: string, productId: string};
  }
): Promise<NextResponse<UpdateCartItemResponse> | {}> {
  const body = await request.json();

  if (!body.qty){
    return NextResponse.json({}, { status: 400});
  }

  const cartItems = await updateCartItem(params.userId, params.productId, body.qty)

  if (cartItems ===null){
    return NextResponse.json({}, { status: 400});
  }

  if (!body.email || !body.password || !body.name || !body.surname || !body.address || !body.birthdate) {
    return NextResponse.json({}, { status: 400 });
  }

  const userId = await createUser(body);

  if (userId === null) {
    return NextResponse.json({}, { status: 400 });
  }

  const headers = new Headers();
  headers.append('Location', `/api/users/${userId._id}`);
  return NextResponse.json({ _id: userId._id }, { status: 201, headers: headers });
}