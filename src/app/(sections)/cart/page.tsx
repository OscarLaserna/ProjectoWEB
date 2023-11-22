import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { CartItemResponse, getCart } from '@/lib/handlers';
import Link from 'next/link';
import CartItemsList from '@/components/CartItemsList';

export const dynamic = 'force-dynamic';

export default async function Cart() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div className='relative overflow-x-auto'>
      <CartItemsList/>
    </div>
  );
}