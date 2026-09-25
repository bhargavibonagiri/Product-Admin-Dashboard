import api from "./axios";

export const getProducts = async (limit, skip, sortBy, order, signal) => {
    const response = await api.get(`/products?limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}`, {
        signal
    })

    return response.data
}

export const searchProducts = async (query, limit, skip, signal, sortBy, order) => {
    const response = await api.get(`/products/search?q=${query}&limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}`,
        {
            signal
        }

    )
    return response.data
}

export const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data

}

export const getCategories = async (signal) => {
    const response = await api.get("/products/categories", {
        signal
    })

    return response.data
}

export const getProductsByCategory = async (category, limit, skip, sortBy, order, signal) => {

    const response = await api.get(`/products/category/${category}?limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}`,
        {
            signal
        }
    )

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