import { useEffect } from "react";
import { usePostsContext } from "../context/PostsContext";
import { PostsList } from "../components/PostsList";

const Home = () => {
  const { posts, fetchPosts, isLoading } = usePostsContext() ?? {};

  useEffect(() => {
    fetchPosts?.();
  }, []);

  return !posts || isLoading ? (
    <div
      className="spinner-border text-success"
      style={{ width: "15rem", height: "15rem" }}
    />
  ) : (
    <PostsList posts={Object.values(posts)} />
  );
};

export default Home;
