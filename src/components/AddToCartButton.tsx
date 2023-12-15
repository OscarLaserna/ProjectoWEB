'use client';
import { useSession } from 'next-auth/react';
import { CartItemsContext } from "@/providers/CartItemsProvider";
import { useContext, useState } from "react";

interface CartItemCounterProps {
    productId: string;
}

export default function AddToCartButton({ productId }: CartItemCounterProps) {
    const { data: session } = useSession({ required: true });
    const { cartItems, updateCartItems } = useContext(CartItemsContext);
    const [isUpdating, setIsUpdating] = useState(false);

    const cartItem = cartItems.find((cartItem) =>
    cartItem.product._id === productId
    );
    const qty = cartItem ? cartItem.qty : 0;

    const onClickButton = async function (event:React.MouseEvent) {
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

    return(
        // if !session quiero que redireccione a logear o registrar
        <button 
        onClick={onClickButton}
        //si onCLick vuelvo a redireccionar refresca la pagina y entonces si lo muestra bien
        disabled={!session ||isUpdating}
        className="ml-6 px-6 py-2 text-white font-semibold uppercase transition duration-200 ease-in border-2 border-gray-900 bg-blue-500 rounded-full hover:bg-blue-800 hover:text-white focus:outline-none">
            Add to cart
        </button>
    )
}