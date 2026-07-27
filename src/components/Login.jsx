import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      isLoginForm ? handleLogin() : handleSignUp();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="card bg-base-300 w-full max-w-md shadow-xl">
        <div className="card-body gap-4">
          {/* Logo / Brand */}
          <div className="text-center mb-2">
            <h1 className="text-3xl font-bold text-primary">💻 devMeet</h1>
            <p className="text-sm opacity-60 mt-1">Connect with developers</p>
          </div>

          <h2 className="card-title justify-center text-xl">
            {isLoginForm ? "Welcome back!" : "Create account"}
          </h2>

          {!isLoginForm && (
            <div className="flex gap-2">
              <fieldset className="fieldset flex-1">
                <legend className="fieldset-legend">First Name</legend>
                <input
                  type="text"
                  value={firstName}
                  className="input w-full"
                  placeholder="John"
                  onChange={(e) => setFirstName(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </fieldset>
              <fieldset className="fieldset flex-1">
                <legend className="fieldset-legend">Last Name</legend>
                <input
                  type="text"
                  value={lastName}
                  className="input w-full"
                  placeholder="Doe"
                  onChange={(e) => setLastName(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </fieldset>
            </div>
          )}

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input
              type="email"
              value={emailId}
              className="input w-full"
              placeholder="john@example.com"
              onChange={(e) => setEmailId(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              value={password}
              className="input w-full"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </fieldset>

          {error && (
            <div className="alert alert-error py-2 text-sm">
              <span>{error}</span>
            </div>
          )}

          <div className="card-actions justify-center mt-2">
            <button
              className="btn btn-primary w-full"
              onClick={isLoginForm ? handleLogin : handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : isLoginForm ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </button>
          </div>

          <p
            className="text-center text-sm cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
            onClick={() => {
              setError("");
              setIsLoginForm((v) => !v);
            }}
          >
            {isLoginForm
              ? "New here? Create an account →"
              : "Already have an account? Login →"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
