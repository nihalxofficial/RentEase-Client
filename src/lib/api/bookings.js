import { serverFetch } from "../core/server"

export const getBookingsByTenant = async(id)=>{
    return serverFetch(`/bookings?userId=${id}`)
}