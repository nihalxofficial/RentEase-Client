import { serverFetch } from "../core/server"

export const checkWishlist = async(propertyId, tenantId)=>{
    return serverFetch(`/wishlist/check?propertyId=${propertyId}&tenantId=${tenantId}`)
}

export const getWishlistByTenant = async( tenantId)=>{
    const data = await serverFetch(`/wishlist?tenantId=${tenantId}`)
    return data.map(w => w.propertyId.toString());
}