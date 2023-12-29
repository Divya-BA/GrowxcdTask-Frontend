import React, { useState, useEffect } from "react";

const Cart = ({
  cartItems,
  removeFromCart,
  incrementItem,
  decrementItem,
  notify,
}) => {
  const [totalAmount, setTotalAmount] = useState(0);

  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.itemTotal;
    });
    setTotalAmount(total);
  };

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  return (
    <div className="container mt-4 bg-white">
      <h2 className="cart"></h2>

      {cartItems.length === 0 ? (
        <h1 className="empty">Your cart is empty 🤔</h1>
      ) : (
        cartItems.map((item) => (
          <div key={item._id} className="row mb-3">
            <div className="col-md-3">
              <img
                src={item.product.photos}
                alt={item.product.name}
                className="img-fluid"
                style={{ height: "200px", objectFit: "cover" }}
              />
            </div>
            <div className="col-md-9">
              <h3>{item.product.name}</h3>
              <p>Price: ₹{item.product.price}</p>
              <p>Offer: {item.offer ? formatOffer(item.offer) : "No Offer"}</p>
              <p>Quantity: {item.quantity}</p>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-secondary btn-sm m-2"
                  onClick={() => decrementItem(item)}
                >
                  -
                </button>
                <span className="mr-2">{item.quantity}</span>
                <button
                  className="btn btn-secondary btn-sm m-2"
                  onClick={() => incrementItem(item)}
                >
                  +
                </button>
              </div>
              <button
                className="btn btn-danger btn-sm mt-2"
                onClick={() => {
                  removeFromCart(item);
                  notify(`${item.product.name} removed from cart`, "remove");
                }}
              >
                Remove
              </button>
              <p className="mt-2">Item Total: ₹{item.itemTotal}</p>
            </div>
            <hr className="my-4" />
          </div>
        ))
      )}

      {cartItems.length > 0 && (
        <div>
          <h2 className="totalamount">Total Amount: ₹{totalAmount}</h2>
        </div>
      )}
    </div>
  );
};

// Helper function to format offer information
const formatOffer = (offer) => {
  switch (offer.offerType) {
    case "flat":
      return `Flat ₹${offer.discountValue} off`;
    case "percentage":
      return `${offer.discountValue}% off`;
    case "free":
      return "Buy 1 Get 1";
    default:
      return "";
  }
};

export default Cart;
