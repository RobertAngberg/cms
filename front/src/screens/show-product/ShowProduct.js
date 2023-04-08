import "react-image-gallery/styles/scss/image-gallery.scss";
import "./ShowProduct.css";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../UserContext.js";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import ImageGallery from "react-image-gallery";

export default function ShowProduct() {
  const [productData, setProductData] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [qty, setQty] = useState("Option 1");
  const [cart, setCart] = useState([]);
  const [buttonText, setButtonText] = useState("Lägg i varukorg");

  const { id } = useParams();
  const { userInfo } = useContext(UserContext);

  const handleQtyChanged = (event) => {
    setQty(event.target.value);
  };

  function buyBtnClicked() {
    setCart([
      ...cart,
      {
        sku: productData[0].title,
        mainImage: `https://robertscv.se/uploads/${productData[0].mainImage}`,
        price: productData[0].price,
        qty: qty.replace("Option ", ""),
      },
    ]);

    const items = JSON.parse(localStorage.getItem("items"));
    if (items) {
      setCart(items);
      localStorage.setItem("cart", JSON.stringify(items));
    }

    setButtonText("Tillagd!");
  }

  useEffect(() => {
    fetch(`https://ms-rgk2.onrender.com/post/post/${id}`).then((response) => {
      response.json().then((productData) => {
        setProductData(productData);
        setGalleryImages([
          {
            original: `/uploads/${productData[0].mainImage}`,
            thumbnail: `/uploads/${productData[0].mainImage}`,
          },
          {
            original: `/uploads/${productData[0].galleryImage1}`,
            thumbnail: `/uploads/${productData[0].galleryImage1}`,
          },
          {
            original: `/uploads/${productData[0].galleryImage2}`,
            thumbnail: `/uploads/${productData[0].galleryImage2}`,
          },
          {
            original: `/uploads/${productData[0].galleryImage3}`,
            thumbnail: `/uploads/${productData[0].galleryImage3}`,
          },
        ]);
      });
    });
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (cart) {
      setCart(cart);
    }
    console.log(cart);
  }, [id]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  if (!productData) return "Loading...";

  return (
    <main className="show-post">
      {/* Kolla om inloggad, isåfall visa redigera-knapp */}
      {userInfo.id === productData[0].author._id && (
        <div className="edit-row">
          <Link to={`/edit/${productData[0].id}`}>
            <button className="editBtn" type="button">
              Ändra produkt
            </button>
            <br></br>
          </Link>
        </div>
      )}

      <div className="flexbox-top">
        <div className="image">
          {galleryImages.length > 0 && (
            <ImageGallery
              items={galleryImages}
              showPlayButton={false}
              showFullscreenButton={false}
              showNav={false}
            />
          )}
        </div>

        <div className="information">
          <h1>{productData[0].title}</h1>
          <p className="price">{productData[0].price}kr</p>
          <div className="flexbox">
            {/* <select name="cars" id="cars" > */}
            <select
              value={qty}
              onChange={handleQtyChanged}
              aria-label="Välj antal"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
            <button onClick={buyBtnClicked}>{buttonText}</button>
          </div>
          {parse(productData[0].description)}
          <br></br>
          <hr />
          Kategorier: {productData[0].categories}
        </div>
      </div>
      <br></br>
      <br></br>
    </main>
  );
}
