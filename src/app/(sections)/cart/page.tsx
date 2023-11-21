import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
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
    <div className='relative overflow-x-auto'>
      {/**Relative aqui pq sino se junta con el footer */}
      {cartItemsData.cartItems.length === 0 ? (
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
          <div className="bg-gray-100 h-screen py-8">
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
                        {cartItemsData.cartItems.map((cartItem: any) => (
                          <tr key={cartItem.product._id.toString()}>
                            <th scope='row' className='py-4 text-left'>
                              <Link href={`/products/${cartItem.product._id}`}>
                                <span className="font-semibold">{cartItem.product.name}</span>
                              </Link>
                            </th>
                            <td scope='row' className='py-4 text-right'>{cartItem.product.price + '€'}</td>
                            <td scope='row' className='py-4 text-center'>
                              <div className='flex items-center justify-center'>
                                <button className='border rounded-md py-2 px-4 mr-2 hover:bg-gray-800 hover:text-white'>-</button>
                                <span className='text-center w-8'>{cartItem.qty}</span>
                                <button className='border rounded-md py-2 px-4 ml-2 hover:bg-gray-800 hover:text-white'>+</button>
                                <button className="py-2 px-4 ml-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /></svg>
                                </button>
                              </div>
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
                          cartItemsData.cartItems
                            .map((cartItem: any) => Math.round(cartItem.product.price * cartItem.qty * 100) / 100)
                            .reduce((accumulator: any, total: number) => accumulator + total, 0)
                            .toFixed(2)
                        }
                        €
                      </span>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mt-4 w-full">Checkout</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}