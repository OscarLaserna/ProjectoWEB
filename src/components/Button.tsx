'use client'
import { useRouter } from 'next/navigation';

interface ButtonProps{
    href: string;
    children: React.ReactNode;
}

export default function Button({href, children}: ButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(href);
    };

    return(
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mt-4 w-full" onClick={handleClick}>
            {children}
        </button>
    )
}