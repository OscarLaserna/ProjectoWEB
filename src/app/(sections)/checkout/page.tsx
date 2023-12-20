import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { CartItemResponse, getCart} from '@/lib/handlers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import ShippingDetails from '@/components/ShippingDetails';

export const dynamic = 'force-dynamic';

export default async function Checkout() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  //! PARA VER LOS DATOS DEL USUARIO como estamos haciendo primero para moviles
  //! los 2 elementos del medio de esa tabla no los muestra
  //! una caracteristica para la tabla es poner className='hidden :condicion para que lo muestre'

  // Checkout quiere crear una orden, luego estas se muestran con getOrder en /orders/orderId
  // Purchase lo que hace es crear la order
  // Checkout -> getOrder -> Purchase -> createOrder
  const cartItemsData: CartItemResponse | null = await getCart(session.user._id);
  // puede ser que no devuelva nada porque no coincide con el address, cardNumber, ...
  // eso a lo mejor lo tenemos que cambiar en el handler getOrder
  // para que no busque teniendo en cuenta dichos atributos

  //TODO : AL FINAL LO QUE HACE ESTE METODO ES LLAMAR AL POST ORDERS al pulsar el boton de Purchase

  if (!cartItemsData) {
    notFound();
  }

 


  //! HACER ESTO CON LA TABLA QUE NOS DA COMO EJEMPLO EN FLOWBITE

  //por ahora solo lo hace bien con el primer elemento de la tabla
  return (
    <div className='relative overflow-x-auto'>
      {/**Relative aqui pq sino se junta con el footer */}
      {cartItemsData.cartItems.length === 0 ? (
        <div className='flex flex-col items-center justify-center'>
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
          <div>
            <div className="container mx-auto px-4">
              <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-3/4">
                  <div className="relative overflow-x-auto shadow-lg bg-white rounded-lg shadow-md p-6 mb-4">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th scope="col" className="text-left font-semibold">PRODUCT</th>
                          <th scope="col" className="text-right font-semibold px-4">PRICE</th>
                          <th scope="col" className="text-center font-semibold px-4">QUANTITY</th>
                          <th scope="col" className="text-right font-semibold px-4">TOTAL</th>
                        </tr>
                        <tr>
                          <td colSpan={4}><hr className="my-2" /></td>
                          {/** el colSpan indica cuantas columnas atraviesa, en este caso la linea separadora "hr" */}
                        </tr>
                      </thead>
                      <tbody>
                        {cartItemsData.cartItems.map((cartItem: any) => (
                          <tr key={cartItem.product._id.toString()}>
                            <th scope="row" className='py-4 text-left'>
                              <Link href={`/products/${cartItem.product._id}`}>
                                <span className="font-semibold">{cartItem.product.name}</span>
                              </Link>
                            </th>
                            <td scope="row" className='py-4 text-right'>{cartItem.product.price} €</td>
                            <td scope="row" className='py-4 text-center'>{cartItem.qty}</td>
                            <td scope="row" className='py-4 text-right'>{(cartItem.product.price * cartItem.qty).toFixed(2)} €</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <hr className="my-4"></hr>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total:</span>
                      <span className="font-semibold">
                        {
                          cartItemsData.cartItems
                            .map((cartItem: any) => Math.round(cartItem.product.price * cartItem.qty * 100) / 100)
                            .reduce((accumulator: any, total: number) => accumulator + total, 0)
                            .toFixed(2)
                        }
                        €
                      </span>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/3">
                  <ShippingDetails/>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}