import Image from "next/image";
import { Button } from "@/components/ui/button";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Categories from "./_components/Categories";
import PopularProducts from "./_components/PopularProducts";
import Footer from "./_components/Footer";

export default function Home() {
  return (
      <div>

        {/* Hero */}
        <Hero />
        
        {/* Category List */}
        <Categories />
        
        {/* Product List */}
        <PopularProducts />

        {/* Footer */}
        <Footer />
      </div>
  );
}
