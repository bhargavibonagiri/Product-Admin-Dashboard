import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getProductById } from "../api/productApi"

function ProductDetails() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedImage, setSelectedImage] = useState("")

    useEffect(() => {
        const fetchProduct = async () => {

            try {
                setLoading(true)
                setError("")

                const data = await getProductById(id)

                setProduct(data)
                setSelectedImage(data.images?.[0] || data.thumbnail)

            }
            catch (err) {
                console.log("Product details error:", err);
                setError("Product not found")
            }

            finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [id])


    if (loading) {

        return (
            <div className="p-6 text-center">
                Loading product...
            </div>
        )
    }

    if (error) {

        return (

            <div className="p-6 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={() => navigate("/products")}
                    className="bg-blue-600 text-white px-4 py-2 rounded">
                    Back to Products
                </button>

            </div>
        )
    }

    return (
        <div className="p-4 md:p-6">

            <button
                onClick={() => navigate("/products")}
                className="mb-6 text-blue-600 hover:underline">
                ← Back to Products
            </button>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col items-center">

                    <div className="flex justify-center items-center border rounded-lg p-4 w-full">
                        <img
                            src={selectedImage}
                            alt={product.title}
                            className="w-full max-w-md h-80 object-contain"
                        />

                    </div>

                    {product.images && product.images.length > 0 && (
                        <div className="flex gap-3 mt-4 overflow-x-auto">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(image)}
                                    className={`flex-shrink-0 border rounded p-1 ${selectedImage === image
                                        ? "border-blue-600"
                                        : "border-gray-300"
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.title} ${index + 1}`}
                                        className="w-20 h-20 object-contain"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    <div>

                        <h1 className="text-2xl font-bold mb-3">{product.title}</h1>

                        <p className="text-gray-500 mb-4">{product.category}</p>

                        <p className="text-2xl font-bold mb-4">${product.price}</p>

                        <p className="mb-3">
                            <span className="font-semibold">Rating</span>{" "}
                            {product.rating}
                        </p>

                        <p className="mb-3">
                            <span className="font-semibold">Stock:</span>{" "}
                            {product.stock}
                        </p>

                        <p className="text-gray-700 mb-6">{product.description}</p>
                    </div>

                </div>

                <div className="mt-8">

                    <h2 className="text-xl font-bold mb-4">Reviews</h2>

                    {product.reviews && product.reviews.length > 0 ? (
                        <div className="space-y-4">
                            {product.reviews.map((review, index) => (
                                <div key={index}
                                    className="border rounded p-4"
                                >
                                    <p className="font-semibold">{review.reviewerName}</p>

                                    <p className="text-sm text-gray-500 mb-2">Rating: {review.rating}</p>

                                    <p className="text-gray-700">{review.comment}</p>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No reviews available</p>
                    )}

                </div>

            </div>

        </div>
    )

}

export default ProductDetails