import { NextRequest, NextResponse } from 'next/server';
import { createUser, CreateUserResponse, getCart, getProductsid, getUser, removeProduct, RemoveProductResponse, updateCartItem, UpdateCartItemResponse } from '@/lib/handlers';
import { Types } from 'mongoose';
import Users, { User } from '@/models/User';
import Products, { Product } from '@/models/Product';

export async function PUT(
  request : NextRequest,
  {
      params,
  }:{
      params:{userId:string, productId:string};
  }
):Promise<NextResponse<UpdateCartItemResponse> | null | {}>{
  const body = await request.json();
  
  if(!body.qty||!params.userId||!params.productId){
      return NextResponse.json({},{status:400});
  }
  
  if(!Types.ObjectId.isValid(params.userId)||!Types.ObjectId.isValid(params.productId)){
      return NextResponse.json({},{status:400});
  }

  const output = await updateCartItem(
      params.userId,
      params.productId,
      body.qty,
  );

  if(!output) return NextResponse.json({},{status:404});

  const cartItems = output?.cartItems;
  const created = output?.created;

  if(!cartItems){
      return NextResponse.json({},{status:400});
  }

  if(created){
      return NextResponse.json(cartItems, {status:201});
  }else{
      return NextResponse.json(cartItems, {status:200});
  }

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

  if(output === null || product===null){
      return NextResponse.json({},{status:404});
  }

  return NextResponse.json(output, {status:200});
}