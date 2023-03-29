import "./AddEditProduct.css";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "./Editor.js";

export default function EditPost() {
  const [_id, set_id] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { id } = useParams();

  // Hämta produktinfo från DB
  useEffect(() => {
    fetch(`/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        set_id(postInfo[0]._id);
        setMainImage(postInfo[0].mainImage);
        setTitle(postInfo[0].title);
        setDescription(postInfo[0].description);
        setPrice(postInfo[0].price);
      });
    });
  }, [id]);

  // Spara ändringar
  async function updatePost(event) {
    event.preventDefault();
    const data = new FormData();
    data.set("_id", _id);
    if (mainImage[0]) {
      data.set("mainImage", mainImage[0]);
    }
    data.set("title", title);
    data.set("price", price);
    data.set("description", description);
    data.set("slug", slug);

    const response = await fetch("/post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  useEffect(() => {
    setSlug(title.replace(/\s+/g, "-").toLowerCase());
  }, [title, slug]);

  if (redirect) {
    return <Navigate to={"/post/" + slug} />;
  }

  return (
    <main className="edit-product">
      <form encType="multipart/form-data" onSubmit={updatePost}>
        <input
          type="title"
          placeholder={"Title"}
          value={title || ""}
          onChange={(event) => setTitle(event.target.value)}
        />

        <div className="three-columns-flex">
          <label htmlFor="filePicker">Välj huvudbild</label>
          <input
            className="filePicker"
            id="filePicker" // Connectar label till knapp
            type="file"
            onChange={(event) => setMainImage(event.target.files)}
          />
          <input
            className="price"
            type="number"
            placeholder={"Pris"}
            value={price || ""}
            onChange={(event) => setPrice(event.target.value)}
          />
        </div>

        <Editor value={description} onChange={setDescription} />

        <br />
        <button type="submit">Uppdatera produkt</button>
      </form>
    </main>
  );
}
