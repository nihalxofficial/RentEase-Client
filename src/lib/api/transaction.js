import { serverFetch } from "../core/server"

export const getTransactionsByTenant = async(id)=>{
    return serverFetch(`/transactions?userId=${id}`)
}