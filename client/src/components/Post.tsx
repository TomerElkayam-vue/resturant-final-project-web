import { useState } from "react";
import PostActions from "./PostActions";
import { Post } from "../interfaces/post";
import DropzoneComponent from "./Dropzone";
import { useNavigate } from "react-router-dom";
import { IMAGES_URL } from "../constants/files";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useUserContext } from "../context/UserContext";
import { usePostsContext } from "../context/PostsContext";
import { deletePostById, updatePost } from "../services/posts";

interface PostProps {
  post: Post;
  enableChanges?: boolean;
  enablePostActions?: boolean;
}

const PostComponent = ({
  post,
  enableChanges,
  enablePostActions,
}: PostProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(post.content);
  const [editedPhoto, setEditedPhoto] = useState<File | null>();
  const [editedPhotoURL, setEditedPhotoURL] = useState<string | null>();
  const { user } = useUserContext() ?? {};
  const { setPosts, posts } = usePostsContext() ?? {};
  const navigate = useNavigate();

  const isLikedByCurrUser = (): boolean => {
    return post.likedBy.find((currUser) => currUser?._id === user?._id)
      ? true
      : false;
  };
  const onEditSave = () => {
    updatePost(post._id, { photo: editedPhoto, content: description });
    setEditedPhotoURL(editedPhoto ? URL.createObjectURL(editedPhoto) : null);
  };

  const deletePost = () => {
    deletePostById(post._id);
    setPosts?.(
      posts?.filter((currentPost) => currentPost._id !== post._id) ?? []
    );
  };

  const onLikeToggle = () => {
    const prevPosts = posts;
    try {
      if (user) {
        let newLikedBy;
        if (isLikedByCurrUser()) {
          newLikedBy = post.likedBy.filter(
            (currUser) => currUser._id !== user?._id
          );
        } else {
          newLikedBy = [user, ...post.likedBy];
        }
        const newPost: Post = {
          ...post,
          likedBy: newLikedBy,
        };
        updatePostInState(newPost);
        updatePost(post._id, { likedBy: newLikedBy });
      }
    } catch (error) {
      console.error(error);
      setPosts?.(prevPosts ?? []);
    }
  };

  const updatePostInState = (newPost: Post) => {
    setPosts?.(
      (prevPosts) =>
        prevPosts?.map((post) => (post._id === newPost._id ? newPost : post)) ??
        []
    );
  };

  const handleSave = () => {
    onEditSave();

    setIsEditing(false);
  };

  return (
    <div
      className="post card mb-3"
      style={{
        width: "350px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {enableChanges && (
        <div
          className="edit-buttons"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            display: "flex",
            gap: "10px",
          }}
        >
          {enableChanges && !isEditing && (
            <button
              className="btn btn-light"
              style={{ border: "none", background: "transparent" }}
              onClick={() => setIsEditing(true)} // Trigger edit mode
            >
              <FaEdit size={20} />
            </button>
          )}
          {deletePost && (
            <button
              className="btn btn-light"
              style={{ border: "none", background: "transparent" }}
              onClick={deletePost} // Trigger deletePost function on click
            >
              <FaTrash size={20} />
            </button>
          )}
        </div>
      )}

      <div
        className="card-body d-flex justify-content-center row"
        style={{ padding: "1rem" }}
      >
        <div className="d-flex align-items-center mb-1">
          <img
            src={
              post.owner.photo
                ? IMAGES_URL + post.owner.photo
                : "/temp-user.png"
            }
            alt={post.owner.username}
            className="rounded-circle user-photo m-2"
            style={{ width: "30px", height: "30px" }}
          />
          <span className="ml-3">{post.owner.username}</span>
        </div>

        {isEditing ? (
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control mb-3"
              rows={3} // Adjusted to make it fit better in the card
              style={{ height: "40px", resize: "none" }} // Set height to fit
            />
            <DropzoneComponent
              onFileSelect={(file) => setEditedPhoto(file)}
              selectedFile={editedPhoto ?? null}
              
            />
            <button className="btn btn-success mt-1" onClick={handleSave}>
              Save
            </button>
          </div>
        ) : (
          <div
            onClick={() => {
              if (window.location.pathname === "/") {
                navigate(`/post/${post._id}`);
              }
            }}
            style={{
              cursor: window.location.pathname === "/" ? "pointer" : "default",
            }}
            className="hover-shadow"
          >
            <img
              src={editedPhotoURL ? editedPhotoURL : IMAGES_URL + post.photoSrc}
              alt="Post"
              className="img-fluid mb-1"
            />
            <p className="text-center">{description}</p>
          </div>
        )}

        {enablePostActions && (
          <PostActions
            postId={post._id}
            comments={post.comments}
            likesNumber={post.likedBy.length}
            likedByUser={isLikedByCurrUser()}
            key={post._id}
            onLikeToggle={onLikeToggle}
          ></PostActions>
        )}
      </div>
    </div>
  );
};

export default PostComponent;
