import Navbar from "../components/Navbar";
import { getProducts, searchProducts } from "../api/productApi";
import { useEffect, useState, useRef } from "react";


function Products() {

    const [search, setSearch] = useState("")
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalProducts, setTotalproducts] = useState(0)
    const [productsPerPage, setProductsPerPage] = useState(10)
    const abortControllerRef = useRef(null)


    const totalPages = Math.ceil(totalProducts / productsPerPage)

    const fetchProducts = async () => {

        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        const controller = new AbortController()
        abortControllerRef.current = controller


        try {
            setLoading(true)
            setError("")

            const skip = (currentPage - 1) * productsPerPage
            console.log("Current Page", currentPage);
            console.log("Skip", skip);

            // const data = await getProducts(productsPerPage, skip);

            let data
            if (search.trim()) {

                data = await searchProducts(search, productsPerPage, skip, controller.signal)
            }
            else {
                data = await getProducts(productsPerPage, skip)
            }

            console.log("Product data: ", data)

            setProducts(data.products)

            setTotalproducts(data.total)
        }
        catch (err) {

            if (err.name === "CanceledError" || err.name === "AbortError") {
                return
            }

            console.log("Product error: ", err);

            setError("Failed to load Products")
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [search])

    useEffect(() => {

        const timer = setTimeout(() => {
            fetchProducts()
        }, 500)

        return () => {
            clearTimeout(timer)
        }

    }, [currentPage, productsPerPage, search])

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const handlePageSizeChange = (e) => {
        setProductsPerPage(Number(e.target.value))
        setCurrentPage(1)
    }

    return (
        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-8">

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Products</h2>

                    <p className="mt-2 text-gray-500 mt-1">Manage Your Products</p>
                </div>

                {/* search */}

                <div className="mb-4">

                    <input type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-96 px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing{" "}
                        {totalProducts === 0 ? 0 : (currentPage - 1) * productsPerPage + 1}
                        {" - "}
                        {Math.min(currentPage * productsPerPage, totalProducts)}
                        {" "}of {totalProducts}

                    </div>

                    <div className="flex items-center gap-2">

                        <label className="text-sm text-gray-600">Show</label>

                        <select
                            value={productsPerPage}
                            onChange={handlePageSizeChange}
                            className="border rounded-lg px-3 py-2 bg-white">

                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>

                    </div>

                </div>

                {loading && (
                    <div className="bg-white rounded-lg p-8 text-center">
                        <p className="text-gray-500">Loading products...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="bg-white rounded-lg p-8 text-center">
                        <p className="text-red-500 mb-4">{error}</p>

                        <button onClick={fetchProducts}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">

                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left px-6 py-4">Product</th>
                                        <th className="text-left px-6 py-4">Category</th>
                                        <th className="text-left px-6 py-4">Price</th>
                                        <th className="text-left px-6 py-4">Rating</th>
                                        <th className="text-left px-6 py-4">Stock</th>

                                    </tr>
                                </thead>

                                <tbody>
                                    {products.map((product) => (

                                        <tr key={product.id}
                                            className="border-b last:border-b-0 hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <img src={product.thumbnail} alt={product.title}
                                                        className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                                                        onError={(e) => {
                                                            console.log("IMAGE FAILED:", product.thumbnail);
                                                            e.currentTarget.style.display = "none";
                                                        }} />

                                                    <span className="font-medium text-gray-800">{product.title}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-gray-600">{product.category}</td>
                                            <td className="px-6 py-4 text-gray-600">${product.price}</td>
                                            <td className="px-6 py-4 text-gray-600">⭐ {product.rating}</td>
                                            <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile  */}

                        <div className="md:hidden space-y-4">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-lg shadow p-4">

                                    <div className="flex items-center gap-4">
                                        <img src={product.thumbnail} alt={product.title} className="w-16 h-16 object-cover rounded-lg bg-gray-100" />

                                        <div>
                                            <h3 className="font-semibold text-gray-800">{product.title}</h3>
                                            <p className="text-sm text-gray-500">{product.category}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-3 gap-3 text-sm">

                                        <div>
                                            <p className="text-gray-500">Price</p>
                                            <p className="font-medium text-gray-800">${product.price}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">Rating</p>
                                            <p className="font-medium text-gray-800">
                                                ⭐ {product.rating}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">Stock</p>
                                            <p className="font-medium text-gray-800">
                                                {product.stock}
                                            </p>
                                        </div>

                                    </div>

                                </div>
                            ))}

                        </div>

                        {/* Pagination */}

                        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
                            <button onClick={handlePrevious}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                                Previous
                            </button>

                            {currentPage > 2 && (
                                <>
                                    <button
                                        onClick={() => handlePageClick(1)}
                                        className="px-3 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50"
                                    >
                                        1
                                    </button>

                                    {currentPage > 3 && (
                                        <span className="px-2 text-gray-500">
                                            ...
                                        </span>
                                    )}
                                </>
                            )}

                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            ).filter((pageNumber) => pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                .map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageClick(pageNumber)}
                                        className={`px-3 py-2 rounded-lg border ${currentPage === pageNumber
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}

                            {currentPage < totalPages - 1 && (

                                <>
                                    {currentPage < totalPages - 2 && (
                                        <span className="px-2 text-gray-500">
                                            ...
                                        </span>
                                    )}

                                    <button
                                        onClick={() => handlePageClick(totalPages)}
                                        className="px-3 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50"
                                    >
                                        {totalPages}
                                    </button>
                                </>

                            )}
                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="text-center mt-4 text-sm text-gray-500">
                            Page {currentPage} of {totalPages}
                        </div>
                    </>
                )}


            </main>

        </div>
    )

}

export default Products