import { serverFetch } from "../core/server"

export const getUsers = async()=>{
    return serverFetch(`/users`);
}

export const getUserById = async(id)=>{
    return serverFetch(`/users/${id}`);
}