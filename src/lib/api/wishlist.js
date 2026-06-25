import { serverFetch } from "../core/server"

export const checkWishlist = async(propertyId, tenantId)=>{
    return serverFetch(`/wishlist/check?propertyId=${propertyId}&tenantId=${tenantId}`)
}

export const getWishlistByTenant = async( tenantId)=>{
    return serverFetch(`/wishlist?tenantId=${tenantId}`)
}