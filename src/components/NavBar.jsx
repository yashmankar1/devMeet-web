import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeConnections } from "../utils/connectionSlice";
import { addFeed } from "../utils/feedSlice";
import { addRequests } from "../utils/requestSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeConnections());
      dispatch(addFeed(null));
      dispatch(addRequests(null));
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="navbar bg-base-300 shadow-sm sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl font-bold tracking-wide">
          💻 devMeet
        </Link>
      </div>

      {user && (
        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-sm opacity-70">
            Hey, {user.firstName}!
          </span>
          <div className="dropdown dropdown-end mx-3">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img alt="user photo" src={user.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-lg"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
              <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <Link to="/premium">Premium</Link>
              </li>
              <li className="mt-1 border-t border-base-200 pt-1">
                <button onClick={handleLogout} className="text-error">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
