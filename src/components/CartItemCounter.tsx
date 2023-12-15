'use client';
import { useSession } from 'next-auth/react';
import { CartItemsContext } from "@/providers/CartItemsProvider";
import { useContext, useState } from "react";

interface CartItemCounterProps {
    productId: string;
}

export default function CartItemCounter({
    productId,
}: CartItemCounterProps) {
    const { data: session } = useSession({ required: true });
    const { cartItems, updateCartItems } = useContext(CartItemsContext);
    const [isUpdating, setIsUpdating] = useState(false);

    const cartItem = cartItems.find((cartItem) =>
        cartItem.product._id === productId
    );
    const qty = cartItem ? cartItem.qty : 0;

    const onPlusBtnClick = async function (event: React.MouseEvent) {
        setIsUpdating(true);

        try {
            const res = await fetch(
                `/api/users/${session!.user._id}/cart/${productId}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        qty: qty + 1,
                    }),
                }
            );

            if (res.ok) {
                const body = await res.json();
                updateCartItems(body.cartItems);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const onMinusBtnClick = async function (event: React.MouseEvent) {
        setIsUpdating(true);

        try {
            const res = await fetch(
                `/api/users/${session!.user._id}/cart/${productId}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        qty: qty - 1,
                    }),
                }
            );

            if (res.ok) {
                const body = await res.json();
                updateCartItems(body.cartItems);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const onDeleteBtnClick = async function (event: React.MouseEvent) {
        setIsUpdating(true);
        //TODO : pagina productId cuando borramos deja volver a añadir cambiar para que cambie directamente a "ADD TO CART" sin tener que refrescar
        try {
            const res = await fetch(
                `/api/users/${session!.user._id}/cart/${productId}`,
                {
                    method: 'DELETE',
                    //has no body
                }
            );

            if (res.ok) {
                const body = await res.json();
                updateCartItems(body.cartItems);
            }
        } finally {
            setIsUpdating(false);
        }
    };
         
                /**AL hacer f5 como tarda muestra la imagen */

    return (
        <div className='flex items-center justify-center'>
            <button
            onClick={onMinusBtnClick}
            disabled={!session || isUpdating}
            className='border rounded-md py-2 px-4 mr-2 hover:bg-gray-800 hover:text-white'>-</button>
            <span className='text-center w-8'>{qty}</span>
            <button 
                onClick={onPlusBtnClick}
                className='border rounded-md py-2 px-4 ml-2 hover:bg-gray-800 hover:text-white'
                disabled={!session || isUpdating}
            >
            +
            </button>
            <button 
            onClick={onDeleteBtnClick}
            disabled={!session || isUpdating}
            className="py-2 px-4 ml-2 hover:shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /></svg>
            </button>
        </div>
    );
}