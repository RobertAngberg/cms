import { useState, useEffect } from "react";
import Excerpt from "./CatExcerpt.js";

export default function CatSTX() {
  const [productData, setProductData] = useState([]);

  function findObjectsByNestedValue(arr, key, value) {
    const result = [];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i][key].includes(value)) {
        result.push(arr[i]);
      }
    }

    setProductData(...productData, result);
    return result;
  }

  useEffect(() => {
    fetch("/post")
      .then((res) => res.json())
      .then((data) => findObjectsByNestedValue(data, "categories", "AFR"));
  }, []);

  if (!productData) return <div className="loading">Loading...</div>;

  return (
    <main className="index-page">
      {productData.length > 0 &&
        productData.map((post) => <Excerpt key={post._id} {...post} />)}
    </main>
  );
}
