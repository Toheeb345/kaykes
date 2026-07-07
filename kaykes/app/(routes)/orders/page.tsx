"use client"
import { UserDetailContext } from '@/context/UserdetailContext'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'

type Order = {
  id: number
  documentId: string
  reference: string
  amount: number
  email: string
  paymentStatus: string
  customerName: string
  items: any[]
  createdAt: string
}

export default function OrdersPage() {
  const { UserDetail } = useContext(UserDetailContext)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (UserDetail?.email) {
      fetchOrders()
    }
  }, [UserDetail])

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders?email=' + UserDetail?.email)
      setOrders(res.data)
    } catch (e) {
      console.error('Failed to fetch orders:', e)
    } finally {
      setLoading(false)
    }
  }

  if (!UserDetail?.email) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
        <h2 className='text-xl font-semibold'>Please login to view your orders</h2>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-gray-500'>Loading your orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
        <h2 className='text-xl font-semibold'>No orders yet</h2>
        <a href='/' className='bg-black text-white px-6 py-3 rounded-full text-sm'>
          Start Shopping
        </a>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-10'>
      <h1 className='text-2xl font-bold mb-8'>My Orders</h1>

      <div className='flex flex-col gap-6'>
        {orders.map((order) => (
          <div key={order.documentId} className='border rounded-xl p-6 shadow-sm'>
            
            {/* Order header */}
            <div className='flex justify-between items-start flex-wrap gap-4 mb-4'>
              <div>
                <p className='text-xs text-gray-400 mb-1'>Order Reference</p>
                <p className='text-sm font-mono font-medium'>{order.reference}</p>
              </div>
              <div>
                <p className='text-xs text-gray-400 mb-1'>Date</p>
                <p className='text-sm'>{new Date(order.createdAt).toLocaleDateString('en-NG', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}</p>
              </div>
              <div>
                <p className='text-xs text-gray-400 mb-1'>Amount</p>
                <p className='text-sm font-semibold'>₦{order.amount?.toLocaleString()}</p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.paymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Order items */}
            {order.items && order.items.length > 0 && (
              <div className='border-t pt-4'>
                <p className='text-xs text-gray-400 mb-3'>Items</p>
                <div className='flex flex-col gap-3'>
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className='flex items-center gap-3'>
                      {item.products?.[0]?.productimage?.[0]?.url && (
                        <img
                          src={item.products[0].productimage[0].url}
                          alt={item.products[0]?.title}
                          className='w-12 h-12 object-cover rounded-lg'
                        />
                      )}
                      <div>
                        <p className='text-sm font-medium'>{item.products?.[0]?.title}</p>
                        <p className='text-xs text-gray-500'>₦{item.products?.[0]?.pricing?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}