const express = require('express');
const db = require('./helper/db.connection');
var cors = require('cors');
const productRoutes = require('./route/product.route');
const checkoutRoutes = require('./route/order.route');

const app = express();
const port = 3000; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/api', productRoutes, checkoutRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });