import { useState } from "react";
import PostActions from "./PostActions";
import { Post } from "../interfaces/post";
import { StarRating } from "./StarRating";
import { useNavigate } from "react-router-dom";
import { IMAGES_URL } from "../constants/files";
import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";
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
  const [rating, setRating] = useState(post.rating);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const { user } = useUserContext() ?? {};
  const { setPosts, posts } = usePostsContext() ?? {};
  const navigate = useNavigate();

  const isLikedByCurrUser = (): boolean => {
    return post.likedBy.find((currUser) => currUser?._id === user?._id)
      ? true
      : false;
  };
  const onEditSave = () => {
    updatePost(post._id, { content: description, rating: rating });
  };

  const deletePost = () => {
    deletePostById(post._id);
    const tempPosts = { ...posts };
    delete tempPosts[post._id];
    setPosts?.(tempPosts);
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
      setPosts?.(prevPosts ?? {});
    }
  };

  const updatePostInState = (newPost: Post) => {
    setPosts?.((prevPosts) => ({ ...prevPosts, [newPost._id]: newPost }));
  };

  const handleSave = () => {
    onEditSave();

    setIsEditing(false);
  };

  return (
    <div
      className="post mb-3"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      style={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {isHovered && (
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
          {enablePostActions && !isEditing && (
            <button
              className="btn btn-light"
              style={{ border: "none", background: "transparent" }}
              onClick={() => setIsEditing(true)} // Trigger edit mode
            >
              <MdEdit size={20} />
            </button>
          )}
          {deletePost && enableChanges && (
            <button
              className="btn btn-light"
              style={{ border: "none", background: "transparent" }}
              onClick={deletePost} // Trigger deletePost function on click
            >
              <MdDeleteForever size={30} />
            </button>
          )}
        </div>
      )}

      <div
        className="card-body d-flex justify-content-center row"
        style={{ padding: "1rem" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <img
            src={
              post.owner.photo
                ? post.owner.photo.startsWith("http")
                  ? post.owner.photo
                  : IMAGES_URL + post.owner.photo
                : "/temp-user.png"
            }
            alt={post.owner.username}
            className="rounded-circle user-photo m-2"
            style={{ width: "30px", height: "30px" }}
          />
          <span className="ml-3">
            <b>{post.owner.username}</b>
          </span>
        </div>

        {isEditing ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control mb-3"
              style={{ height: "40px", resize: "none" }}
            />
            <img
              src={IMAGES_URL + post.photoSrc}
              alt="Post"
              height="200px"
              className="img-fluid mb-1"
            />
            <StarRating rating={rating} onRatingChanged={setRating}/>
            <button className="btn btn-dark mt-1" onClick={handleSave}>
              Save
            </button>
          </div>
        ) : (
          <div
            onClick={() => {
              navigate(`/post/${post._id}`);
            }}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
                alignItems: "center", 
              flexDirection: "column",
            }}
            className="hover-shadow"
          >
            <p className="text-center">{description}</p>
            <img
              src={IMAGES_URL + post.photoSrc}
              alt="Post"
              className="img-fluid mb-1"
            />
            <StarRating rating={rating} onRatingChanged={() => setIsEditing(true)}/>
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
