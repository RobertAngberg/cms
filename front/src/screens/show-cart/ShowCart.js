import { useState, useEffect } from "react";
import "./ShowCart.css";
import { Link } from "react-router-dom";

// Denna component används i kassa också, måste kunna dölja "till kassan"-knapp
const ShoppingCart = ({ showGoToCheckoutBtn = true }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cartItemsFromStorage = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cartItemsFromStorage);
  }, []);

  const updateCart = (updatedItems) => {
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const increaseQuantity = (item) => {
    const updatedItems = cartItems.map((cartItem) =>
      cartItem === item ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem
    );
    updateCart(updatedItems);
  };

  const decreaseQuantity = (item) => {
    const updatedItems = cartItems
      .map((cartItem) =>
        cartItem === item ? { ...cartItem, qty: cartItem.qty - 1 } : cartItem
      )
      .filter((cartItem) => cartItem.qty > 0);
    updateCart(updatedItems);
  };

  const total = cartItems.reduce(
    (accumulator, currentItem) =>
      accumulator + currentItem.qty * currentItem.price,
    0
  );

  return (
    <div>
      <h1>Varukorg</h1>
      {cartItems.length === 0 && <p>Your cart is empty.</p>}
      {cartItems.map((item) => (
        <div key={item.title} className="cart-item">
          <img src={`../uploads/${item.mainImage}`} alt={item.title} />
          <p className="title">{item.title}</p>
          <p className="price">{item.price} Kr</p>
          <button onClick={() => decreaseQuantity(item)}>-</button>
          <span>{item.qty}</span>
          <button onClick={() => increaseQuantity(item)}>+</button>
        </div>
      ))}
      {cartItems.length > 0 && <p>Total: {total} Kr</p>}
      <br></br>
      <br></br>
      {showGoToCheckoutBtn === true && (
        <Link to="/checkout">
          <button>Till kassan</button>
        </Link>
      )}
    </div>
  );
};

export default ShoppingCart;
