"use client"
import PopularProducts, { Product } from '@/app/_components/PopularProducts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { Palette, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import ProductCustomizeStudio from '../_components/ProductCustomizeStudio';
import { CartContext } from '@/context/CartContext';
import { UserDetailContext } from '@/context/UserdetailContext';

function ProductDetail() {
    const { productId } = useParams();
    const [ product, setProduct] = useState<Product>()
    const [ loading, setLoading ]= useState(false);
    const [ enableCustomizeStudio, setEnableCustomizeStudio] = useState(false)
    const { cart, setCart } = useContext(CartContext)
   const {UserDetail, setUserDetail} = useContext(UserDetailContext)
   const [ designUrl, setDesignUrl ] = useState<string>()
    

    useEffect(() => {
      productId && GetProductById();
    }, [productId])

    const GetProductById = async () => {
      setLoading(true);
      const result = await axios.get('/api/products?productId=' +productId)
      console.log(result.data)
      setProduct(result.data);
      setLoading(false)
    }

    const AddToCart = async () => {
  console.log("Current cart value:", cart); // log current state
  setCart((prev: any) => {
    console.log("prev type:", typeof prev, "isArray:", Array.isArray(prev), "value:", prev);
    return [...(Array.isArray(prev) ? prev : []), {
      design: designUrl,
      products: product,
      userEmail: UserDetail?.email
    }];
  });

    
    

      // save to DB
      const result = await axios.post('/api/cart', {
        product: product,
        designUrl: designUrl,
        userEmail: UserDetail?.email
      })
      console.log(result.data)
    }

    return (

      <div>

    <div className=' grid grid-cols-1 md:grid-cols-2 my-14 gap-10'>
      <div className=' flex items-center justify-center'>
        {/* image */}
        { product ?
        !enableCustomizeStudio ? 
        <Image src={product?.productimage[0]?.url} alt={product?.title} width={400} height={300}/> :
        <ProductCustomizeStudio product={product} setDesignUrl={(url: string) => setDesignUrl(url)} /> 
        :
        <Skeleton className=' w-full h-75' />
        }
      </div>
      <div>
      { product ?<div className=' flex flex-col gap-3'>
        {/* info */}
        <h2 className=' font-bold text-3xl'>{product?.title}</h2>
        <h2 className='font-bold text-2xl'>
          {product?.pricing?.toLocaleString('en-US', {
           style: 'currency',
           currency: 'NGN', 
           minimumFractionDigits: 0,
  })}
        </h2>
          <p className=' font-bold text-gray-600'>{product?.description}</p>
          <div>
            <h2 className=' font-bold text-lg'>Size</h2>
            <div className=' flex gap-2.5'>
              <Button variant={'outline'}>S</Button>
              <Button variant={'outline'}>M</Button>
              <Button variant={'outline'}>L</Button>
              <Button variant={'outline'}>LG</Button>
            </div>
          </div>
         { !enableCustomizeStudio && <Button size={'lg'} onClick={() => setEnableCustomizeStudio(true)}> <Palette /> Customize </Button> } 
          <Button size={'lg'} variant={!enableCustomizeStudio ? "outline" : "default"} onClick={() => AddToCart()}> <ShoppingCart /> Add To Cart </Button>
      </div>
      :
      <div className=' space-y-3'>
        <Skeleton className=' w-full h-5' />
        <Skeleton className=' w-full h-8' />
        <Skeleton className=' w-full h-10' />
        <Skeleton className=' w-full h-10' />
      </div>
       }
      </div>

    </div>
        <div className=' mt-3'>
          <h2 className=' font-bold text-lg'>Product Description</h2>
          <p className=' text-gray-600'>{product?.description}</p>
      </div>
      <PopularProducts />
    </div>
  )
}

export default ProductDetail