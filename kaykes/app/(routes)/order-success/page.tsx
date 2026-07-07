import Link from 'next/link'

export default function OrderSuccess() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-6 text-center px-4'>
      <div className='text-6xl'>🎉</div>
      <h1 className='text-2xl font-bold text-gray-900'>Order Placed Successfully!</h1>
      <p className='text-gray-600'>Thank you for your order. We will process it shortly.</p>
      <Link
        href='/'
        className='bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800'
      >
        Continue Shopping
      </Link>
    </div>
  )
}