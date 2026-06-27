import { serverFetch } from "../core/server"

export const getProperties = async(filter, status="approved")=>{
    return serverFetch(`/properties?${filter}&status=${status}`)
}
export const getFeaturedProperties = async(status="approved")=>{
    return serverFetch(`/properties?$isFeatured=true&status=${status}`)
}

export const getPropertyById = async(id)=>{
    return serverFetch(`/properties/${id}`)
}

export const getPropertiesByOwner = async(id)=>{
    return serverFetch(`/properties?ownerId=${id}`)
}