import { Session } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth/next';
import { Types } from 'mongoose';
import { getOrder, getOrderById, getUser } from '@/lib/handlers';
import Link from 'next/link';

//session si o si pq aunque el icono solo salga en el navbar si esta logeado se puede acceder poniendo /profile

export default async function Profile(){
    const session: Session | null = await getServerSession(authOptions);

    if(!session){
        redirect('/api/auth/signin');
    }

    const user = await getUser(session.user._id);

    //Aunque deberia encontrarlo siempre pq tiene la sesion iniciada e indica que está en la bbdd
    if(!user){
        notFound();
    }

    const orders = await getOrder(session.user._id);

    console.log(orders);

    const birthdate = new Date(user.birthdate).toLocaleDateString('en-US',{
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    /*
    console.log(session);

        session = {
            name: undefined,
            email: undefined,
            image: undefined,
            _id: 23848932749832742984
        }

    */
   
    return(
        <div>
            <div className='relative overflow-x-auto'>
                <h1 className="text-2xl font-semibold mb-4">User Profile</h1>
                <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span className="font-bold ml-2 text-gray-800">Full name:</span>
                    <span className="ml-2 text-black">{user.name} {user.surname}</span>
                </span>
                <span className="mt-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <span className="font-bold ml-2 text-gray-800">E-mail Address:</span>
                    <span className="ml-2 text-black">{user.email}</span>
                </span>
                <span className="mt-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <span className="font-bold ml-2 text-gray-800">Address:</span>
                    <span className="ml-2 text-black">{user.address}</span>
                </span>
                <span className="mt-4 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
                    </svg>
                    <span className="font-bold ml-2 text-gray-800">Birthdate:</span>
                    <span className="ml-2 text-black">{birthdate}</span>
                </span>
            </div>
            {(orders)?(
                <div className="relative overflow-x-auto shadow-lg bg-white rounded-lg shadow-md p-6 mb-4">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th scope="col" className="text-left font-semibold">ORDER ID</th>
                            <th scope="col" className="text-left font-semibold px-4">SHIPMENT ADDRESS</th>
                            <th scope="col" className="text-left font-semibold px-4">PAYMENT INFORMATION</th>
                            <th scope="col" className="text-right font-semibold px-4"></th>
                        </tr>
                        <tr>
                            <td colSpan={4}><hr className="my-2" /></td>
                            {/** el colSpan indica cuantas columnas atraviesa, en este caso la linea separadora "hr" */}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.orders.map((orderItem: any) => (
                            <tr key={orderItem._id.toString()}>
                                <th scope="row" className='py-4 mr-4 text-left'>
                                    <span className="font-semibold">{orderItem._id}</span>
                                </th>
                                <td scope="row" className='py-4 mr-4 text-left'>{orderItem.address}</td>
                                <td scope="row" className='py-4 mr-4 text-left'>{orderItem.cardHolder} {orderItem.cardNumber}</td>
                                <td scope="row" className='py-4 text-right'>
                                    <Link href={`/orders/${orderItem._id}`}>
                                        <span className="text-blue-500 hover:text-blue-700 hover:font-bold">
                                            View Details
                                        </span>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <hr className="my-4"></hr>
                </div>
            ):(
                <></>
            )}
        </div>
    )

}