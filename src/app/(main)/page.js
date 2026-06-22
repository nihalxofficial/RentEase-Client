import CustomerReviews from "@/components/homepage/CustomerReviews";
import FeaturedProperties from "@/components/homepage/FeaturedProperties";
import HeroBanner from "@/components/homepage/HeroBanner";
import HowItWorks from "@/components/homepage/HowItWorks";
import Newsletter from "@/components/homepage/Newsletter";
import PropertyAmenities from "@/components/homepage/PropertyAmenities";
import TopLocations from "@/components/homepage/TopLocations";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroBanner/>
      <FeaturedProperties/>
      <WhyChooseUs/>
      <PropertyAmenities/>
      <CustomerReviews/>
      <TopLocations/>
      <HowItWorks/>
      <Newsletter/>
    </div>
  );
}
