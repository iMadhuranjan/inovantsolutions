import express from 'express'
import { addProduct, deleteProduct, getAllProduct, getProductById, updateProduct } from '../controllers/productController.js';

const productRouter=express.Router();


productRouter.post("/add", addProduct);
productRouter.put("/update", updateProduct);
productRouter.delete("/delete/:id", deleteProduct);
productRouter.get("/getallproduct", getAllProduct);
productRouter.get("/product/:id", getProductById);


export default productRouter;
