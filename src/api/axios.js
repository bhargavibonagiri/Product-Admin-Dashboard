import axios from "axios"

const api = axios.create({
    baseURL: "https://dummyjson.com"
})

api.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem("token")

        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) =>{
        return Response
    },
    (error) =>{
        if(error.response?.status === 401){
            localStorage.removeItem("token")
        }
        return Promise.reject(error)
    }
)