import axios from "axios"

export const axiosClient = axios.create({
    baseURL: 'https://kaykes.onrender.com/api',
    headers: {
        Authorization: `Bearer ` + process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
    }
})