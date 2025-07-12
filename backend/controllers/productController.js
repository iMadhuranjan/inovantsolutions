import { connectDB } from "../database/dbConnect.js";


export const addProduct = async (req, res) => {
    try {
        const { sku, name, price, images } = req.body;

        if (!sku.trim() || !name.trim() || typeof price !== "number" || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Required"
            })
        }
        const imageString = JSON.stringify(images)
        const connectToDB = await connectDB();
        const [result] = await connectToDB.query(
            'INSERT INTO products (sku, name, price, images) VALUES (?, ?, ?, ?)',
            [sku, name, price, imageString]
        );
        console.log("Added Prduct")
        return res.status(201).json({
            success: true,
            message: "Product Inserted Successfully",
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to Add Products", error: error.message })
    }

}

export const updateProduct = async (req, res) => {
    try {
        const { id, name, price, images, sku } = req.body;

        if (!id) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }

        if (!sku.trim() || !name.trim() || typeof price !== "number" || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Required"
            })
        }

        const imageString = JSON.stringify(images);

        const connection = await connectDB();

        const [result] = await connection.query(
            `update products set sku = ?, name = ?, price = ?, images=? where id =?`,
            [sku, name, price, imageString, id]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "No product found with this ID",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update product",
            error: error.message,
        });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;   

        console.log(id)
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "No Product Available"
            });
        }

        const connection = await connectDB();
        const [result] = await connection.query(
            `DELETE FROM products WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product Deleted!",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to Delete product",
            error: error.message,
        });
    }
}

export const getAllProduct = async (req, res) => {
  try {
      const connection = await connectDB();

    const [result] = await connection.query(
        `select * from products`
    )

    const products= result.map(product =>({
        ...product,
        price:parseFloat(product.price),
        images:JSON.parse(product.images), 
    }))

    res.status(200).json({
        success:true,
        products
    })

  } catch (error) {
    res.status(500).json({
        success:false,
        message:"Unable to Fetch All Products"
    })
  }
}


export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;  
        console.log("Fetching product with ID:", id);
        
        if (!id) return res.status(400).json({ success: false, message: "ID required" });

        const connection = await connectDB();
        const [rows] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const product = rows[0];
        product.price = parseFloat(product.price);
        product.images = JSON.parse(product.images);

        res.status(200).json({ success: true, product });
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).json({ success: false, message: "Failed to get product", error: err.message });
    }
};