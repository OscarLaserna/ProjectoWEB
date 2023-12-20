'use client'

import { useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { CartItemsContext } from '@/providers/CartItemsProvider';

interface WrapperCartItemCounterProps {
    children: ReactNode;
    productId?: string;
}

export default function WrapperCartItemCounter({productId,children}:WrapperCartItemCounterProps){
    const {data:session} = useSession({required: true});
    const {cartItems,updateCartItems} = useContext(CartItemsContext);


    useEffect(()=>{
        const update = async () =>{
            try{
                const res = await fetch(`/api/users/${session!.user._id}/cart`,{
                    method: 'GET',
                });

                if(res.ok){
                    const body = await res.json();
                    updateCartItems(body.cartItems);
                }
    }catch(err){
        console.log(err);
    }
    };
    update();
},[session,updateCartItems]);

return(
    <div>{children}</div>
);
}