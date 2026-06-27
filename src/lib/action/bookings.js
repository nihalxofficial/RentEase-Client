import { serverMutation } from "../core/server"

export const addBooking = async(data)=>{
    return serverMutation(`/bookings`, data)
}

export const approveBooking = async(id, data)=>{
    return serverMutation(`/bookings/${id}`, data, "PATCH")
}

export const rejectBooking = async(id, data)=>{
    return serverMutation(`/bookings/${id}`, data, "PATCH")
}

