'use client';

import { useContext } from "react";
import { CartItemsContext } from "@/providers/CartItemsProvider";
import Link from "next/link";
import CartItemCounter from "./CartItemCounter";
import Button from "@/components/Button";


export default function CartItemsList(){
    const {cartItems,updateCartItems} = useContext(CartItemsContext);
    return(
    <>
      {cartItems.length === 0 ? (
        <div className='flex flex-col items-center justify-center'>
          <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
          <img
            src='/img/emptyCart.svg'
            width={500}
            height={500}
            alt="Empty Cart"
            className="mb-4"  // Añade un margen inferior para separar el encabezado de la imagen
          />
        </div>
        //puede ser que tenga que hacer la tabla aunque este vacía, mas que nada para que quede bonito + Button Checkout disabled
      ) : (
        <>
          <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
          <div>
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-3/4">
                  <div className="relative overflow-x-auto shadow-lg bg-white rounded-lg shadow-md p-6 mb-4">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th scope="col" className="text-left font-semibold">Product</th>
                          <th scope="col" className="text-right font-semibold">Price</th>
                          <th scope="col" className="text-center font-semibold">Quantity</th>
                          <th scope="col" className="text-right font-semibold">Total</th>
                        </tr>
                        <tr>
                          <td colSpan={4}><hr className='my-2'></hr></td>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((cartItem: any) => (
                          <tr key={cartItem.product._id.toString()}>
                            <th scope='row' className='py-4 text-left'>
                              <Link href={`/products/${cartItem.product._id}`}>
                                <span className="font-semibold">{cartItem.product.name}</span>
                              </Link>
                            </th>
                            <td scope='row' className='py-4 text-right'>{cartItem.product.price + '€'}</td>
                            <td scope='row' className='py-4 text-center'>
                                <CartItemCounter productId={cartItem.product._id.toString()}/>
                            </td>
                            <td scope='row' className='py-4 text-right'>{(cartItem.product.price * cartItem.qty).toFixed(2) + '€'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="md:w-1/4">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Summary</h2>
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>$19.99</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Taxes</span>
                      <span>$1.99</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Shipping</span>
                      <span>$0.00</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">
                        {
                          cartItems
                            .map((cartItem: any) => Math.round(cartItem.product.price * cartItem.qty * 100) / 100)
                            .reduce((accumulator: any, total: number) => accumulator + total, 0)
                            .toFixed(2)
                        }
                        €
                      </span>
                    </div>
                    <Button href='/checkout'>
                      Checkout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      </>
    )
}