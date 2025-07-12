'use client';
import { useRouter } from 'next/navigation';
import { deleteProduct } from '@/libs/api';

export const DeleteButton = ({ id }) => {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        // alert('Product deleted successfully');
        router.refresh();  
      } catch (error) {
        alert('Failed to delete product');
        console.error(error);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Delete
    </button>
  );
};