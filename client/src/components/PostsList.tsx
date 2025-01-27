import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Post } from "../interfaces/post";
import PostComponent from "./Post";
import { usePostsContext } from "../context/PostsContext";

type Props = {
  currentUser?: string;
};

export const PostsList = ({ currentUser }: Props) => {
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const { posts, fetchPosts, isLoading, clearPosts } = usePostsContext() ?? {};

  const reFetch = useCallback((offset: number) => {
    fetchPosts?.({ offset, ownerId: currentUser });
  }, []);

  useEffect(() => {
    clearPosts?.();
    fetchPosts?.({ ownerId: currentUser });
  }, []);

  const loaderRef = useRef(null);

  const increaseOffset = () => {
    setCurrentOffset((prev) => {
      reFetch(prev + 3);
      return prev + 3;
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          increaseOffset();
        }
      },
      { root: null, rootMargin: "20px", threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, []);

  return (
    <div
      style={{
        height: "100%",
        backgroundColor: "#F8F9FA",
        width: "600px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {Object.values(posts ?? {})?.length ? (
              Object.values(posts ?? {}).map((post) => (
                <div key={post._id}>
                  <PostComponent
                    enableChanges={true}
                    key={post._id}
                    post={post}
                  />
                </div>
              ))
            ) : (
              <div>
                <p>No posts available.</p>
              </div>
            )}
          </div>
        </div>
        <div
          ref={loaderRef}
          style={{ height: "20px", background: "transparent" }}
        ></div>
      </div>
    </div>
  );
};
