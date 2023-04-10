import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../show-cart/ShowCart.css";
import ShowCart from "../show-cart/ShowCart";

export default function Checkout({ showGoToCheckoutBtn }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [town, setTown] = useState("");

  return (
    <main className="checkout-main">
      <h1>Kassa</h1>
      <ShowCart showGoToCheckoutBtn={false} />
      <h2>Dina uppgifter</h2>
      <input
        type="text"
        placeholder={"E-post"}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="text"
        placeholder={"Namn"}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <input
        type="text"
        placeholder={"Adress"}
        value={address}
        onChange={(event) => setAddress(event.target.value)}
      />
      <input
        type="number"
        placeholder={"Postnummer"}
        value={zip}
        onChange={(event) => setZip(event.target.value)}
      />
      <input
        type="text"
        placeholder={"Stad"}
        value={town}
        onChange={(event) => setTown(event.target.value)}
      />
      <br></br>
      <br></br>
      <Link to="/thanks">
        <button>Lägg beställning</button>
      </Link>
      <br />
      <br />
    </main>
  );
}
