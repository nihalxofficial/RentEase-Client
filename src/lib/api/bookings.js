import { serverFetch } from "../core/server"

export const getBookings = async()=>{
    return serverFetch(`/bookings`)
}
export const getBookingsByTenant = async(id)=>{
    return serverFetch(`/bookings?userId=${id}`)
}

export const getBookingsByOwner = async(id)=>{
    return serverFetch(`/bookings?ownerId=${id}`)
}