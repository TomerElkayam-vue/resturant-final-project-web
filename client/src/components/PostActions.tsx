import { FaHeart } from "react-icons/fa";
import { PostComment } from "../interfaces/comment";
import { useNavigate } from "react-router-dom";

interface PostActionsProps {
  postId: string;
  likesNumber: number;
  likedByUser: boolean;
  comments: PostComment[];
  onLikeToggle: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  postId,
  likesNumber,
  likedByUser,
  comments,
  onLikeToggle,
}) => {
  const navigate = useNavigate();

  return (
    <div className="post-actions mt-1">
      <div className="d-flex align-items-center mb-1">
        <button
          className={`btn btn-light ${
            likedByUser ? "text-danger" : "text-secondary"
          }`}
          onClick={onLikeToggle}
          style={{ border: "none", background: "transparent", padding: "3px" }}
        >
          <FaHeart size={20} />
        </button>
        <span className="ml-1">{likesNumber} Likes</span>
      </div>

      <div
        className="mb-1"
        style={{
          cursor: window.location.pathname === "/" ? "pointer" : "default",
        }}
        onClick={() => {
          if (window.location.pathname === "/") {
            navigate(`/post/${postId}`);
          }
        }}
      >
        <span>{comments.length} Comments</span>
      </div>
    </div>
  );
};

export default PostActions;
