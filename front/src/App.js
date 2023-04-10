import "./css/style.scss";
import { Routes, Route } from "react-router-dom";
import { UserContextProvider } from "./UserContext";
import Layout from "./Layout";
import AddProduct from "./screens/add-edit-product/AddProduct";
import FrontPage from "./screens/front-page/FrontPage";
import ShowPost from "./screens/show-product/ShowProduct";
import EditPost from "./screens/add-edit-product/EditProduct";
import LoginPage from "./screens/login-register/LoginPage";
import RegisterPage from "./screens/login-register/RegisterPage";
import ShowCart from "./screens/show-cart/ShowCart";
import Checkout from "./screens/checkout/Checkout";
import Thanks from "./screens/thanks/Thanks";
import CatMID from "./screens/categories/CatMID";
import CatMH2 from "./screens/categories/CatMH2";
import CatSTX from "./screens/categories/CatSTX";
import CatKDH from "./screens/categories/CatKDH";
import CatAFR from "./screens/categories/CatAFR";

export default function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FrontPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/post/:id" element={<ShowPost />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/show-cart" element={<ShowCart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/thanks" element={<Thanks />} />
          <Route path="/mid" element={<CatMID />} />
          <Route path="/mh2" element={<CatMH2 />} />
          <Route path="/stx" element={<CatSTX />} />
          <Route path="/kdh" element={<CatKDH />} />
          <Route path="/afr" element={<CatAFR />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}
