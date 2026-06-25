import axios from "axios"

export const axiosClient = axios.create({
    baseURL: 'https://ingenious-horse-4f1726e4c5.strapiapp.com/api',
    headers: {
        Authorization: `Bearer ` + process.env.STRAPI_API_TOKEN
    }
})