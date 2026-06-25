import axios from "axios"

export const axiosClient = axios.create({
    baseURL: 'https://fabulous-heart-acddc98059.strapiapp.com/api',
    headers: {
        Authorization: `Bearer ` + process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
    }
})