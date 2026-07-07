import { NextRequest, NextResponse } from 'next/server'
import { axiosClient } from '@/lib/axiosClient'

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email')
    
    const result = await axiosClient.get(
      `/orders?filters[email][$eq]=${email}&populate=*&sort=createdAt:desc`
    )
    
    return NextResponse.json(result.data.data)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json([], { status: 500 })
  }
}