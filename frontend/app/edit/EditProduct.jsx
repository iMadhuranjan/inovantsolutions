'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

const CLOUD_NAME = 'drc93v1ry';
const UPLOAD_PRESET = 'products';

const EditProduct = () => {
    const searchParam = useSearchParams();
    const router = useRouter();
    const id = searchParam.get('id');

    const [product, setProduct] = useState({
        id: '',
        sku: '',
        name: '',
        price: '',
        images: []
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                setMessage({ text: 'No product ID provided', type: 'error' });
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:9000/api/product/${id}`);
                if (response.data.success) {
                    const productData = response.data.product;
                    setProduct({
                        id: productData.id,
                        sku: productData.sku,
                        name: productData.name,
                        price: productData.price.toString(),
                        images: Array.isArray(productData.images) ? productData.images : []
                    });
                } else {
                    setMessage({ text: response.data.message, type: 'error' });
                }
            } catch (error) {
                setMessage({
                    text: error.response?.data?.message || 'Failed to fetch product',
                    type: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        setUploadProgress(0);
        setMessage({ text: '', type: '' });

        try {
            const urls = [];
            const totalFiles = files.length;
            let processedFiles = 0;

            for (let file of files) {
                if (!file.type.match('image.*')) {
                    throw new Error('Only image files are allowed');
                }
                if (file.size > 5 * 1024 * 1024) {
                    throw new Error('Image size should be less than 5MB');
                }

                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", UPLOAD_PRESET);

                const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
                    method: "POST",
                    body: formData
                });

                if (!res.ok) {
                    throw new Error('Image upload failed');
                }

                const data = await res.json();
                if (data.secure_url) {
                    urls.push(data.secure_url);
                }

                processedFiles++;
                setUploadProgress(Math.round((processedFiles / totalFiles) * 100));
            }

            setProduct(prev => ({
                ...prev,
                images: [...prev.images, ...urls],
            }));

            setMessage({ text: 'Images uploaded successfully!', type: 'success' });
        } catch (error) {
            console.error("Image upload failed", error);
            setMessage({ text: error.message || 'Image upload failed', type: 'error' });
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const removeImage = (index) => {
        setProduct(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!product.sku.trim() || !product.name.trim() || !product.price || product.images.length === 0) {
            setMessage({ text: 'All fields are required including at least one image', type: 'error' });
            return;
        }

        if (isNaN(parseFloat(product.price))) {
            setMessage({ text: 'Price must be a valid number', type: 'error' });
            return;
        }

        setSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            const payload = {
                id: product.id,
                sku: product.sku,
                name: product.name,
                price: parseFloat(product.price),
                images: product.images
            };

            const response = await axios.put('http://localhost:9000/api/update', payload);

            setMessage({
                text: response.data.message || 'Product updated successfully',
                type: 'success'
            });

            setTimeout(() => router.push('/'), 1500);
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || 'Failed to update product',
                type: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 max-w-2xl mx-auto flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h1>

            {message.text && (
                <div className={`mb-4 p-3 rounded ${message.type === 'error'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="id" value={product.id} />

                <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input
                        type="text"
                        id="sku"
                        name="sku"
                        value={product.sku}
                        onChange={handleChange}
                        placeholder="Product SKU"
                        required
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        placeholder="Product Name"
                        required
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                        Product Images
                    </label>
                    <input
                        type="file"
                        id="images"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="w-full border border-gray-300 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="mt-1 text-sm text-gray-500">Upload one or multiple product images (JPEG, PNG)</p>

                    {uploading && (
                        <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-blue-600 mt-1">
                                Uploading {uploadProgress}%...
                            </p>
                        </div>
                    )}
                </div>

                {/* Image previews */}
                {product.images.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Product Images ({product.images.length})</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {product.images.map((url, i) => (
                                <div key={i} className="relative group">
                                    <img
                                        src={url}
                                        alt={`Product preview ${i + 1}`}
                                        className="h-32 w-full object-cover rounded-md border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove image"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={submitting || uploading}
                        className={`w-full py-2 px-4 rounded-md text-white font-medium ${submitting || uploading
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
                    >
                        {submitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </span>
                        ) : (
                            'Update Product'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;