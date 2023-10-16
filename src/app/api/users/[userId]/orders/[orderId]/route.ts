import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { getOrderById, OrderResponse } from '@/lib/handlers';


export async function GET(
    request : NextRequest,
    {
        params,
    }:{
        params: {userId:string, orderId:string};
    }
): Promise<NextResponse<OrderResponse> | {}>{
    if (!Types.ObjectId.isValid(params.userId)||!Types.ObjectId.isValid(params.orderId)) {
        return NextResponse.json({}, { status: 400 });
    }
    const order = await getOrderById(params.userId,params.orderId);
    if(!order){
        return NextResponse.json({},{status:404});
    }
    return NextResponse.json(order);
}