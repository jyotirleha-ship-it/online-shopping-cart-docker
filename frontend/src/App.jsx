import { useCallback, useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function App() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    // Fetch all products
    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/products`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await response.json();
            const productsList = Array.isArray(data) ? data : [];

            setProducts(productsList);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }, []);

    // Fetch shopping cart
    const fetchCart = useCallback(async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/cart`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch cart");
            }

            const data = await response.json();
            const cartItems = Array.isArray(data?.items) ? data.items : [];

            setCart(cartItems);
            setTotal(Number(data?.total) || 0);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    }, []);

    // Load products and cart when page opens
    useEffect(() => {
        const loadData = async () => {
            await fetchProducts();
            await fetchCart();
        };

        void loadData();
    }, [fetchProducts, fetchCart]);

    // Add product to cart
    const addToCart = async (productId) => {
        try {
            const response = await fetch(
                `${API_URL}/api/cart`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        productId: productId,
                        quantity: 1
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add product");
            }

            await fetchCart();

        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    // Remove product from cart
    const removeFromCart = async (productId) => {
        try {
            const response = await fetch(
                `${API_URL}/api/cart/${productId}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to remove product");
            }

            await fetchCart();

        } catch (error) {
            console.error("Error removing product:", error);
        }
    };

    return (
        <div className="app">

            {/* Header */}
            <header>
                <h1>Online Shopping Cart</h1>

                <p>
                    Dockerized Full Stack Application
                </p>
            </header>

            <main>

                {/* Products Section */}
                <section>

                    <h2>Products</h2>

                    <div className="products">

                        {products.map((product) => (
                            <div
                                className="product"
                                key={product.id}
                            >

                                <h3>
                                    {product.name}
                                </h3>

                                <p>
                                    Category: {product.category}
                                </p>

                                <h3>
                                    ₹{product.price}
                                </h3>

                                <button
                                    onClick={() =>
                                        addToCart(product.id)
                                    }
                                >
                                    Add to Cart
                                </button>

                            </div>
                        ))}

                    </div>

                </section>

                {/* Cart Section */}
                <section className="cart">

                    <h2>
                        Shopping Cart
                    </h2>

                    {cart.length === 0 ? (

                        <p>
                            Cart is empty
                        </p>

                    ) : (

                        cart.map((item) => (
                            <div
                                className="cart-item"
                                key={item.productId}
                            >

                                <div>

                                    <strong>
                                        {item.name}
                                    </strong>

                                    <p>
                                        ₹{item.price} ×{" "}
                                        {item.quantity}
                                    </p>

                                </div>

                                <button
                                    onClick={() =>
                                        removeFromCart(
                                            item.productId
                                        )
                                    }
                                >
                                    Remove
                                </button>

                            </div>
                        ))

                    )}

                    <h2>
                        Total: ₹{total}
                    </h2>

                </section>

            </main>

        </div>
    );
}

export default App;