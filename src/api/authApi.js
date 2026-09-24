import api from "./axios"

export const loginUser = async (username, password) => {
    const response = await api.post("/auth/login", {
        username,
        password
    })

    console.log("AXIOS RESPONSE:", response);
    console.log("AXIOS RESPONSE DATA:", response.data);
    return response.data
}