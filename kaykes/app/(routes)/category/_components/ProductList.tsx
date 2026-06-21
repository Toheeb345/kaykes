"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios';
import { Product } from '@/app/_components/PopularProducts';
import ProductCard from '@/app/_components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from "@/components/ui/card"




const ProductList = () => {
    const { categoryName } = useParams();
    const [ loading, setLoading]=useState(false);
    const [ productList, setProductList ] = useState<Product[]>()
    console.log(categoryName)

    useEffect(() => {
        GetProductByCategory();
    }, [])

    const GetProductByCategory = async () => {
        setLoading(true)
        try{
        const result = await axios.get('/api/products?category=' + categoryName)
        console.log(result.data)
        setProductList(result.data)
        setLoading(false)
        }
        catch(e){
            setLoading(false)
        }
    }

  return categoryName && (
    <div>
        {/* @ts-ignore */}
        <h2 className=' font-bold text-3xl'>{categoryName?.charAt(0) + categoryName?.slice(1)}</h2>
        <p className=' text-lg'>Lets help customize the best {categoryName} for your brand!</p>

        {/* product list */}
        <div className=' grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-7'>
            {productList && productList?.length > 0? productList?.map((product: Product, index: number) => (
                <ProductCard key={index} product={product} />
            ))
        :
        [1, 2, 3, 4, 5].map((item, index) => (
    <Card className="w-full max-w-xs" key={index}>
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
        ))
        }
        </div>
    </div>
  )
}

export default ProductList