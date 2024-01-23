// order-item.model.js
class OrderItem {
    constructor({ orderId, productId, totalPrice }) {
        this.orderId = orderId;
        this.productId = productId;
        this.totalPrice = totalPrice;
    }
}

module.exports = OrderItem;
