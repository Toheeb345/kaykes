'use client'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Category = {
    name: string,
    icon: {
        url: string
    },
    documentId: string,
    Id: number,
    slug: string
}

const Categories = () => {

    const[ categoryList, setCategoryList]=useState<Category[]>()

    useEffect(() => {
        GetCategoryList()
    }, []) 

    const GetCategoryList = async () => {
        const result = await axios.get('/api/categories')
        console.log(result.data)
        setCategoryList(result?.data?.data)
    }

  return (
    <div>
        <h2 className=' font-bold text-2xl'>Popular Categories</h2>
        <div className=' grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5'>
            {categoryList?.map((category: Category, index: number) => (
                <Link href={'/category/'+category?.slug} key={index} className=' p-4 border rounded-lg flex flex-col items-center hover:border-primary cursor-pointer'>
                    <Image src={category?.icon?.url} alt={category.name} height={80} width={80} />
                    <h2 className=' font-medium text-lg'>{category?.name}</h2>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default Categories