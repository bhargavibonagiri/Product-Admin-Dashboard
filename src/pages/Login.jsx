import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";

function Login() {
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (loading) {
            return
        }

        setError("")

        if (!username.trim()) {
            setError("Username is required")
            return
        }

        if (!password.trim()) {
            setError("Password is required")
            return
        }

        setLoading(true)

        try {
            const data = await loginUser(username, password)

            console.log("Login success", data);
            console.log("ACCESS TOKEN:", data?.accessToken);

            if (!data?.accessToken) {
                setError("Login failed: access token not received");
                return;
            }

            localStorage.setItem("token", data.accessToken)

            localStorage.setItem("user", JSON.stringify(data))

            navigate("/products")

        }
        catch (err) {

            console.log("LOGIN ERROR:", error);
            console.log("ERROR RESPONSE:", error.response);
            console.log("ERROR DATA:", error.response?.data);


            setError(err.response?.data?.message || err.message || "Invalid username or password")
        }
        finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-x1 shadow-lg p-8">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Product Admin</h1>

                        <p className="text-gray-500 mt-2">Login to manage your products</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label htmlFor="userName"
                                className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>

                            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username" className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>

                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        {error && (
                            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg" >

                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition">
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">Demo credentials</p>

                        <p className="text-sm text-gray-500">
                            Username: <span className="font-medium">emilys</span>
                        </p>

                        <p className="text-sm text-gray-500">
                            Password: <span className="font-medium">emilyspass</span>
                        </p>
                    </div>
                </div>

            </div>

        </div>
    )

}

export default Login