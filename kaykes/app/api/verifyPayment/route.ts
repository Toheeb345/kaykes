import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { reference, items, customerName, email } = await req.json()

    // 1. Verify payment with Paystack
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    )

    const paystackData = await paystackRes.json()

    if (paystackData.data.status !== 'success') {
      return NextResponse.json({ success: false, message: 'Payment verification failed' }, { status: 400 })
    }

    // 2. Save order to Strapi
const orderRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`
  },
  body: JSON.stringify({
    data: {
      reference: paystackData.data.reference,
      amount: paystackData.data.amount / 100,
      email: email,
      paymentStatus: 'paid',
      customerName: customerName,
      items: items
    }
  })
})

const orderData = await orderRes.json()
console.log('Order response status:', orderRes.status)
console.log('Order response data:', JSON.stringify(orderData))

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}