import { getAllProducts } from "@/libs/api";
import Link from "next/link";
import { DeleteButton } from "./DeleteButton";

export const AllProduct = async () => {
    const response = await getAllProducts();
    const rawProducts = response.data.products;

    const products = rawProducts.map((p) => ({
        ...p,
        images: Array.isArray(p.images)
            ? p.images
            : (() => {
                try {
                    return JSON.parse(p.images || "[]");
                } catch {
                    return [];
                }
            })(),
    }));

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Product List</h1>
            <div className="overflow-auto">
                <table className="min-w-full border border-gray-200 text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3 border">#</th>
                            <th className="px-4 py-3 border">Name</th>
                            <th className="px-4 py-3 border">SKU</th>
                            <th className="px-4 py-3 border">Price (₹)</th>
                            <th className="px-4 py-3 border">Images</th>
                            <th className="px-4 py-3 border text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {products.map((product, index) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 border">{index + 1}</td>
                                <td className="px-4 py-3 border">{product.name}</td>
                                <td className="px-4 py-3 border">{product.sku}</td>
                                <td className="px-4 py-3 border">₹{product.price}</td>
                                <td className="px-4 py-3 border">
                                    <div className="flex flex-wrap gap-2">
                                        {product.images.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                alt={`product-${product.id}-${i}`}
                                                className="w-9 h-9 object-cover rounded border"
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3 border text-center">
                                    <div className="flex justify-center gap-2">
                                        <Link
                                            href={`/edit?id=${product.id}`}
                                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Edit
                                        </Link>
                                         <DeleteButton id={product.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
