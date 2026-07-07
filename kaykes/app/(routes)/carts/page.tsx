"use client"
import { Product } from '@/app/_components/PopularProducts'
import { CartContext } from '@/context/CartContext'
import axios from 'axios'
import React, { useContext } from 'react'
import { UserDetailContext } from '@/context/UserdetailContext'
import dynamic from 'next/dynamic'

const CheckoutButton = dynamic(() => import('@/components/ui/CheckoutButton'), {
  ssr: false
})


type CartItem = {
    documentId: string,
    products: Product[],
    design: string,
    id: number,
}

const Carts = () => {

    const { cart, setCart } = useContext(CartContext);
    const {UserDetail, setUserDetail} = useContext(UserDetailContext)
    
    console.log(cart)

    const removeFromCart = async (documentId: string) => {
      const result = await axios.delete('/api/cart', {
        data: {
        documentId: documentId
        }
      });
      GetCartList()
    }

    const GetCartList = async () => {
      console.log("GetCartList called with email:", UserDetail?.email)
      try {
        const result = await axios.get('/api/cart?email=' + UserDetail?.email)
        console.log("Cart API response:", result.data)
        setCart(Array.isArray(result.data) ? result.data : [])
      } catch (e) {
        console.error("Failed to fetch cart:", e)
        setCart([])
      }
    }

const GetTotalCartAmount = () => {
  if (!cart || !Array.isArray(cart)) return 0;

  const totalPrice = cart.reduce((total: number, cartItem: any) => {
    let itemTotal = 0;

    // 1. If it's an array of products, run the reduce loop
    if (Array.isArray(cartItem?.products)) {
      itemTotal = cartItem.products.reduce((sum: number, product: any) => {
        return sum + (Number(product?.pricing) || 0);
      }, 0);
    } 
    // 2. If it's a single product object instead, grab the price directly
    else if (cartItem?.products?.pricing) {
      itemTotal = Number(cartItem.products.pricing) || 0;
    }
    // 3. Fallback check in case the backend field is singular 'product'
    else if (cartItem?.product?.pricing) {
      itemTotal = Number(cartItem.product.pricing) || 0;
    }

    return total + itemTotal;
  }, 0);

  return totalPrice;
};

  return (

    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ul className="space-y-4">

        {cart?.map((cartItem: CartItem, index: number) => {
          return(
          
            <li className="flex items-center gap-4" key={index}>
          <img
            src={cartItem?.products[0]?.productimage[0].url}
            alt=""
            className="size-16 rounded-sm object-cover"
          />
          <img
            src={cartItem?.design}
            alt=""
            className="size-16 rounded-sm object-cover"
          />
          <div>
            <h3 className="text-sm text-gray-900 dark:text-white">{cartItem?.products[0]?.title}</h3>

          </div>

          <div className="flex flex-1 items-center justify-end gap-2">
            <div>
              <label htmlFor="Line1Qty" className="sr-only">Quantity</label>
              <input
                type="number"
                min="1"
                defaultValue="1"
                id="Line1Qty"
                className="h-8 w-12 rounded-sm border-gray-300 bg-white p-0 text-center text-xs text-gray-700 [-moz-appearance:textfield] focus:outline-hidden dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>

            <button className="text-gray-600 transition hover:text-red-600 dark:text-gray-300 dark:hover:text-red-300" onClick={() => removeFromCart(cartItem?.documentId)}>
              <span className="sr-only">Remove item</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        </li>
        )})}
      </ul>

      <div className="mt-8 space-y-6 border-t border-gray-100 pt-8 dark:border-gray-800">
        <dl className="ml-auto max-w-sm space-y-1 text-sm text-gray-700 dark:text-gray-200">

          <div className=" flex justify-between font-semibold gap-5">
            <dt>Total</dt>
            <dd>{GetTotalCartAmount()?.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}</dd>
          </div>
        </dl>

        <div className="flex items-center justify-end gap-4">
          <a
            href="/orders"
            className="block rounded-sm border border-gray-300 bg-gray-50 px-5 py-3 text-sm text-gray-700 transition-colors hover:text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:text-white"
          >
            My orders
          </a>

<CheckoutButton amount={GetTotalCartAmount()} />
        </div>

        <div className="text-right">
          <a
            href="/products"
            className="inline-block text-sm text-gray-600 underline underline-offset-4 transition-colors hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
          >
            Continue shopping
          </a>
        </div>
      </div>
    </div>
  )
}


export default Carts