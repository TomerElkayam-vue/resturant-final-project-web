import { useMemo, useState } from "react";
import PostComponent from "../components/Post";
import { updateUser } from "../services/users";
import UserProfile from "../components/UserProfile";
import { usePostsContext } from "../context/PostsContext";
import { useUserContext } from "../context/UserContext";
import { enqueueSnackbar } from "notistack";

const postsPerPage = 2;

const Profile = () => {
  const { posts } = usePostsContext() ?? {};
  const [currentPage, setCurrentPage] = useState(1);
  const { user, setUser } = useUserContext() ?? {};

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredPosts = useMemo(
    () => posts?.filter((post) => post.owner._id === user?._id),
    [posts, user?._id]
  );

  const paginatedPosts = useMemo(
    () =>
      filteredPosts?.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
      ),
    [currentPage, filteredPosts]
  );

  const totalPages = useMemo(
    () => Math.ceil((filteredPosts?.length ?? 0) / postsPerPage),
    [filteredPosts]
  );

  const handleSaveProfile = async (
    updatedUsername: string,
    updatedProfilePhoto: File | null
  ) => {
    try {
      const updatedData = {
        username: updatedUsername,
        ...(updatedProfilePhoto && { photo: updatedProfilePhoto }),
      };
      setUser?.(await updateUser(user!._id, updatedData));
    } catch (error) {
      if (error instanceof Error) {
        console.error("error updating user - ", error.message);
        enqueueSnackbar(error.message, { variant: "error" });
      }
    }
  };
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="mt-4 d-flex flex-column justify-content-center col-6">
            {/* Posts Section */}
            <div className="row flex-grow-1" style={{ minHeight: "300px" }}>
              {paginatedPosts?.length ? (
                paginatedPosts.map((post) => (
                  <div className="col-12 mb-3" key={post._id}>
                    <PostComponent
                      enableChanges={true}
                      key={post._id}
                      post={post}
                    />
                  </div>
                ))
              ) : (
                <div className="col-12 d-flex justify-content-center align-items-center">
                  <p className="text-center">No posts available.</p>
                </div>
              )}
            </div>

            {/* Pagination Section */}
            <div className="row">
              <div className="col-12 text-center">
                {totalPages > 0 ? (
                  [...Array(totalPages).keys()].map((num) => (
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
                  <button className="btn btn-outline-secondary" disabled>
                    No Pages
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* User Profile Section */}
          {user && (
            <div className="col-6 mt-4" style={{ width: "30%" }}>
              <UserProfile
                username={user.username}
                email={user.email}
                profilePhoto={user.photo || null}
                onSaveProfile={handleSaveProfile}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
