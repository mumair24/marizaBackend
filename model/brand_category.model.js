// Brand.js
class Brand {
    constructor({ id, name, imageUrl }) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
    }
}

// Category.js
class Category {
    constructor({ id, name, imageUrl }) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
    }
}

// Size.js
class Size {
    constructor({ id, name }) {
        this.id = id;
        this.name = name;
    }
}

// Stitching.js
class Stitching {
    constructor({ id, name }) {
        this.id = id;
        this.name = name;
    }
}

// Lining.js
class Lining {
    constructor({ id, name }) {
        this.id = id;
        this.name = name;
    }
}

module.exports = {
    Brand,
    Category,
    Size,
    Stitching,
    Lining
};
