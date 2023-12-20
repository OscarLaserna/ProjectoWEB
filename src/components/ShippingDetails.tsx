'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useContext} from "react";
import { CartItemsContext } from "@/providers/CartItemsProvider";


interface FormValues {
    address: string;
    cardHolder: string;
    cardNumber: string;
}
export default function ShippingDetails() {
    const {data:session} = useSession({required: true});
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const { cartItems, updateCartItems } = useContext(CartItemsContext);

    const [formValues, setFormValues] = useState<FormValues>({
        address: '',
        cardHolder: '',
        cardNumber: '',
    });

    const handleSubmit = async function (
        event: React.FormEvent<HTMLFormElement>
      ) {
        event.preventDefault();
        if (!event.currentTarget.checkValidity()) {
          return false;
        }

        try{
            const res = await fetch(
                `/api/users/${session!.user._id}/orders`,{
                    method: 'POST',
                    body: JSON.stringify(
                        formValues
                    ),
                }
            );
            if(res.ok){
                setError('');
                const order = await res.json();
                updateCartItems([]);
                router.push(`/orders/${order._id}`);
                router.refresh();
            }else{
                setError(`An error occurred while processing your request: ${res.statusText}.`)
            }
        }catch(err){
            console.log(err);

        }

    }

    return (
        <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">SHIPPING DETAILS</h2>
            <div className="mb-4">
                <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-600">Shipping Address</label>
                <input type="address" id="address" name="address" placeholder="123 Main St" className="mt-1 p-2 w-full border rounded-md"
                    value={formValues.address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormValues((prevFormValues) => ({
                            ...prevFormValues,
                            address: e.target.value,
                        }))
                    }
                />
                <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
                    Please provide a valid email address.
                </p>
            </div>
            <div className="mb-4">
                <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-600">Card Holder</label>
                <input type="text" id="cardHolder" name="cardHolder" placeholder="John Doe" className="mt-1 p-2 w-full border rounded-md"
                    value={formValues.cardHolder}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormValues((prevFormValues) => ({
                            ...prevFormValues,
                            cardHolder: e.target.value,
                        }))
                    }
                />
                <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
                    Please provide a valid card holder.
                </p>
            </div>
            <div className="mb-4">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-600">Card Number</label>
                <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1 p-2 w-full border rounded-md"
                    value={formValues.cardNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormValues((prevFormValues) => ({
                            ...prevFormValues,
                            cardNumber: e.target.value,
                        }))
                    }
                />
                <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
                    Please provide a valid card number.
                </p>
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mt-4 w-full">Purchase</button>
        </div>
        </form>
    )
}