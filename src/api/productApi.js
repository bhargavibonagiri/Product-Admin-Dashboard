import api from "./axios";

export const getProducts = async (limit, skip) => {
    const response = await api.get(`/products?limit=${limit}&skip=${skip}`)

    return response.data
}

export const searchProducts = async (query, limit, skip, signal) => {
    const response = await api.get(`/products/search?q=${query}&limit=${limit}&skip=${skip}`,
        {
            signal: signal
        }
    )
    return response.data
}

export const getProduct = async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data

}

export const getCategories = async () => {
    const response = await api.get("/products/categories")

    return response.data
}

export const addProduct = async (product) => {
    const response = await api.post("/products/add", product)

    return response.data
}

export const updateProduct = async (id, product) => {
    const response = await api.put(`/products/${id}`,
        product
    )
    return response.data
}

export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`)

    return response.data
}