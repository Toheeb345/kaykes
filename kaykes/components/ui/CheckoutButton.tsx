"use client"
import { usePaystackPayment } from 'react-paystack'
import { useContext } from 'react'
import { UserDetailContext } from '@/context/UserdetailContext'
import { CartContext } from '@/context/CartContext'

const CheckoutButton = ({ amount }: { amount: number }) => {
  const { UserDetail } = useContext(UserDetailContext)
  const { cart, setCart } = useContext(CartContext)

  const config = {
    reference: new Date().getTime().toString(),
    email: UserDetail?.email || '',
    amount: amount * 100, // convert to kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    currency: 'NGN'
  }

  const initializePayment = usePaystackPayment(config)

const onSuccess = async (response: any) => {
  try {
    const res = await fetch('/api/verifyPayment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reference: response.reference,
        email: UserDetail?.email,
        customerName: UserDetail?.name,
        items: cart
      })
    })

    const data = await res.json()

    if (data.success) {
      // Delete all cart items from Strapi using documentId
      await Promise.all(
        cart.map((item: any) =>
          fetch('/api/cart', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documentId: item.documentId })
          })
        )
      )
      setCart([]) // clear local state
      window.location.href = '/order-success'
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

  const onClose = () => {
    console.log('Payment popup closed')
  }

  if (!UserDetail?.email) {
    return (
      <button
        disabled
        className='block rounded-sm border border-gray-300 bg-gray-100 px-5 py-3 text-sm text-gray-400 w-full text-center cursor-not-allowed'
      >
        Login to Checkout
      </button>
    )
  }

  return (
    <button
      onClick={() => initializePayment({ onSuccess, onClose })}
      className='block rounded-sm border border-blue-600 bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-blue-700 hover:bg-blue-700 w-full text-center'
    >
      Pay ₦{amount.toLocaleString()}
    </button>
  )
}

export default CheckoutButton