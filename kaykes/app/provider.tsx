"use client"
import { UserDetailContext } from '@/context/UserdetailContext'
import React, { useState } from 'react'
import Header, { User } from './_components/Header';
import { CartContext } from '@/context/CartContext';

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
    const [UserDetail, setUserDetail] = useState<User | undefined>(undefined);
    const [cart, setCart] = useState([]);

    //Get Cart
  return (
    <div>
        {/* @ts-ignore */}
        <UserDetailContext.Provider value={{ UserDetail, setUserDetail }}>
          <CartContext.Provider value={{ cart, setCart }}>
            {/* <Header /> */}
            {children}
          </CartContext.Provider>
        
        </UserDetailContext.Provider>
        </div>
  )
}

export default Provider