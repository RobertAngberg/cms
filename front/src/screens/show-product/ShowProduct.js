import "react-image-gallery/styles/scss/image-gallery.scss";
import React, { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import { useContext } from "react";
import { UserContext } from "../../UserContext.js";
import { Link } from "react-router-dom";
import "./ShowProduct.css";

export default function ShowProduct() {
  const [cart, setCart] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [galleryImages, setGalleryImages] = useState([]);
  const [productData, setProductData] = useState("");
  const { id } = useParams();
  const { userInfo } = useContext(UserContext);
  const [cartButtonText, setCartButtonText] = useState("Lägg till");

  useEffect(() => {
    fetch(`/post/${id}`).then((response) => {
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
  }, [id, cart]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  const addToCart = (item) => {
    const newCart = [...cart, item];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleQuantityChange = (event) => {
    setSelectedQuantity(parseInt(event.target.value));
  };

  const handleAddToCart = () => {
    const item = {
      mainImage: productData[0].mainImage,
      title: productData[0].title,
      price: productData[0].price,
      qty: selectedQuantity,
    };
    addToCart(item);
    setCartButtonText("Tillagd!");
  };

  if (!productData) return "Loading...";

  //////////////////////////////////////////////////////

  return (
    <main className="show-product">
      {/* Redigera-knapp */}
      {userInfo.id === productData[0].author._id && (
        <Link to={`/edit/${productData[0].id}`}>
          <button className="editBtn" type="button">
            Ändra produkt
          </button>
        </Link>
      )}
      <div className="flexbox-top">
        <div className="image-column">
          {galleryImages.length > 0 && (
            <ImageGallery
              items={galleryImages}
              showPlayButton={false}
              showFullscreenButton={false}
              showNav={false}
            />
          )}
        </div>

        <div className="information-column">
          <h1>{productData[0].title}</h1>
          <p className="price">{productData[0].price}kr</p>
          <div className="flexbox">
            <div className="flexbox-top">
              <div>
                <div className="flexbox">
                  <p className="text-välj-antal">Välj antal:</p>
                  <select
                    className="select-quantity"
                    onChange={handleQuantityChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button onClick={handleAddToCart}>{cartButtonText}</button>
                </div>
                <br></br>
                {parse(productData[0].description)}
                <br></br>
                <hr />
                Kategorier: {productData[0].categories}
                <br></br>
                <br></br>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
