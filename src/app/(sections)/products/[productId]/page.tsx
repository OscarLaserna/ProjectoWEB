import { Types } from 'mongoose';
import { notFound,redirect } from 'next/navigation';
import { getCart, getProductsid } from '@/lib/handlers';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { Session } from 'next-auth';
import { get } from 'http';

export default async function Product({
  params,
}: {
  params: { productId: string };
}) {

  const session: Session | null = await getServerSession(authOptions);

  if (!Types.ObjectId.isValid(params.productId)) {
    notFound();
  }

  const product = await getProductsid(params.productId);

  if (product === null) {
    notFound();
  }

  let cart = null;
  if (session) {
    cart = await getCart(session.user._id);
  }

  return (
    <div className="ml-auto mr-auto flex items-center justify-center w-80">
      <div className="w-full p-4">
        <div className="flex flex-col justify-center p-10 bg-white rounded-lg shadow-2xl card">
          <div className="prod-title">
            <p className="text-2xl text-center font-bold text-gray-900 uppercase">
              {product.name}
            </p>
            <p className="text-sm text-center text-gray-400 uppercase">
              {product.description}
            </p>
          </div>
          <div className="prod-img">
            <img src={product.img} alt={product.name} className="object-cover object-center w-full" />
          </div>
          <div className="grid gap-10 prod-info">
            <div>
              <ul className="flex flex-row items-center justify-center">
                <li className="mr-4 last:mr-0">
                  <span className="block p-1 transition duration-300 ease-in border-2 border-gray-500 rounded-full">
                    <a href="#blue" className="block w-6 h-6 bg-blue-900 rounded-full">
                    </a>
                  </span>
                </li>
                <li className="mr-4 last:mr-0">
                  <span className="block p-1 transition duration-300 ease-in border-2 border-white rounded-full hover:border-gray-500">
                    <a href="#yellow" className="block w-6 h-6 bg-yellow-500 rounded-full">
                    </a>
                  </span>
                </li>
                <li className="mr-4 last:mr-0">
                  <span className="block p-1 transition duration-300 ease-in border-2 border-white rounded-full hover:border-gray-500">
                    <a href="#red" className="block w-6 h-6 bg-red-500 rounded-full">
                    </a>
                  </span>
                </li>
                <li className="mr-4 last:mr-0">
                  <span className="block p-1 transition duration-300 ease-in border-2 border-white rounded-full hover:border-gray-500">
                    <a href="#green" className="block w-6 h-6 bg-green-500 rounded-full">
                    </a>
                  </span>
                </li>
              </ul>
            </div>
            <p className="text-xl text-center font-bold">
              {product.price + '€'}
            </p>
            {(cart) ? (
              <div className="flex flex-col items-center justify-between text-gray-900 md:flex-row">
                {(cart.cartItems.length === 0 || cart.cartItems.filter((cartItem: any) => cartItem.product._id.toString() === params.productId).length === 0) ? (
                  <button className="ml-6 px-6 py-2 text-white font-semibold uppercase transition duration-200 ease-in border-2 border-gray-900 bg-blue-500 rounded-full hover:bg-blue-800 hover:text-white focus:outline-none">
                    Add to cart
                  </button>
                ) : (
                  <div className='ml-5 flex items-center justify-center'>
                    <button className='border rounded-md py-2 px-4 mr-2 hover:bg-gray-800 hover:text-white'>-</button>
                    <span className='text-center w-8'>{cart.cartItems.filter((cartItem: any) => cartItem.product._id.toString() === params.productId)[0].qty}</span>
                    <button className='border rounded-md py-2 px-4 ml-2 hover:bg-gray-800 hover:text-white'>+</button>
                    {/**Si la cantidad es mayor que 1 poder eliminar?? */}
                    <button className="py-2 px-4 ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /></svg>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
              
              {/**PODRIA MOSTRAR EL BOTON PERO AL HACER CLICK QUE REDIRECCIONE A SING UP */}
              <button disabled={true}/*onClick={redirect('/api/auth/signin')}*/ className="ml-6 px-6 py-2 text-white font-semibold uppercase transition duration-200 ease-in border-2 border-gray-900 bg-blue-300 rounded-full hover:bg-blue-300 hover:text-white focus:outline-none">
                    Add to cart
            </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}