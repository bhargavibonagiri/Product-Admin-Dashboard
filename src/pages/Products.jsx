import Navbar from "../components/Navbar";
import { getProducts, searchProducts, getCategories, getProductsByCategory, deleteProduct } from "../api/productApi";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Products() {

    const navigate = useNavigate()
    const location = useLocation()

    const searchParams = new URLSearchParams(location.search)

    const validSorts = [
        "price-asc",
        "price-desc",
        "rating-asc",
        "rating-desc",
        "title-asc",
        "title-desc"
    ]

    const urlPage = Number(searchParams.get("page"))
    const urlSort = searchParams.get("sort")

    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [currentPage, setCurrentPage] = useState(urlPage >= 1 && Number.isInteger(urlPage) ? urlPage : 1)
    const [productsPerPage, setProductsPerPage] = useState(10)
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState(searchParams.get("category") || "")
    const [sortBy, setSortBy] = useState(validSorts.includes(urlSort) ? urlSort : "")
    const [totalProducts, setTotalproducts] = useState(0)

    const abortControllerRef = useRef(null)


    const totalPages = Math.ceil(totalProducts / productsPerPage)

    const updateURL = (updates) => {

        const params = new URLSearchParams(location.search)

        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value)
            }
            else {
                params.delete(key)
            }
        })

        navigate(`/products?${params.toString()}`, { replace: true })
    }

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
            let apiSortBy = ""
            let apiOrder = ""

            if (sortBy) {
                const sortParts = sortBy.split("-")

                apiSortBy = sortParts[0]
                apiOrder = sortParts[1]
            }





            if (search.trim()) {

                data = await searchProducts(search, productsPerPage, skip, controller.signal, apiSortBy,
                    apiOrder)
            }
            else if (category) {
                data = await getProductsByCategory(category, productsPerPage, skip, apiSortBy,
                    apiOrder, controller.signal)
            }
            else {
                data = await getProducts(productsPerPage, skip, apiSortBy,
                    apiOrder, controller.signal)
            }

            console.log("Product data: ", data)


            // setProducts(data.products)
            // setTotalproducts(data.total)

            // let updatedProducts = data.products

            let updatedProducts = [...data.products]

            const addedProducts = JSON.parse(
                localStorage.getItem("addedProducts") || "[]"
            )

            const updatedSavedProducts = JSON.parse(
                localStorage.getItem("updatedProducts") || "[]"
            )

            updatedProducts = [
                ...addedProducts,
                ...updatedProducts
            ]

            updatedProducts = updatedProducts.map(product => {

                const updatedProduct = updatedSavedProducts.find(
                    item => item.id === product.id
                )

                return updatedProduct || product
            })

            setProducts(updatedProducts)

            setTotalproducts(
                data.total + addedProducts.length
            )
            // if (location.state?.addedProduct) {
            //     setProducts(prevProducts => [
            //         location.state.addedProduct,
            //         ...prevProducts
            //     ])

            //     setTotalproducts(data.total + 1)
            // }
        }
        catch (err) {

            if (err.name === "CanceledError" || err.name === "AbortError" || err.code === "ERR_CANCELED") {
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
        const controller = new AbortController()
        const fetchCategories = async () => {
            try {
                const data = await getCategories(controller.signal)
                setCategories(data)
            }
            catch (err) {


                if (
                    err.name === "CanceledError" ||
                    err.name === "AbortError" ||
                    err.code === "ERR_CANCELED"
                ) {
                    return
                }
                console.log("Category error: ", err);
            }
        }
        fetchCategories()

        return () => {
            controller.abort()
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            updateURL({
                search: search,
                page: 1
            })
        }, 500)
        return () => clearTimeout(timer)

    }, [search])

    useEffect(() => {

        const timer = setTimeout(() => {
            fetchProducts()
        }, 500)

        return () => {
            clearTimeout(timer)
        }

    }, [currentPage, productsPerPage, search, category, sortBy])


    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(1)

            updateURL({
                page: 1
            })
        }
    }, [totalPages, currentPage])

    // useEffect(() => {
    //     if (location.state?.addedProduct) {

    //         setProducts(prevProducts => [
    //             location.state.addedProduct,
    //             ...prevProducts
    //         ])
    //         setTotalproducts(prevTotal => prevTotal + 1)
    //     }

    //     if (location.state?.updatedProduct) {
    //         setProducts(prevProducts => prevProducts.map(product =>
    //             product.id === location.state.updatedProduct.id
    //                 ? location.state.updatedProduct : product
    //         ))
    //     }
    //     if (location.state?.addedProduct || location.state?.updatedProduct) {
    //         navigate("/products", {
    //             replace: true,
    //             state: null
    //         })
    //     }


    // }, [location.state, navigate])

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this product?")

        if (!confirmed) {
            return
        }

        try {

            await deleteProduct(id)

            setProducts(prevProducts =>
                prevProducts.filter(product => product.id !== id)
            )

            setTotalproducts(prevTotal => prevTotal - 1)
        }
        catch (err) {
            console.log("delete error: ", err);
            setError("Failed to delete product ")
        }
    }

    const handleNext = () => {
        if (currentPage < totalPages) {

            const nextPage = currentPage + 1

            setCurrentPage(nextPage)

            updateURL({
                page: nextPage
            })
        }
    }

    const handlePrevious = () => {
        if (currentPage > 1) {

            const previousPage = currentPage - 1

            setCurrentPage(previousPage)

            updateURL({
                page: previousPage
            })
        }
    }

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber)

        updateURL({
            page: pageNumber
        })
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

                {/* Edit product */}



                {/* Add Product */}

                <div className="mb-4 flex justify-end">

                    <button
                        onClick={() => navigate("/products/add")}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        + Add product
                    </button>

                </div>



                {/* search */}

                <div className="mb-4 flex flex-col md:flex-row gap-3">

                    <input type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setCurrentPage(1)
                        }
                        }
                        className="w-full md:w-96 px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        value={category}
                        onChange={(e) => {
                            const value = e.target.value
                            setCategory(value)
                            setCurrentPage(1)

                            updateURL({
                                category: value,
                                page: 1
                            })
                        }}
                        disabled={search.trim() !== ""}
                        className="w-full md:w-56 px-4 py-2 border rounded-lg bg-white disabled:bg-gray-100 disabled:text-gray-400"
                    >

                        <option value="">All Categories</option>
                        {categories.map((item) => (
                            <option key={item.slug} value={item.slug}>{item.name}</option>
                        ))}

                    </select>

                    <select value={sortBy}
                        onChange={(e) => {

                            const value = e.target.value

                            setSortBy(value)
                            setCurrentPage(1)

                            updateURL({
                                sort: value,
                                page: 1
                            })
                        }}
                        className="w-full md:w-56 px-4 py-2 border rounded-lg bg-white">

                        <option value="">Sort By</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating-asc">Rating: Low to High</option>
                        <option value="rating-desc">Rating: High to Low</option>
                        <option value="title-asc">Title: A to Z</option>
                        <option value="title-desc">Title: Z to A</option>
                    </select>

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

                {!loading && !error && products.length === 0 && (
                    <div className="bg-white rounded-lg p-8 text-center">
                        <p className="text-gray-500">No products found.</p>
                    </div>
                )}

                {!loading && !error && products.length > 0 && (
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

                                                    <span className="font-medium text-gray-800">
                                                        <Link
                                                            to={`/products/${product.id}`}
                                                            className="text-blue-600 hover:underline">
                                                            {product.title}
                                                        </Link>
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-gray-600">{product.category}</td>
                                            <td className="px-6 py-4 text-gray-600">${product.price}</td>
                                            <td className="px-6 py-4 text-gray-600">⭐ {product.rating}</td>
                                            <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => navigate(`/products/${product.id}/edit`)}
                                                    className="text-blue-600 hover:underline mr-3"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </td>
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
                                            <h3 className="font-semibold text-gray-800">
                                                <Link
                                                    to={`/products/${product.id}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {product.title}
                                                </Link>
                                            </h3>
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

                                        <div className="mt-4 flex gap-4">
                                            <button
                                                onClick={() => navigate(`/products/${product.id}/edit`)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
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