import { Types } from 'mongoose';
import { notFound,redirect } from 'next/navigation';
import { getCart, getProductsid } from '@/lib/handlers';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { Session } from 'next-auth';
import { get } from 'http';
import CartItemCounter from '@/components/CartItemCounter';
import AddToCartButton from '@/components/AddToCartButton';

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
                  <AddToCartButton productId={params.productId}/>
                  //como que hay que refrescar para que cambie y detecte los cambios en la condición de arriba
                ) : (
                  <CartItemCounter productId={params.productId}/>
                )}
              </div>
            ) : (
              <>
              
              {/**PODRIA MOSTRAR EL BOTON PERO AL HACER CLICK QUE REDIRECCIONE A SING UP */}
              <button disabled={true}/*onClick={redirect('/api/auth/signin')}*/ className="px-6 py-2 items-center justify-center text-white font-semibold uppercase transition duration-200 ease-in border-2 border-gray-900 bg-blue-300 rounded-full hover:bg-blue-300 hover:text-white focus:outline-none">
                    ADD TO CART
              </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}