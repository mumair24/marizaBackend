const db = require('../helper/db.connection');
const Order = require('../model/order.model');
const OrderItem = require('../model/order_items.model');

const fillDeliveryInfoForAllCarts = async (req, res) => {
    try {
        const {
            fName,
            phone,
            email,
            street,
            streetOptional,
            country,
            state,
            city,
            postCode,
            shippingType,
            notes,
            prodItems,
            totalPrice,
        } = req.body;

        const order = new Order({
            fName,
            phone,
            email,
            street,
            streetOptional,
            country,
            state,
            city,
            postCode,
            shippingType,
            notes,
            prodItems: JSON.stringify(prodItems),
            totalPrice,
        });

        const insertOrderQuery = `
            INSERT INTO orders (fName, phone, email, street, streetOptional, country, state, city, postCode, shippingType, notes, prodItems, totalPrice, orderDate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;

        const insertOrderResult = await db.query(insertOrderQuery, [
            order.fName,
            order.phone,
            order.email,
            order.street,
            order.streetOptional,
            order.country,
            order.state,
            order.city,
            order.postCode,
            order.shippingType,
            order.notes,
            order.prodItems,
            order.totalPrice,
        ]);

        if (insertOrderResult && insertOrderResult.insertId) {
            const orderId = insertOrderResult.insertId;

            const prodItemsArray = JSON.parse(order.prodItems);
            for (const prodItem of prodItemsArray) {
                const searchProductQuery = `
                    SELECT id, price FROM products WHERE id = ?;
                `;

                const productResult = await db.query(searchProductQuery, [prodItem]);
                if (productResult) {
                    const product = productResult[0];

                    const orderItem = new OrderItem({
                        orderId,
                        productId: product.id,
                        totalPrice: order.totalPrice,
                    });

                    const insertOrderItemQuery = `
                        INSERT INTO order_items (orderId, product_id, totalPrice)
                        VALUES (?, ?, ?)
                    `;

                    await db.query(insertOrderItemQuery, [
                        orderItem.orderId,
                        orderItem.productId,
                        orderItem.totalPrice,
                    ]);
                } else {
                    console.error(`Product not found for: ${prodItem}`);
                }
            }

            res.status(200).json({ orderId, message: 'Delivery information and order items saved successfully' });
        } else {
            throw new Error('Error inserting order. Insert result is not as expected.');
        }
    } catch (error) {
        console.error('Error saving delivery information and order items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getAllOrdersController = async (req, res) => {
    try {
        const fetchAllOrdersQuery = `
            SELECT *
            FROM orders
        `;

        const allOrders = await db.query(fetchAllOrdersQuery);

        const orders = allOrders.map(orderData => new Order(orderData));

        res.status(200).json({ message: 'All orders retrieved successfully', orders });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ status: 'error', error: 'Internal server error' });
    }
};

// const getAllOrderItemsWithDetails = async (req, res) => {
//     try {
//         const fetchAllOrderItemsQuery = `
//         SELECT 
//             oi.id AS orderItemId,
//             oi.orderId,
//             oi.product_id AS productId,
//             oi.totalPrice AS orderItemTotalPrice,
//             o.id AS orderId,
//             o.fName,
//             o.phone,
//             o.email,
//             o.street,
//             o.streetOptional,
//             o.country,
//             o.state,
//             o.city,
//             o.postCode,
//             o.shippingType,
//             o.notes,
//             o.statusId,
//             o.prodItems,
//             o.orderDate,
//             p.id AS productId,
//             p.productName,
//             p.description,
//             p.categoryId,
//             p.brandId,
//             p.sizeId,
//             p.liningId,
//             p.stitchingId,
//             p.price,
//             p.price1,
//             p.wishList,
//             p.imageUrl
//     FROM order_items oi
//     LEFT JOIN orders o ON oi.orderId = o.id
//     LEFT JOIN products p ON oi.product_id = p.id;
//     `;

//         const allOrderItems = await db.query(fetchAllOrderItemsQuery);

//         res.status(200).json({ message: 'All order items retrieved successfully', orderItems: allOrderItems });
//     } catch (error) {
//         console.error('Error fetching all order items:', error);
//         res.status(500).json({ status: 'error', error: 'Internal server error' });
//     }
// };


module.exports = {
    fillDeliveryInfoForAllCarts,
    getAllOrdersController,
    // getAllOrderItemsWithDetails
};
