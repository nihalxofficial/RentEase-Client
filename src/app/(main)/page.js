import CustomerReviews from "@/components/homepage/CustomerReviews";
import FeaturedProperties from "@/components/homepage/FeaturedProperties";
import HeroBanner from "@/components/homepage/HeroBanner";
import HowItWorks from "@/components/homepage/HowItWorks";
import Newsletter from "@/components/homepage/Newsletter";
import PropertyAmenities from "@/components/homepage/PropertyAmenities";
import TopLocations from "@/components/homepage/TopLocations";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";
import { getFeaturedProperties } from "@/lib/api/properties";
import { getUserSession } from "@/lib/core/session";

export default async function Home() {
  const {properties} = await getFeaturedProperties();
  // console.log(properties);
  const user = await getUserSession();
  return (
    <div>
      <HeroBanner/>
      <FeaturedProperties userId={user?.id} initialProperties={properties}/>
      <WhyChooseUs/>
      <PropertyAmenities/>
      <CustomerReviews/>
      <TopLocations/>
      <HowItWorks/>
      <Newsletter/>
    </div>
  );
}
