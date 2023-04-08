import { Link } from "react-router-dom";

export default function Excerpt({
  _id,
  title,
  mainImage,
  description,
  price,
  slug,
  createdAt,
  author,
}) {
  return (
    <div className="excerpt">
      <Link to={`/post/${slug}`}>
        <img src={"https://robertscv.se/uploads/" + mainImage} alt="" />
      </Link>
      <Link to={`/post/${slug}`}>
        <h2>{title}</h2>
        {price}kr
      </Link>
    </div>
  );
}
