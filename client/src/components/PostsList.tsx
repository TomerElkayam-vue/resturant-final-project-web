import { useMemo, useState } from "react";
import { Post } from "../interfaces/post";
import PostComponent from "./Post";

const POSTS_PER_PAGE = 2;

type Props = {
  posts: Post[] | undefined;
};

export const PostsList = ({ posts }: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedPosts = useMemo(
    () =>
      posts?.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
      ),
    [currentPage, posts]
  );

  const amountOfPages = useMemo(
    () => Math.ceil((posts?.length ?? 0) / POSTS_PER_PAGE),
    [posts]
  );
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
            {paginatedPosts?.length ? (
              paginatedPosts.map((post) => (
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
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {amountOfPages > 0 ? (
                [...Array(amountOfPages).keys()].map((num) => (
                  <button
                    key={num}
                    className={`btn btn-${
                      num + 1 === currentPage ? "success" : "outline-success"
                    } mx-1`}
                    onClick={() => handlePageChange(num + 1)}
                  >
                    {num + 1}
                  </button>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
