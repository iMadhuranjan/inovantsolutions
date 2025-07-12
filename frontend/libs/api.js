import axios from "axios";

const BACKEND_API = 'http://localhost:9000/api';

export const getAllProducts = async () => axios.get(`${BACKEND_API}/getallproduct`);
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${BACKEND_API}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};