import { Types } from 'mongoose';
import { getOrderById } from '@/lib/handlers';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { Session } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBuilding, faCreditCard, faCalendar } from '@fortawesome/free-solid-svg-icons';

export default async function Order({
  params,
}: {
  params: { orderId: string };
}) {
  const session: Session | null = await getServerSession(authOptions);
  if (!Types.ObjectId.isValid(params.orderId)) {
    // Not found or bad request
    notFound();
  }
  if (!session) {
    redirect('/api/auth/signin');
  }
  const order = await getOrderById(session?.user?._id, params.orderId);

  if (order === null) {
    notFound();
  }

  // Calcular la suma total de las órdenes anteriores
  const totalAmount = order.OrderItems.reduce(
    (total, OrderItem) => total + OrderItem.qty * OrderItem.price,
    0
  );

  return (
    <div className='flex flex-col lg:flex-row items-center lg:items-start'>
      {/* Sección de detalles del usuario */}
      <div className='lg:w-1/2 lg:pl-8'>
        {/* Título del perfil de usuario */}
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Orden details</h2>

        {/* Nombre del usuario */}
        {order._id && (
          <p className='text-lg font-semibold text-gray-900 mb-2 flex items-center'>
            <div className='mr-2'>
              <FontAwesomeIcon icon={faShoppingCart} style={{ width: '16px', height: '16px' }} />
            </div>
            <div>
              <span className='font-bold'>Order ID:</span> {String(order._id)}
            </div>
          </p>
        )}
        {/* Dirección del usuario */}
        {order.address && (
          <p className='text-lg font-semibold text-gray-900 mb-2 flex items-center'>
            <div className='mr-2'>
              <FontAwesomeIcon icon={faBuilding} style={{ width: '16px', height: '16px' }} />
            </div>
            <div>
              <span className='font-bold'>Dirección:</span> {order.address}
            </div>
          </p>
        )}
        {/* Dirección del usuario */}
        {order.cardNumber && (
          <p className='text-lg font-semibold text-gray-900 mb-2 flex items-center'>
            <div className='mr-2'>
              <FontAwesomeIcon icon={faCreditCard} style={{ width: '16px', height: '16px' }} />
            </div>
            <div>
              <span className='font-bold'>Payment information:</span> {order.cardNumber} ({order.cardHolder})
            </div>
          </p>
        )}
        {/* Cumpleaños del usuario */}
        {order.date && (
          <p className='text-lg font-semibold text-gray-900 mb-16 flex items-center'>
            <div className='mr-2'>
              <FontAwesomeIcon icon={faCalendar} style={{ width: '16px', height: '16px' }} />
            </div>
            <div>
              <span className='font-bold'>Date of purchase:</span> {order.date.toLocaleDateString()}, {order.date.toLocaleTimeString()}
            </div>
          </p>
        )}
      </div>

      {/* Detalles de la orden */}
      {order.OrderItems && (
        <div className="lg:w-1/2 mt-4">
          {/* Encabezados de la tabla */}
          <div className="flex justify-between items-center bg-gray-200 p-4 font-bold rounded-t-lg">
            <div className="w-1/2">Product name</div>
            <div className="w-1/6 text-center">QTY</div>
            <div className="w-1/6 text-center">Price</div>
            <div className="w-1/6 text-center">Total</div>
          </div>

          {/* Filas de la tabla */}
          {order.OrderItems.map((OrderItem: any) => (
            <div key={OrderItem.product._id.toString()} className="flex justify-between items-center border-b p-4">
              <div className="w-1/2">
                <Link href={`/products/${OrderItem.product._id}`}>
                  {OrderItem.product.name}
                </Link>
              </div>
              <div className="w-1/6 text-center">{OrderItem.qty}</div>
              <div className="w-1/6 text-center">{OrderItem.price.toFixed(2) + ' €'}</div>
              <div className="w-1/6 text-center">{(OrderItem.qty * OrderItem.price).toFixed(2) + ' €'}</div>
            </div>
          ))}

          {/* Fila adicional para mostrar el total */}
          <div className="flex justify-between items-center border-b p-4 rounded-b-lg">
            <div className="w-1/2 font-bold text-gray-900">Total</div>
            <div className="w-1/6 font-bold text-gray-900 text-center">{totalAmount.toFixed(2) + ' €'}</div>
          </div>
        </div>
      )}
    </div>
  );
}
