import { getProperties } from "@/lib/api/properties";
import { getUserSession } from "@/lib/core/session";
import { getWishlistByTenant } from "@/lib/api/wishlist";
import PropertiesClient from "./PropertiesClient";

export default async function PropertiesPage({ searchParams }) {
  const filter = await searchParams;

  const querySearch = new URLSearchParams(filter);
  const queryString = querySearch.toString();

  const { properties, total } = await getProperties(queryString);
  const user = await getUserSession();
  const wishlistedIds = await getWishlistByTenant(user?.id);

  return (
    <PropertiesClient
      properties={properties}
      filter={filter}
      total={total}
      tenant={user}
      initialWishlist={wishlistedIds}
    />
  );
}