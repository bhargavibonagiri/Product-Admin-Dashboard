import { useNavigate, useParams } from "react-router-dom"
import { getProductById, updateProduct } from "../api/productApi"
import { useEffect, useState } from "react"

function EditProduct() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: "",
        price: "",
        stock: "",
        category: "",
        description: ""
    })

    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)
    const [apiError, setApiError] = useState("")

    useEffect(() => {
        const fetchProduct = async () => {

            try {
                setLoading(true)

                const data = await getProductById(id)

                setFormData({
                    title: data.title || "",
                    price: data.price || "",
                    stock: data.stock || "",
                    category: data.category || "",
                    description: data.description || ""
                })

            }

            catch (err) {
                console.log("Edit product Error", err);
                setApiError("Product not found")

            }

            finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const validateForm = () => {

        const newErrors = {}

        if (!formData.title.trim()) {
            newErrors.title = "Title is required"
        }

        if (!formData.category.trim()) {
            newErrors.category = "Category is required"
        }

        if (!formData.price === "" || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            newErrors.price = "Price must be greater than 0"
        }

        if (!formData.stock === "" || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
            newErrors.stock = "stock cannot be negative"
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }


    const handleSubmit = async (e) => {

        e.preventDefault()

        if (saving) {
            return
        }

        if (!validateForm()) {
            return
        }

        try {

            setSaving(true)
            setApiError("")

            const product = {
                title: formData.title,
                price: Number(formData.price),
                stock: Number(formData.stock),
                category: formData.category,
                description: formData.description
            }

            const data = await updateProduct(id, product)

            console.log("Updated product:", data);

            const updatedProducts = JSON.parse(localStorage.getItem("updatedProducts") || "[]")

            const existingIndex = updatedProducts.findIndex(
                item => item.id === data.id
            )

            if (existingIndex !== -1) {
                updatedProducts[existingIndex] = data
            } else {
                updatedProducts.push(data)
            }

            localStorage.setItem(
                "updatedProducts",
                JSON.stringify(updatedProducts)
            )
            navigate("/products")

        }

        catch (err) {

            console.log("Update product error:", err);

            setApiError("Failed to update product")

        }

        finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="p-6 text-center">
                Loading product...
            </div>
        )
    }

    if (apiError && !formData.title) {
        return (
            <div className="p-6 text-center text-red-500">
                {apiError}
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6">

            <button
                onClick={() => navigate("/products")}
                className="mb-6 text-blue-600 hover:underline"
            >
                ← Back to Products
            </button>

            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">

                <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

                {apiError && (
                    <p className="text-red-500 mb-4">{apiError}</p>
                )}

                <form onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <label className="block font-medium mb-1">Title</label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />

                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Category</label>

                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />

                        {errors.category && (
                            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                        )}

                    </div>

                    <div>
                        <label className="block font-medium mb-1">Price</label>

                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />

                        {errors.price && (
                            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                        )}

                    </div>

                    <div>
                        <label className="block font-medium mb-1">Stock</label>

                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />

                        {errors.stock && (
                            <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                        )}

                    </div>

                    <div>
                        <label className="block font-medium mb-1">Description</label>

                        <textarea

                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full border rounded px-3 py-2"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Update Product"}
                    </button>

                </form>

            </div>

        </div>
    )


}

export default EditProduct