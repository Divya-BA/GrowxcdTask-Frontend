import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductList from "./components/Product";
import Cart from "./components/Cart";
import { BsCart4 } from "react-icons/bs";
import ParticlesBg from "particles-bg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const addToCart = (product) => {
    const productId = product._id;

    // Check if the product is already in the cart
    if (!isProductInCart(productId)) {
      const offer = product.offer;
      const defaultQuantity = offer && offer.offerType === "free" ? 2 : 1;

      const newItem = {
        _id: Math.random(),
        product,
        quantity: defaultQuantity,
        offer,
        itemTotal: calculateItemTotal(product.price, defaultQuantity, offer),
      };

      setCartItems([...cartItems, newItem]);
    }
  };

  const calculateItemTotal = (price, quantity, offer) => {
    // Adjust the item total based on the offer
    if (offer) {
      if (offer.offerType === "flat") {
        // Apply flat discount
        return (price - offer.discountValue) * quantity;
      } else if (offer.offerType === "percentage") {
        // Apply percentage discount
        const discountAmount = (offer.discountValue / 100) * price;
        return (price - discountAmount) * quantity;
      } else if (offer.offerType === "free") {
        // Adjust for "Buy 1 Get 1" offer
        const totalItems = Math.ceil(quantity / 2) * 1; // Round up to the nearest even number
        return (price * totalItems) / 1;
      }
    } else {
      // No offer, calculate without discount
      return price * quantity;
    }
  };

  const isProductInCart = (productId) => {
    return cartItems.some((item) => item.product._id === productId);
  };

  const removeFromCart = (item) => {
    setCartItems(cartItems.filter((cartItem) => cartItem._id !== item._id));
  };

  const incrementItem = (item) => {
    let updatedQuantity = item.quantity + 1;

    // Check if the product has a "Buy 1 Get 1" offer and adjust the quantity
    if (item.offer && item.offer.offerType === "free") {
      updatedQuantity += 1;
    }

    const updatedItem = {
      ...item,
      quantity: updatedQuantity,
      itemTotal: calculateItemTotal(
        item.product.price,
        updatedQuantity,
        item.offer
      ),
    };

    const updatedCart = cartItems.map((cartItem) =>
      cartItem._id === item._id ? updatedItem : cartItem
    );

    setCartItems(updatedCart);
  };

  const decrementItem = (item) => {
    let updatedQuantity = item.quantity - 1;

    // Check if the product has a "Buy 1 Get 1" offer and adjust the quantity
    if (item.offer && item.offer.offerType === "free") {
      updatedQuantity = Math.max(updatedQuantity, 2);
    } else {
      updatedQuantity = Math.max(updatedQuantity, 1);
    }

    const updatedItem = {
      ...item,
      quantity: updatedQuantity,
      itemTotal: calculateItemTotal(
        item.product.price,
        updatedQuantity,
        item.offer
      ),
    };

    const updatedCart = cartItems.map((cartItem) =>
      cartItem._id === item._id ? updatedItem : cartItem
    );

    setCartItems(updatedCart);
  };

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const notify = (message, type) => {
    toast(message, {
      type: type === "add" ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  return (
    <Router>
      <div>
        {/* Particle background */}
        <ParticlesBg
          type="color"
          bg={true}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
          }}
        />

        <nav>
          <ul>
            <li>
              <Link to="/">Skincare</Link>
            </li>
            <li>
              <input
                className="search"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </li>
            <li>
              <Link to="/cart">
                <BsCart4 className="icon" />
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                incrementItem={incrementItem}
                decrementItem={decrementItem}
                notify={(message) => notify(message, "remove")}
              />
            }
          />
          <Route
            path="/"
            element={
              <ProductList
                addToCart={addToCart}
                searchTerm={searchTerm}
                notify={(message) => notify(message, "add")}
              />
            }
          />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;
