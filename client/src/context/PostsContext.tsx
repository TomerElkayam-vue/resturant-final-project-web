import { Post } from "../interfaces/post";
import { getPosts } from "../services/posts";
import { ReactNode, useEffect } from "react";
import { useUserContext } from "./UserContext";
import { createContext, useContext, useState } from "react";

type PostsContextType = {
  posts: Record<Post["_id"], Post>;
  setPosts: React.Dispatch<React.SetStateAction<Record<Post["_id"], Post>>>;
  isLoading: boolean;
  fetchPosts: () => Promise<void>;
} | null;

const PostsContext = createContext<PostsContextType>(null);

export const usePostsContext = () => useContext(PostsContext);

export const PostsContextProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserContext() ?? {};

  const [posts, setPosts] = useState<Record<Post["_id"], Post>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const postsMap: Record<Post["_id"], Post> = {};
      (await getPosts()).forEach((post) => {
        postsMap[post._id] = post;
      });
      setPosts(postsMap);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts,
        isLoading,
        fetchPosts,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};
