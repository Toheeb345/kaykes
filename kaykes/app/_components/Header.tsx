"use client"
import { Button } from '@/components/ui/button'
import { CartContext } from '@/context/CartContext'
import { UserDetailContext } from '@/context/UserdetailContext'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
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

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
      
  //     // @ts-ignore
  //     const tokenResponse = JSON.parse(localStorage.getItem('tokenResponse'));
  //     if (tokenResponse) {
  //       GetUserProfile(tokenResponse?.access_token)
  //     }

  //   }
  // },[])

  useEffect(() => {
  // 1. FIX: typeof returns a string, so we must compare it to the string 'undefined'
  if (typeof window !== 'undefined') {
    
    // 2. FIX: Grab the raw string first
    const rawToken = localStorage.getItem('tokenResponse');

    // 3. FIX: Only parse if it exists and isn't the literal string "undefined"
    if (rawToken && rawToken !== 'undefined') {
      try {
        const tokenResponse = JSON.parse(rawToken);
        
        // Check if tokenResponse and access_token exist before calling the API
        if (tokenResponse?.access_token) {
          GetUserProfile(tokenResponse.access_token);
        }
      } catch (error) {
        // This catches the error so your app doesn't crash on a bad token!
        console.error("Failed to parse tokenResponse:", error);
        
        // Optional: clear the corrupted token so it doesn't keep failing
        // localStorage.removeItem('tokenResponse'); 
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

// Get user Info
const GetUserProfile = async(access_token: string) => {
  try{
      const userInfo = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: 'Bearer' + access_token } },
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
    <div className=' flex justify-between items-center p-4'>
        <Image src={"/logo.svg"} alt='logo' width={50} height={40}/>
        <ul className='flex gap-5'>
        {menu.map((item,index) => (
            <li className='text-lg' key={index}>{item.name}</li>
        ))}
        </ul>

        <div className=' flex gap-3 items-center'>
          <div className=' flex gap-2 justify-center items-center'>
        <ShoppingCart /> <span className=' p-1 bg-gray-100 px-2 rounded-full'>{cart?.length ?? 0}</span>
        </div>
        {!user ? 
        <Button onClick={() => googleLogin()}>SignUp/LogIn</Button>
        : 
        <Image src={user?.picture} alt={user.name} width={30} height={20} className=' rounded-full' />
        }
        </div>
    </div>
  )
}

export default Header