import { Types } from 'mongoose';
import { notFound } from 'next/navigation';
import { getProductsid } from '@/lib/handlers';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { Session } from 'next-auth';

export default async function Product({
  params,
}: {
  params: { productId: string };
}) {
  const session: Session | null = await getServerSession(authOptions);
  if (!Types.ObjectId.isValid(params.productId)) {
    // Not found or bad request
    notFound();
  }

  const product = await getProductsid(params.productId);

  if (product === null) {
    notFound();
  }

  return (
    <div className='flex flex-col lg:flex-row items-center lg:items-start'>
      {product.img && (
        <div className='lg:w-1/2 mb-4 lg:mb-0'>
          <img
            src={product.img}
            alt={product.name}
            className='mx-auto w-full h-auto lg:h-[400px] object-cover rounded-md'
          />
        </div>
      )}
      <div className='lg:w-1/2 lg:pl-8'>
        <h3 className='pb-2 text-3xl font-bold text-gray-900 sm:pb-4 lg:pb-6'>
          {product.name}
        </h3>
        {product.description && (
          <>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Descripción</h4>
            <p className='mb-2'>{product.description}</p>
          </>
        )}
        {product.price && (
          <p className='text-lg font-semibold text-gray-900 mb-4'>
            Precio: €{product.price.toFixed(2)}
          </p>
        )}
        
        {session ? (
          <>
            <div className='flex items-center mb-4'>
              <div className='flex bg-gray-200 p-2 rounded-md'>
                <button className='bg-gray-300 px-3 py-1 rounded-full'>
                  -
                </button>
                <div className='border-l border-r border-gray-300 w-6 h-2'></div>
                <p className='text-lg font-semibold px-3'>1</p>
                <div className='border-l border-r border-gray-300 w-6 h-2'></div>
                <button className='bg-gray-300 px-3 py-1 rounded-full'>
                  +
                </button>
              </div>
            </div>

            <button className='bg-green-500 px-4 py-2 text-white rounded-full mr-2'>
              Añadir al carrito
            </button>
            <button className='bg-red-500 px-4 py-2 text-white rounded-full'>
              Quitar del carrito
            </button>
          </>
        ) : (

          <p>Inicia sesión para agregar productos al carrito</p>
        )}
      </div>
    </div>
  );
}