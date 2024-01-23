// models/Order.js
class Order {
    constructor({ id, fName, phone, email, street, streetOptional, country, state, city, postCode, shippingType, notes, prodItems, totalPrice, orderDate, statusId }) {
        this.id = id;
        this.fName = fName;
        this.phone = phone;
        this.email = email;
        this.street = street;
        this.streetOptional = streetOptional;
        this.country = country;
        this.state = state;
        this.city = city;
        this.postCode = postCode;
        this.shippingType = shippingType;
        this.notes = notes;
        this.prodItems = prodItems;
        this.totalPrice = totalPrice;
        this.orderDate = orderDate;
    }
}

module.exports = Order;
