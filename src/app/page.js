import CustomerReviews from "@/components/homepage/CustomerReviews";
import FeaturedProperties from "@/components/homepage/FeaturedProperties";
import HeroBanner from "@/components/homepage/HeroBanner";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroBanner/>
      <FeaturedProperties/>
      <WhyChooseUs/>
      <CustomerReviews/>
    </div>
  );
}
