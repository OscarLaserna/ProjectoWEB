import { notFound, redirect } from 'next/navigation';
import { OrderResponse, getOrder, getUser, getOrderById} from '@/lib/handlers';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { Session } from 'next-auth';
import Link from 'next/link';


export default async function Profile() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  const user = await getUser(session.user._id);
  if (user === null) {
    return notFound();
  }
  
  const Data: OrderResponse| null = await getOrder(
    session.user._id
  );
  if (!Data) {
    notFound();
  }
  
  return (
    <div className='flex flex-col lg:flex-row items-center lg:items-start'>
      {/* Sección de detalles del usuario */}
      <div className='lg:w-1/2 lg:pl-8'>
        {/* Título del perfil de usuario */}
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>User Profile</h2>

        {/* Nombre del usuario */}
        {user.name && (
          <p className='text-lg font-semibold text-gray-900 mb-2'>
            Name: {user.name} {user.surname}
          </p>
        )}
        {/* Dirección del usuario */}
        {user.address && (
          <p className='text-lg font-semibold text-gray-900 mb-2'>
            Dirección: {user.address}
          </p>
        )}
        {/* Cumpleaños del usuario */}
        {user.birthday && (
          <p className='text-lg font-semibold text-gray-900 mb-4'>
            Cumpleaños: {user.birthday.toLocaleDateString()}
          </p>
        )}

        {/* Título de pedidos */}
        <h3 className='text-2xl font-bold text-gray-900 mb-2'>Orders</h3>
        {
  Data.Order ? (
    Data.Order.map((orderitems: any) => (
      <div key={orderitems.order._id.toString()}>
        <Link href={`/orders/${orderitems.order._id}`}>
          {orderitems._id}
        </Link>
        <br />
        {orderitems.address}
        <br />
        {orderitems.cardHolder}
      </div>
    ))
  ) : (
    <p>No hay órdenes disponibles</p>
  )
}

      </div>
    </div>
  );
}
