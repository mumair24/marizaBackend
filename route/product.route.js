const express = require("express");
const router = express.Router();
const productController = require('../controller/products.controller');
const brand_categoryController = require('../controller/brand_category.controller');
const upload = require('../middleware/multer.middleware');

router.post(
    "/addProduct",
    upload.single('imageUrl'),
    productController.addProduct
);

router.get(
    "/allProducts",
    productController.getAllProductsWithDetails
);

router.get(
    "/getSingleProduct/:id",
    productController.getSingleProductWithDetails
);

router.patch(
    "/updateProduct/:id",
    upload.single('imageUrl'),
    productController.updateProduct
);

router.delete(
    "/deleteProduct/:id",
    productController.deleteProduct
  );

router.get(
    "/getBrands",
    brand_categoryController.getBrands
);

router.get(
    "/getCategories",
    brand_categoryController.getCategories
);

router.get(
    '/products-by-category/:category',
    productController.getProductsByCategory
);

router.get(
    "/getSizes",
    brand_categoryController.getSizeItems
);

router.get(
    "/getStitching",
    brand_categoryController.getStitchItems
);

router.get(
    "/getLining",
    brand_categoryController.getLiningItems
);


module.exports = router;