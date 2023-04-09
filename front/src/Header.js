import { Link, redirect } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext.js";
import bagIcon from "./assets/shopping-bag.png";
import logo from "./assets/logo.png";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch("https://ms-rgk2.onrender.com/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, [setUserInfo]);

  function logout() {
    fetch("https://ms-rgk2.onrender.com/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
    redirect("/");
  }

  // Om userInfo är set = inloggad
  const username = userInfo?.username;

  return (
    <header>
      <nav>
        <Link to="/">
          <img src={logo} className="logo" alt="" />
        </Link>
        <Link to="/mid">MID</Link>
        <Link to="/mh2">MH2</Link>
        <Link to="/stx">STX</Link>
        <Link to="/kdh">KDH</Link>
        <Link to="/afr">AFR</Link>

        <Link to="/show-cart" className="logo">
          <img src={bagIcon} className="bag-icon" alt="" />
        </Link>

        {username && (
          <>
            <Link to="/add-product">
              <button className="addProdBtn">Lägg till produkt</button>
            </Link>

            <button className="logoutBtn" onClick={logout}>
              Logga ut ({username})
            </button>
          </>
        )}

        {!username && (
          <>
            <Link to="https://ms-rgk2.onrender.com/login">
              <button className="loginBtn">Logga in</button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
