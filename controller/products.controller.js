const db = require('../helper/db.connection');
const admin = require('../data/index');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Product = require('../model/product.model');

async function uploadImage(buffer) {
    try {
        const uuid = uuidv4();
        const bucket = admin.storage().bucket();

        const imageBuffer = fs.readFileSync(buffer.path);
        const filePath = `Users/${buffer.filename}_${Date.now()}`;
        const file = bucket.file(filePath);
        const imageUrl = await new Promise((resolve, reject) => {
            file.save(imageBuffer, {
                metadata: {
                    contentType: buffer.mimetype,
                    metadata: {
                        firebaseStorageDownloadTokens: uuid,
                    }
                },
                public: false
            }, async function (err) {
                if (!err) {
                    const [metadata] = await file.getMetadata();
                    const url = await file.getSignedUrl({
                        action: 'read',
                        expires: '01-01-2025',
                    });
                    resolve(url[0]);
                } else {
                    console.error('Error uploading image:', err);
                    reject('Failed to upload images');
                }
            });
        });

        return imageUrl;
    } catch (error) {
        console.error('Error uploading images:', error);
        throw new Error('Failed to upload images');
    }
}

const addProduct = async (req, res) => {
    try {
        let imgArr = req.file;
        const imageUrl = await uploadImage(imgArr);
        const {
            productName,
            description,
            categoryId,
            brandId,
            sizeId,
            liningId,
            stitchingId,
            price,
            price1,
            wishList
        } = req.body;
        await db.query('INSERT INTO products (productName, description, categoryId, brandId, sizeId, liningId, stitchingId, price, price1, wishList, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [productName, description, categoryId, brandId, sizeId, liningId, stitchingId, price, price1, wishList, imageUrl])
        return res.status(200).json({ message: 'Product add successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getAllProductsWithDetails = async (req, res) => {
    try {
        const queryResult = await db.query(`
            SELECT 
                p.*, 
                c.name As categoryName, 
                b.name As brandName, 
                s.name As sizeName, 
                l.name As liningName, 
                st.name As stitchingName
            FROM products p
            LEFT JOIN categories c ON p.categoryId = c.id
            LEFT JOIN brands b ON p.brandId = b.id
            LEFT JOIN size s ON p.sizeId = s.id
            LEFT JOIN linings l ON p.liningId = l.id
            LEFT JOIN stitching st ON p.stitchingId = st.id
        `);

        const products = queryResult.map(productData => new Product(productData));
        res.json({ products });
    } catch (error) {
        console.error('Error fetching products with details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getSingleProductWithDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const queryResult = await db.query(`
            SELECT 
                p.*, 
                c.name As categoryName, 
                b.name As brandName, 
                s.name As sizeName, 
                l.name As liningName, 
                st.name As stitchingName
            FROM products p
            LEFT JOIN categories c ON p.categoryId = c.id
            LEFT JOIN brands b ON p.brandId = b.id
            LEFT JOIN size s ON p.sizeId = s.id
            LEFT JOIN linings l ON p.liningId = l.id
            LEFT JOIN stitching st ON p.stitchingId = st.id
            WHERE p.id = ?
        `, [id]);

        const product = queryResult[0] ? new Product(queryResult[0]) : null;
        res.json({ product });
    } catch (error) {
        console.error('Error fetching single product with details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const imgArr = req.file;

        let imageUrl;
        if (imgArr) {
            imageUrl = await uploadImage(imgArr);
        }

        const {
            productName,
            description,
            categoryId,
            brandId,
            sizeId,
            liningId,
            stitchingId,
            price,
            price1,
            wishList
        } = req.body;

        let sql;
        let values;
        if (imageUrl) {
            sql = 'UPDATE products SET productName=?, description=?, categoryId=?, brandId=?, sizeId=?, liningId=?, stitchingId=?, price=?, price1=?, wishList=?, imageUrl=? WHERE id=?';
            values = [productName, description, categoryId, brandId, sizeId, liningId, stitchingId, price, price1, wishList, imageUrl, id];
        } else {
            sql = 'UPDATE products SET productName=?, description=?, categoryId=?, brandId=?, sizeId=?, liningId=?, stitchingId=?, price=?, price1=?, wishList=? WHERE id=?';
            values = [productName, description, categoryId, brandId, sizeId, liningId, stitchingId, price, price1, wishList, id];
        }

        await db.query(sql, values);

        return res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        await db.query('DELETE FROM products WHERE id = ?', [id]);
        return res.status(200).json({
            message: "Product is deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            error: "Something went wrong"
        })
    }
}

const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const queryResult = await db.query(`
            SELECT 
                p.*, 
                c.name AS categoryName
            FROM products p
            LEFT JOIN categories c ON p.categoryId = c.id
            WHERE p.categoryId = ?
        `, [category]);

        const products = queryResult || [];
        res.status(200).json({ products });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    addProduct,
    getAllProductsWithDetails,
    getSingleProductWithDetails,
    updateProduct,
    deleteProduct,
    getProductsByCategory
}