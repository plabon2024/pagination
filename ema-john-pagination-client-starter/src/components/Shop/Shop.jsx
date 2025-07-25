import React, { useEffect, useState } from "react";
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";
import { Link, useLoaderData } from "react-router-dom";

const Shop = () => {
  const storedCart = getShoppingCart();
  const [products, setProducts] = useState([]);
  //   const [cart, setCart] = useState([]);
  const loadedCart = useLoaderData(); // useLoaderData once
  const [cart, setCart] = useState(loadedCart);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPerPage] = useState(0);
  const [count, setCount] = useState(0);
  //   const { count } = useLoaderData();
  //   const count = 76;
  useEffect(() => {
    fetch("http://localhost:5000/productCount")
      .then((res) => res.json())
      .then((data) => setCount(data.count));
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost:5000/products?page=${currentPage}&size=${itemsPerPage}`
    )
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [currentPage]);

  //   useEffect(() => {
  //     console.log(storedCart);
  //     const savedCart = [];
  //     // step 1: get id of the addedProduct
  //     for (const id in storedCart) {
  //       // step 2: get product from products state by using id
  //       const addedProduct = products.find((product) => product._id === id);
  //       if (addedProduct) {
  //         // step 3: add quantity
  //         const quantity = storedCart[id];
  //         addedProduct.quantity = quantity;
  //         // step 4: add the added product to the saved cart
  //         savedCart.push(addedProduct);
  //       }
  //       // console.log('added Product', addedProduct)
  //     }
  //     // step 5: set the cart
  //     setCart(savedCart);
  //   }, [products]);

  const handleAddToCart = (product) => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };
  const numberOfPages = Math.ceil(count / itemsPerPage);
  const pages = [...Array(numberOfPages).keys()];

  const handleitemsPerPage = (e) => {
    const value = parseInt(e.target.value);
    setItemsPerPage(value);
  };
  const handleNextPage = (e) => {
    if (currentPage < pages.length - 1) {
      setCurrentPerPage(currentPage + 1);
    }
  };
  const handleprevPage = (e) => {
    if (currentPage > 0) {
      setCurrentPerPage(currentPage - 1);
    }
  };

  //   for (let i = 0; i < numberOfPages; i++) {
  //     pages.push(i);
  //   }
//   console.log(pages);
  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>
      <div>
        <button onClick={handleprevPage}>Prev</button>
        {pages.map((page) => (
          <button
            onClick={() => setCurrentPerPage(page)}
            key={page}
            className={currentPage === page ? "selected": ""}
          >
            {page}
          </button>
        ))}
        <button onClick={handleNextPage}>Next</button>

        <p>on : {currentPage}</p>
        <select
          name=""
          value={itemsPerPage}
          onChange={handleitemsPerPage}
          id=""
          className="width-sm"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>
    </div>
  );
};

export default Shop;
