import "./AddEditProduct.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Editor from "./Editor.js";

export default function AddProduct() {
  const [mainImage, setMainImage] = useState();
  const [btnTxt, setBtnTxt] = useState("Välj galleribild 1");
  const [title, setTitle] = useState("");
  const [gallImg1, setGallImg1] = useState(null);
  const [gallImg2, setGallImg2] = useState(null);
  const [gallImg3, setGallImg3] = useState(null);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [mainImgData, setMainImgData] = useState();
  const [glryImgData, setGlryImgData] = useState([]);
  const [categories, setCategories] = useState([]);

  async function createNewProduct(event) {
    event.preventDefault();
    const formData = new FormData();
    // Tredje param: ta slug och bestäm filename
    formData.set("mainImage", mainImage[0], `${slug}-main.jpg`);
    formData.set("title", title);
    if (gallImg1 !== null) {
      formData.set("galleryImage1", gallImg1[0], `${slug}-1.jpg`);
    }
    if (gallImg2 !== null) {
      formData.set("galleryImage2", gallImg2[0], `${slug}-2.jpg`);
    }
    if (gallImg3 !== null) {
      formData.set("galleryImage3", gallImg3[0], `${slug}-3.jpg`);
    }

    formData.set("price", price);
    formData.set("description", description);
    formData.set("slug", slug);
    formData.set("categories", categories);

    const response = await fetch("/add", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  function categoryPicked(e) {
    setCategories([...categories, e]);
  }

  // Göra slug: ta title och gör om mellanslag till -
  // samt versaler till gemener
  useEffect(() => {
    setSlug(title.replace(/\s+/g, "-").toLowerCase());
    console.log(categories);
  }, [title, slug, gallImg1, categories]);

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  const fileReader = new FileReader();

  return (
    <main className="add-product">
      <form encType="multipart/form-data" onSubmit={createNewProduct}>
        <div className="flexy">
          <div className="main-section">
            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              className="input-title"
              type="title"
              placeholder="Produktnamn"
            />

            <input
              className="price"
              type="number"
              placeholder={"Pris"}
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />

            <Editor value={description} onChange={setDescription} />
            <br />

            <button type="submit">Lägg till produkt</button>
          </div>

          {/* ////////////////////////////////////////////////////// */}

          <div className="side-section">
            <h2>Välj Kategorier</h2>
            <div className="category-picker">
              <div className="checkbox-div">
                <input
                  type="checkbox"
                  value="AFR"
                  style={{ width: "40px" }}
                  onChange={(e) => categoryPicked(e.target.value)}
                />
                AFR
              </div>

              <div className="checkbox-div">
                <input
                  type="checkbox"
                  value="KDH"
                  style={{ width: "40px" }}
                  onChange={(e) => categoryPicked(e.target.value)}
                />
                KDH
              </div>

              <div className="checkbox-div">
                <input
                  type="checkbox"
                  value="STX"
                  style={{ width: "40px" }}
                  onChange={(e) => categoryPicked(e.target.value)}
                />
                STX
              </div>

              <div className="checkbox-div">
                <input
                  type="checkbox"
                  value="MH2"
                  style={{ width: "40px" }}
                  onChange={(e) => categoryPicked(e.target.value)}
                />
                MH2
              </div>

              <div className="checkbox-div">
                <input
                  type="checkbox"
                  value="MID"
                  style={{ width: "40px" }}
                  onChange={(e) => categoryPicked(e.target.value)}
                />
                MID
              </div>
            </div>

            <label htmlFor="imgPickBtn">Välj huvudbild</label>
            <input
              type="file"
              className="filePicker"
              id="imgPickBtn" // Connectar label till knapp
              name="imgPickBtn"
              onChange={(event) => {
                setMainImage(event.target.files);
                fileReader.addEventListener("load", () => {
                  setMainImgData(fileReader.result);
                });
                fileReader.readAsDataURL(event.target.files[0]);
              }}
            />

            <img style={{ width: "150px" }} src={mainImgData} alt="" />

            <label htmlFor="imgPickBtn2">{btnTxt}</label>
            <input
              type="file"
              className="filePicker"
              id="imgPickBtn2"
              style={{ display: "none !important" }}
              onChange={(event) => {
                if (gallImg1 == null) {
                  setGallImg1(event.target.files);
                  setBtnTxt("Välj galleribild 2");
                }
                if (gallImg1 != null && gallImg2 == null) {
                  setGallImg2(event.target.files);
                  setBtnTxt("Välj galleribild 3");
                }
                if (gallImg2 != null && gallImg3 == null) {
                  setGallImg3(event.target.files);
                  setBtnTxt("Välj galleribild 4");
                }

                fileReader.addEventListener("load", () => {
                  setGlryImgData([...glryImgData, fileReader.result]);
                });
                fileReader.readAsDataURL(event.target.files[0]);
              }}
            />

            {/* Visa galleribilder */}
            {glryImgData.map((element, index) => (
              <img
                key={element}
                style={{ width: "150px" }}
                src={glryImgData[index]}
                alt=""
              />
            ))}
          </div>
        </div>
      </form>
    </main>
  );
}
