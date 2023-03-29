import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Checkout() {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || ""
  );
  let [sum, setSum] = useState(0);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [town, setTown] = useState("");

  function btnIncreaseClicked(e) {
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
      <h1>Kassa</h1>
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
              <button id={e.sku} onClick={(ev) => btnIncreaseClicked(e.sku)}>
                +
              </button>
              {e.qty}
              <button id={e.sku} onClick={(ev) => btnDecreaseClicked(e.sku)}>
                -
              </button>
            </div>
          </div>
        ))}
      Summa: {sum}kr
      <br></br>
      <h2>Dina uppgifter</h2>
      <input
        className=""
        type="text"
        placeholder={"E-post"}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        className=""
        type="text"
        placeholder={"Namn"}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <input
        className=""
        type="text"
        placeholder={"Adress"}
        value={address}
        onChange={(event) => setAddress(event.target.value)}
      />
      <input
        className=""
        type="number"
        placeholder={"Postnummer"}
        value={zip}
        onChange={(event) => setZip(event.target.value)}
      />
      <input
        className=""
        type="text"
        placeholder={"Stad"}
        value={town}
        onChange={(event) => setTown(event.target.value)}
      />
      <Link to="/checkout">
        <button>Lägg beställning</button>
      </Link>
      <br />
      <br />
    </main>
  );
}
