import Excerpt from "./Excerpt.js";
import useFetch from "../../useFetch.js";

export default function FrontPage() {
  const [posts] = useFetch("https://ms-rgk2.onrender.com/post");

  if (!posts) return <div className="loading">Loading...</div>;

  return (
    <main className="index-page">
      {posts.length > 0 &&
        posts.map((post) => <Excerpt key={post._id} {...post} />)}
    </main>
  );
}
