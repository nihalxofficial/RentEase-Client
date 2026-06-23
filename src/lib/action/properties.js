import { serverMutation } from "../core/server"

export const addProperty = async(data)=>{
    return serverMutation(`/properties`, data)
}