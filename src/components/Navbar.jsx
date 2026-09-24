import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        navigate("/login", { replace: true })
    }

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <h1 className="text-x1 font-bold text-gray-800">
                    Product Admin
                </h1>

                <button onClick={handleLogout} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                    Logout
                </button>
            </div>
        </nav>
    )

}

export default Navbar