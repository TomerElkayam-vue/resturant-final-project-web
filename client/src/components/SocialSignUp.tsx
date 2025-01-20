import { FaGoogle } from "react-icons/fa";

const SocialSignUp = () => {
  return (
    <div className="mt-1">
      <p className="text-center">Or sign up with:</p>
      <div className="d-flex justify-content-center">
        <button className="btn btn-light border w-45 d-flex align-items-center justify-content-center">
          <FaGoogle className="me-2" /> Google
        </button>
      </div>
    </div>
  );
};

export default SocialSignUp;
