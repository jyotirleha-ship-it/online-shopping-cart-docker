const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 4000;

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 1499,
        category: "Electronics"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 2499,
        category: "Electronics"
    },
    {
        id: 3,
        name: "Laptop Backpack",
        price: 999,
        category: "Accessories"
    },
    {
        id: 4,
        name: "Mechanical Keyboard",
        price: 2999,
        category: "Electronics"
    }
];

let cart = [];


/* Home */

app.get("/", (req, res) => {
    res.json({
        message: "Online Shopping Cart Backend is running"
    });
});


/* Get all products */

app.get("/api/products", (req, res) => {
    res.json(products);
});


/* Get product by ID */

app.get("/api/products/:id", (req, res) => {

    const id = Number(req.params.id);

    const product = products.find(
        product => product.id === id
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json(product);
});


/* Add product to cart */

app.post("/api/cart", (req, res) => {

    const { productId, quantity } = req.body;

    const product = products.find(
        product => product.id === Number(productId)
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const existingItem = cart.find(
        item => item.productId === Number(productId)
    );

    if (existingItem) {

        existingItem.quantity += Number(quantity);

    } else {

        cart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: Number(quantity)
        });

    }

    res.json({
        message: "Product added to cart",
        cart: cart
    });
});


/* Get cart */

app.get("/api/cart", (req, res) => {

    const total = cart.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );

    res.json({
        items: cart,
        total: total
    });
});


/* Remove cart item */

app.delete("/api/cart/:productId", (req, res) => {

    const productId = Number(req.params.productId);

    cart = cart.filter(
        item => item.productId !== productId
    );

    res.json({
        message: "Product removed from cart",
        cart: cart
    });
});


app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});