import { authLogout } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import {
  FaHome,
  FaPlusCircle,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { enqueueSnackbar } from "notistack";

const Navbar = () => {
  const navigate = useNavigate();
  const { setUser } = useUserContext() ?? {};

  const handleLogout = async () => {
    try {
      await authLogout();
      setUser?.(null);
      navigate("/");
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to logout", { variant: "error" });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src="/logo.png"
            alt="PlantsUniverse Logo"
            className="logo m-1"
            style={{ width: "30px", height: "30px" }}
          />
          PlantsUniverse
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <FaHome className="me-2" /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/add-post" className="nav-link">
                <FaPlusCircle className="me-2" /> Add Post
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link">
                <FaUserCircle className="me-2" /> Profile
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
