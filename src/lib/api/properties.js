import { serverFetch } from "../core/server"

export const getProperties = async(filter, status="approved")=>{
    return serverFetch(`/properties?${filter}&status=${status}`)
}