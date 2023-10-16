import { NextRequest, NextResponse } from 'next/server';
import { createUser, CreateUserResponse, getCart, getProductsid, getUser, removeProduct, RemoveProductResponse, updateCartItem, UpdateCartItemResponse } from '@/lib/handlers';
import { Types } from 'mongoose';
import Users, { User } from '@/models/User';
import Products, { Product } from '@/models/Product';

export async function PUT(
  request: NextRequest,
  {
    params,
  }:{
    params: { userId: string, productId: string};
  }
): Promise<NextResponse<UpdateCartItemResponse> | {}> {
    if (!Types.ObjectId.isValid(params.productId)||!Types.ObjectId.isValid(params.userId)) {
        return NextResponse.json({}, { status: 400 });
    }

  const body = await request.json();

  if (!body.qty||body.qty==0){
    return NextResponse.json({}, { status: 400});
  }

  const userId = await getUser(params.userId);

  if (userId === null) {
    return NextResponse.json({}, { status: 404 });
  }
  const productId = await getProductsid(params.productId);

  if (productId === null) {
    return NextResponse.json({}, { status: 404 });
  }

  const usercart = await Users.findById(params.userId)
  const cart = usercart.cartItems.find((cartItem: any) => cartItem.product._id.equals(productId))
  
  const cartItems = await updateCartItem(params.userId, params.productId, body.qty)

  if (cartItems ===null){
    return NextResponse.json({}, { status: 400});
  }

   //if (!body.email || !body.password || !body.name || !body.surname || !body.address || !body.birthdate) {
   //return NextResponse.json({}, { status: 400 });
 // }



  const headers = new Headers();
  headers.append('Location', `/api/users/${params.userId}`);
  if(cart===undefined){return NextResponse.json(cartItems, { status: 201, headers: headers });}
  return NextResponse.json(cartItems, { status: 200, headers: headers });
  //return NextResponse.json({ status: 201, headers: headers });
  //return NextResponse.json({ _id: userId._id }, { status: 201, headers: headers });
}

export async function DELETE(
  request : NextRequest,
  {
      params,
  }:{
      params:{userId:string, productId:string};
  }
):Promise<NextResponse<RemoveProductResponse> | null | {}> {

  if(!Types.ObjectId.isValid(params.userId)||!Types.ObjectId.isValid(params.productId)){
      return NextResponse.json({},{status:400});
  }
  const product = await getProductsid(params.productId);
  const output = await removeProduct(params.userId,params.productId);

  if(output === null && product===null){
      return NextResponse.json({},{status:404});
  }

  return NextResponse.json(output, {status:200});
}