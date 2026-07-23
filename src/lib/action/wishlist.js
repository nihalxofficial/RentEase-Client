import { serverMutation } from "../core/server"

export const addToWishlist = async(wish)=>{
  // console.log(wish);
    return serverMutation(`/wishlist`, wish)
}

export const removeWishlist = async (propertyId, tenantId) => {
  return serverMutation(`/wishlist?propertyId=${propertyId}&tenantId=${tenantId}`, "", "DELETE");
};