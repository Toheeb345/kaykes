"use client"
import { Button } from '@/components/ui/button'
import { CartContext } from '@/context/CartContext'
import { UserDetailContext } from '@/context/UserdetailContext'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { ShoppingCart, Menu, X } from 'lucide-react' // Added Menu and X
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'

const menu = [
    {
    id: 1,
    name: 'Home',
    path: '/'
    },
    {
    id: 2,
    name: 'Products',
    path: '/Products'
    },
    {
    id: 3,
    name: 'AboutUs',
    path: '/'
    },
    {
    id: 4,
    name: 'ContactUs',
    path: '/'
    },
]

export type User = {
  name: string,
  email: string,
  picture: string
}

const Header = () => {
  const [user, setUser] = useState<User>();
  const {UserDetail, setUserDetail} = useContext(UserDetailContext)
  const { cart, setCart } = useContext(CartContext)
  
  // NEW: State to handle mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
  if (typeof window !== 'undefined') {
    const rawToken = localStorage.getItem('tokenResponse');

    if (rawToken && rawToken !== 'undefined') {
      try {
        const tokenResponse = JSON.parse(rawToken);
        if (tokenResponse?.access_token) {
          GetUserProfile(tokenResponse.access_token);
        }
      } catch (error) {
        console.error("Failed to parse tokenResponse:", error);
      }
    }
  }
}, []);

const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    console.log(tokenResponse);
    localStorage.setItem('tokenResponse', JSON.stringify(tokenResponse))
   await GetUserProfile(tokenResponse?.access_token);
  },
  onError: errorResponse => console.log(errorResponse),
});

const GetUserProfile = async(access_token: string) => {
  try{
      const userInfo = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: 'Bearer ' + access_token } }, // Note: Added space after Bearer
    );
    console.log(userInfo)
    setUser(userInfo?.data)
    setUserDetail(userInfo?.data)
    SaveNewUser(userInfo?.data)
  }
  catch(e)
  {
    localStorage.setItem('tokenResponse', '')
  }
}

const SaveNewUser = async (user: User) => {
  const result = await axios.post('/api/users', {
    name: user?.name,
    email: user?.email,
    picture: user?.picture
  })
  console.log(result.data)
}

useEffect(() => {
  console.log("UserDetail changed:", UserDetail)
  if (UserDetail?.email) {
    GetCartList();
  }
}, [UserDetail])

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

  return (
    // Added relative and bg-white so the absolute mobile menu positions correctly underneath it
    <div className='relative bg-white z-50 flex justify-between items-center p-4 shadow-sm'>
        
        <Image src={"/logo.svg"} alt='logo' width={50} height={40}/>
        
        {/* DESKTOP NAV: Hidden on mobile, flex on md screens and up */}
        <ul className='hidden md:flex gap-5'>
          {menu.map((item,index) => (
              <Link href={item.path} key={index}>
                <li className='text-lg hover:text-gray-600 transition-colors'>{item.name}</li>
              </Link>
          ))}
        </ul>

        <div className='flex gap-4 items-center'>
            <Link href={'/carts'} className='flex gap-2 justify-center items-center'>
              <ShoppingCart /> 
              <span className='p-1 bg-gray-100 px-2 rounded-full text-sm font-medium'>{cart?.length ?? 0}</span>
            </Link>
            
            {!user ? 
              <Button onClick={() => googleLogin()} className='hidden md:block'>SignUp/LogIn</Button>
            : 
              <Image src={user?.picture} alt={user.name} width={30} height={30} className='rounded-full hidden md:block' />
            }

            {/* MOBILE TOGGLE BUTTON: Shows on mobile, hidden on md screens and up */}
            <button 
              className='md:hidden p-2 text-gray-600'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isMenuOpen && (
          <div className='absolute top-full left-0 w-full bg-white shadow-md border-t md:hidden flex flex-col p-4'>
            <ul className='flex flex-col gap-4 mb-4'>
              {menu.map((item,index) => (
                  <Link 
                    href={item.path} 
                    key={index}
                    onClick={() => setIsMenuOpen(false)} // Close menu when a link is clicked
                  >
                    <li className='text-lg font-medium'>{item.name}</li>
                  </Link>
              ))}
            </ul>
            
            {/* Mobile Auth/Profile logic */}
            <div className='pt-4 border-t'>
              {!user ? 
                <Button onClick={() => googleLogin()} className='w-full'>SignUp/LogIn</Button>
              : 
                <div className='flex items-center gap-3'>
                  <Image src={user?.picture} alt={user.name} width={40} height={40} className='rounded-full' />
                  <span className='font-medium'>{user.name}</span>
                </div>
              }
            </div>
          </div>
        )}
    </div>
  )
}

export default Header