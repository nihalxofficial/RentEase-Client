import { serverFetch } from "../core/server"

export const checkWishlist = async(propertyId, tenantId)=>{
    return serverFetch(`/wishlist/check?propertyId=${propertyId}&tenantId=${tenantId}`)
}