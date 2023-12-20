
export default function CheckoutButton({children}: {children: React.ReactNode}) {



    return(
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mt-4 w-full">
        {children}
        </button>
    )
}


