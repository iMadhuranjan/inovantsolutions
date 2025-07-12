'use client'
import React, { useState } from 'react';
import axios from 'axios';

const CLOUD_NAME = 'drc93v1ry';
const UPLOAD_PRESET = 'products';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        price: '',
        images: [],
    });

    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
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

            setFormData(prev => ({
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
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.sku.trim() || !formData.name.trim() || !formData.price || formData.images.length === 0) {
            setMessage({ text: 'All fields are required including at least one image', type: 'error' });
            return;
        }

        if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
            setMessage({ text: 'Price must be a positive number', type: 'error' });
            return;
        }

        setMessage({ text: '', type: '' });
        setLoading(true);

        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
            };

            const res = await axios.post('http://localhost:9000/api/add', payload);

            setMessage({
                text: res.data.message || 'Product added successfully!',
                type: 'success'
            });

            setFormData({
                sku: '',
                name: '',
                price: '',
                images: []
            });
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to add product';
            setMessage({
                text: errorMsg,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>

            {message.text && (
                <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input
                        type="text"
                        id="sku"
                        name="sku"
                        value={formData.sku}
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
                        value={formData.name}
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
                        value={formData.price}
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
                {formData.images.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images ({formData.images.length})</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {formData.images.map((url, i) => (
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

                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading || uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">

                                Processing...
                            </span>
                        ) : (
                            'Add Product'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;