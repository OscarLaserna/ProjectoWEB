import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
//import { CartItemsResponse, getCartItems } from '@/lib/handlers';
import { CartItemResponse, getCart } from '@/lib/handlers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Cart() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  const cartItemsData: CartItemResponse | null = await getCart(
    session.user._id
  );

  if (!cartItemsData) {
    notFound();
  }

  return (
    <div className="bg-gray-100 h-screen py-8">
    <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
        {cartItemsData.cartItems.length === 0 ? (
          <div className='text-center'>
            <span className='text-center'>The cart is empty</span>
          </div>
        ) : (
          <>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-3/4">
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left font-semibold">Product</th>
                                <th className="text-left font-semibold">Price</th>
                                <th className="text-left font-semibold">Quantity</th>
                                <th className="text-left font-semibold">Total</th>
                            </tr>
                        </thead>
                        {/*FROM NOW ON WE MAP THE PRODUCT CAR**/}
                        {/**TODO PONER UN LINK EN EL NOMBRE DEL PRODUCTO */}
                        {/**ASK FOR THE ANY */}
                        <tbody>
                          {cartItemsData.cartItems.map((cartItem:any) => (
                            <tr key={cartItem.product._id.toString()}>
                              <td className='py-4'>
                                <div className='flex items-center'>
                                  <img className="h-16 w-16 mr-4" src={cartItem.product.img} alt="Product image"/>
                                  <Link href={`/products/${cartItem.product._id}`}>
                                    <span className="font-semibold">{cartItem.product.name}</span>
                                  </Link>
                                </div>
                              </td>
                              <td className='py-4'>{cartItem.product.price} €</td>
                              <td className='py-4'>
                                <div className='flex items-center'>
                                  <button className='border rounded-md py-2 px-4 mr-2'>-</button>
                                  <span className='text-center w-8'>{cartItem.qty}</span>
                                  <button className='border rounded-md py-2 px-4 ml-2'>+</button>
                                  <button className="py-2 px-4 ml-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/></svg>
                                  </button>
                                </div>
                              </td>
                              <td className='py-4'>{(cartItem.product.price * cartItem.qty).toFixed(2)} €</td>
                              {/*toFixed just shows 2 decimals*/}
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
                    <hr className="my-2"/>
                    <div className="flex justify-between mb-2">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold">$21.98</span>
                    </div>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full">Checkout</button>
                </div>
            </div>
          </div>
          </>
        )}
        </div>
        </div>
  );
}