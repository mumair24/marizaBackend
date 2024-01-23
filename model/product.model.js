// product.model.js
class Product {
    constructor({
        id,
        productName,
        description,
        categoryId,
        brandId,
        sizeId,
        liningId,
        stitchingId,
        price,
        price1,
        wishList,
        imageUrl,
        categoryName,
        brandName,
        sizeName,
        liningName,
        stitchingName
    }) {
        this.id = id;
        this.productName = productName;
        this.description = description;
        this.categoryId = categoryId;
        this.brandId = brandId;
        this.sizeId = sizeId;
        this.liningId = liningId;
        this.stitchingId = stitchingId;
        this.price = price;
        this.price1 = price1;
        this.wishList = wishList;
        this.imageUrl = imageUrl;
        this.categoryName = categoryName;
        this.brandName = brandName;
        this.sizeName = sizeName;
        this.liningName = liningName;
        this.stitchingName = stitchingName;
    }
}

module.exports = Product;
