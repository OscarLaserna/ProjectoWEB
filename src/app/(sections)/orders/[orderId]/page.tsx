import { Session } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth/next';
import { Types } from 'mongoose';
import { getOrderById } from '@/lib/handlers';
import Link from 'next/link';

export default async function Order({
    params,
}: {
    params: { orderId: string };
}) {
    const session: Session | null = await getServerSession(authOptions);
    if (!session) {
        redirect('/api/auth/signin');
    }

    if (!Types.ObjectId.isValid(params.orderId)) {
        notFound();
    }

    const order = await getOrderById(session.user._id, params.orderId);

    if (!order) {
        notFound();
    }

    //Necessary to show the date
    const formattedDateTime = new Date(order.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    });


    return (
        <div>
            <div className='relative overflow-x-auto'>
                <h1 className="text-2xl font-semibold mb-4">Order Details</h1>
                <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                    </svg>
                    <span className="font-bold ml-2 text-gray-800">Order ID:</span>
                    <span className="ml-2 text-black">{order._id}</span>
                </span>
                <span className="mt-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>      
                    <span className="font-bold ml-2 text-gray-800">Shipping Address:</span>
                    <span className="ml-2 text-black">{order.address}</span>
                </span>
                <span className="mt-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>

                    <span className="font-bold ml-2 text-gray-800">Payment Information:</span>
                    <span className="ml-2 text-black">{order.cardNumber} ({order.cardHolder})</span>
                </span>
                <span className="mt-4 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>

                    <span className="font-bold ml-2 text-gray-800">Order Date:</span>
                    <span className="ml-2 text-black">{formattedDateTime}</span>
                </span>
            </div>
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
                        {order.OrderItems.map((orderItem: any) => (
                            <tr key={orderItem.product._id.toString()}>
                                <th scope="row" className='py-4 text-left'>
                                    <Link href={`/products/${orderItem.product._id}`}>
                                        <span className="font-semibold">{orderItem.product.name}</span>
                                    </Link>
                                </th>
                                <td scope="row" className='py-4 text-right'>{orderItem.price} €</td>
                                <td scope="row" className='py-4 text-center'>{orderItem.qty}</td>
                                <td scope="row" className='py-4 text-right'>{(orderItem.price * orderItem.qty).toFixed(2)} €</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <hr className="my-4"></hr>
                <div className="flex justify-between items-center">
                    <span className="font-bold">Total:</span>
                    <span className="font-semibold">
                        {
                            order.OrderItems
                                .map((orderItem: any) => Math.round(orderItem.price * orderItem.qty * 100) / 100)
                                .reduce((accumulator: any, total: number) => accumulator + total, 0)
                                .toFixed(2)
                        }
                        €
                    </span>
                </div>
            </div>
        </div>
    )
}