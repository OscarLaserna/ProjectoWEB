import { NextRequest, NextResponse } from 'next/server';
import { createUser, CreateUserResponse, getCart, getProductsid, getUser, removeProduct, RemoveProductResponse, updateCartItem, UpdateCartItemResponse } from '@/lib/handlers';
import { Types } from 'mongoose';
import Users, { User } from '@/models/User';
import Products, { Product } from '@/models/Product';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function PUT(
  request : NextRequest,
  {
      params,
  }:{
      params:{userId:string, productId:string};
  }
):Promise<NextResponse<UpdateCartItemResponse> | null | {}>{
  const session: Session | null = await getServerSession(authOptions);
  if(!session?.user){
      return NextResponse.json({},{status:401});
  }
  // 401 if user is not logged in
  // 403 if user is not authorized
  // no puedes modificar el carrito de un usuario que no eres tu

  const body = await request.json();
  
  if(!body.qty||!params.userId||!params.productId){
      return NextResponse.json({},{status:400});
  }
  
  if(!Types.ObjectId.isValid(params.userId)||!Types.ObjectId.isValid(params.productId)){
      return NextResponse.json({},{status:400});
  }

  // Have to be after the check of the parameters
  if(session.user._id !== params.userId){
    return NextResponse.json({},{status:403});
}

  const output = await updateCartItem(
      params.userId,
      params.productId,
      body.qty,
  );
  // The logic have to be before checking the session otherwise anyone know what has or hasn't (productId) in the cart
  // if 404 anyone know that this product is not in the cart
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
  const session: Session | null = await getServerSession(authOptions);

  if(!session?.user){
      return NextResponse.json({},{status:401});
  }
  // 401 if user is not logged in
  if(!Types.ObjectId.isValid(params.userId)||!Types.ObjectId.isValid(params.productId)){
      return NextResponse.json({},{status:400});
  }
  if(session.user._id !== params.userId){
      return NextResponse.json({},{status:403});
  }
  const product = await getProductsid(params.productId);
  const output = await removeProduct(params.userId,params.productId);

  if(output === null || product===null){
      return NextResponse.json({},{status:404});
  }

  return NextResponse.json(output, {status:200});
}