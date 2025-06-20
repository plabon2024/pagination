import React, { useState } from "react";
import Cart from "../Cart/Cart";
import { Link, useLoaderData } from "react-router-dom";
import ReviewItem from "../ReviewItem/ReviewItem";
import "./Orders.css";
import { deleteShoppingCart, removeFromDb } from "../../utilities/fakedb";

const Orders = () => {
  const savedCart = useLoaderData();
  const [cart, setCart] = useState(savedCart);

  const handleRemoveFromCart = (id) => {
    const existingProduct = cart.find((product) => product._id === id);
    let updatedCart = [];

    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        const updatedProduct = {
          ...existingProduct,
          quantity: existingProduct.quantity - 1,
        };
        updatedCart = cart.map((product) =>
          product._id === id ? updatedProduct : product
        );
      } else {
        updatedCart = cart.filter((product) => product._id !== id);
      }

      setCart(updatedCart);
      removeFromDb(id);
    }
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  return (
    <div className="shop-container">
      <div className="review-container">
        {cart.map((product) => (
          <ReviewItem
            key={product._id}
            product={product}
            handleRemoveFromCart={handleRemoveFromCart}
          ></ReviewItem>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/checkout">
            <button className="btn-proceed">Proceed Checkout</button>
          </Link>
        </Cart>
      </div>
    </div>
  );
};

export default Orders;
