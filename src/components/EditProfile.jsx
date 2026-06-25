import { useState } from "react";
import UserCard from "./userCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const saveProfile = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, photoUrl, age, gender, about },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setError(error?.response?.data || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-center items-start gap-8 my-10 px-4">
        {/* Form */}
        <div className="card bg-base-300 w-full max-w-md shadow-xl">
          <div className="card-body gap-3">
            <h2 className="card-title justify-center text-xl">Edit Profile</h2>

            <div className="flex gap-2">
              <fieldset className="fieldset flex-1">
                <legend className="fieldset-legend">First Name</legend>
                <input
                  type="text"
                  value={firstName}
                  className="input w-full"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </fieldset>
              <fieldset className="fieldset flex-1">
                <legend className="fieldset-legend">Last Name</legend>
                <input
                  type="text"
                  value={lastName}
                  className="input w-full"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </fieldset>
            </div>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Photo URL</legend>
              <input
                type="url"
                value={photoUrl}
                className="input w-full"
                placeholder="https://..."
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </fieldset>

            <div className="flex gap-2">
              <fieldset className="fieldset flex-1">
                <legend className="fieldset-legend">Age</legend>
                <input
                  type="number"
                  value={age}
                  className="input w-full"
                  min="18"
                  max="100"
                  onChange={(e) => setAge(e.target.value)}
                />
              </fieldset>
              <fieldset className="fieldset flex-1">
                <legend className="fieldset-legend">Gender</legend>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="select w-full"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </fieldset>
            </div>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">About</legend>
              <textarea
                className="textarea w-full"
                placeholder="Tell developers about yourself..."
                value={about}
                rows={3}
                onChange={(e) => setAbout(e.target.value)}
              ></textarea>
            </fieldset>

            {error && (
              <div className="alert alert-error py-2 text-sm">
                <span>{error}</span>
              </div>
            )}

            <div className="card-actions justify-center mt-2">
              <button
                className="btn btn-primary w-full"
                onClick={saveProfile}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Save Profile"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm opacity-50 font-medium uppercase tracking-wider">Preview</p>
          <UserCard
            user={{ firstName, lastName, photoUrl, age, gender, about }}
          />
        </div>
      </div>

      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success shadow-lg">
            <span>✅ Profile saved successfully!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
