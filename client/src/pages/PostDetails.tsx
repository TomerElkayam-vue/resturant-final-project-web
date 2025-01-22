import { Post } from "../interfaces/post";
import { useParams } from "react-router-dom";
import PostComponent from "../components/Post";
import { createComment } from "../services/comment";
import PostComments from "../components/PostComments";
import { useUserContext } from "../context/UserContext";
import { usePostsContext } from "../context/PostsContext";

const PostDetails = () => {
  const { setPosts, posts } = usePostsContext() ?? {};
  const { user } = useUserContext() ?? {};
  const { id } = useParams();

  const post = id ? posts?.[id] : undefined;

  const onCommentAdd = (commentContent: string) => {
    if (user && post) {
      const newPost: Post = {
        ...post,
        comments: [{ content: commentContent, user }, ...post.comments],
      };
      updatePostInState(newPost);
      createComment(post._id, { content: commentContent, user: user });
    }
  };

  const updatePostInState = (newPost: Post) => {
    setPosts?.({
      ...posts,
      [newPost._id]: newPost,
    });
  };

  return post ? (
    <div>
      <div
        style={{
          width: "600px",
          height: "100%",
          padding: "15px",
          backgroundColor: "#F8F9FA",
        }}
      >
        <div className="d-flex justify-content-center align-items-center">
          <PostComponent post={post} enablePostActions={true}></PostComponent>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <PostComments
            onCommentAdd={onCommentAdd}
            comments={post.comments}
          ></PostComments>
        </div>
      </div>
    </div>
  ) : (
    <div>post not found.. </div>
  );
};

export default PostDetails;
