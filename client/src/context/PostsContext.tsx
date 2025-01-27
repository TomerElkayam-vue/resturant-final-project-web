import { Post } from "../interfaces/post";
import { getPosts } from "../services/posts";
import { ReactNode, useEffect } from "react";
import { useUserContext } from "./UserContext";
import { createContext, useContext, useState } from "react";

const buildPostsQuery = (ownerId?: string, offset?: number) => {
  if (!ownerId && !offset) {
    return "";
  } else {
    let query = "?";
    if (ownerId) {
      query += `postOwner=${ownerId}`;
    }
    if (offset) {
      query += `${
        query.endsWith("?") ? `offset=${offset}` : `&offset=${offset}`
      }`;
    }
    return query;
  }
};

type PostsContextType = {
  posts: Record<Post["_id"], Post>;
  setPosts: React.Dispatch<React.SetStateAction<Record<Post["_id"], Post>>>;
  isLoading: boolean;
  clearPosts: () => void;
  fetchPosts: ({
    ownerId,
    offset,
  }: {
    ownerId?: string;
    offset?: number;
  }) => Promise<void>;
} | null;

const PostsContext = createContext<PostsContextType>(null);

export const usePostsContext = () => useContext(PostsContext);

export const PostsContextProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserContext() ?? {};

  const [posts, setPosts] = useState<Record<Post["_id"], Post>>({});
  const [isLoading, setIsLoading] = useState(true);

  const clearPosts = () => {
    setPosts({});
  };

  const fetchPosts = async ({
    ownerId,
    offset,
  }: {
    ownerId?: string;
    offset?: number;
  }) => {
    try {
      setIsLoading(true);
      const postsMap: Record<Post["_id"], Post> = {};

      (await getPosts(buildPostsQuery(ownerId, offset))).forEach((post) => {
        postsMap[post._id] = post;
      });
      setPosts((prev) => ({ ...prev, ...postsMap }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts({});
  }, [user]);

  return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts,
        isLoading,
        fetchPosts,
        clearPosts,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};
