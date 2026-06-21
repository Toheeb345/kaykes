import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
    <section className="bg-white lg:grid lg:h-screen lg:place-content-center">
  <div className="mx-auto w-screen max-w-fit px-4 py-8 sm:px-6 sm:py-24 md:grid md:grid-cols-2 md:items-center md:gap-20 sm:gap-10">
    <div className="max-w-prose text-left">
      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
        Create  , 
        <strong className="text-primary"> Customize</strong>
        & Order
      </h1>

      <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
      Why waste materials on testing? when you can just VISUALIZE
      </p>

      <div className="mt-4 flex gap-4 sm:mt-6">
        <a className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700" href="#">
          Start Designing
        </a>

        <a className="inline-block rounded border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900" href="#">
          Explore
        </a>
      </div>
    </div>

    <Image className='' src={'/hero-img.jpg'} alt='hero' width={550} height={450}/>
  </div>
</section>
  )
}

export default Hero