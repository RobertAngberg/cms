import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ShowCart.css";

export default function ShowCart() {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || ""
  );
  let [sum, setSum] = useState(0);

  function btnIncreaseClicked(e) {
    // e är sku-namnet
    // grabba elementet/objectet med det sku-namnet och öka sen qty
    const result = cart.find((element) => element.sku === e);
    result.qty++;
    localStorage.setItem("cart", JSON.stringify(cart));
    setCart(JSON.parse(localStorage.getItem("cart")) || "");
    let sumHolder = 0;
    cart.map((e) => (sumHolder += e.price * e.qty));
    setSum(sumHolder);
  }

  function btnDecreaseClicked(e) {
    const result = cart.find((element) => element.sku === e);
    result.qty--;
    localStorage.setItem("cart", JSON.stringify(cart));
    setCart(JSON.parse(localStorage.getItem("cart")) || "");
    let sumHolder = 0;
    cart.map((e) => (sumHolder += e.price * e.qty));
    setSum(sumHolder);
  }

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart"));
    if (items) {
      setCart(items);
    }
    let sumHolder = 0;
    cart.map((e) => (sumHolder += e.price * e.qty));
    setSum(sumHolder);
  }, []);

  return (
    <main>
      <h1>Varukorg</h1>
      {cart.length > 0 &&
        cart.map((e, i) => (
          <div className="cart-item">
            <img src={e.mainImage} alt="" style={{ width: "75px" }} />
            <div className="cart-column-sku">
              {e.sku}
              <br></br>
              {e.price * e.qty}kr
            </div>
            <div className="cart-column-qty">
              <button id={e.sku} onClick={(ev) => btnIncreaseClicked(ev.sku)}>
                +
              </button>
              {e.qty}
              <button id={e.sku} onClick={(ev) => btnDecreaseClicked(ev.sku)}>
                -
              </button>
            </div>
          </div>
        ))}
      Summa: {sum}kr
      <br></br>
      <br></br>
      <Link to="/checkout">
        <button>Till kassan</button>
      </Link>
    </main>
  );
}
