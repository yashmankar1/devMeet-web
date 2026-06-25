import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useState } from "react";

const UserCard = ({ user, isPreview = false }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills } = user;
  const dispatch = useDispatch();
  const [loadingStatus, setLoadingStatus] = useState(null);

  const handleSendRequest = async (status, userId) => {
    setLoadingStatus(status);
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoadingStatus(null);
    }
  };

  return (
    <div className="card bg-base-300 w-80 sm:w-96 shadow-xl">
      <figure className="h-72 overflow-hidden">
        <img
          src={photoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + firstName}
          alt={firstName}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body gap-3">
        <h2 className="card-title text-xl">
          {firstName} {lastName}
          {age && gender && (
            <span className="text-sm font-normal opacity-60 ml-1">
              · {age}, {gender}
            </span>
          )}
        </h2>

        {about && <p className="text-sm opacity-75 line-clamp-3">{about}</p>}

        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {skills.map((skill, i) => (
              <span key={i} className="badge badge-outline badge-sm">
                {skill}
              </span>
            ))}
          </div>
        )}

        {!isPreview && (
          <div className="card-actions justify-center gap-4 mt-2">
            <button
              className="btn btn-outline btn-error flex-1"
              onClick={() => handleSendRequest("ignored", _id)}
              disabled={loadingStatus !== null}
            >
              {loadingStatus === "ignored" ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "✕ Ignore"
              )}
            </button>
            <button
              className="btn btn-primary flex-1"
              onClick={() => handleSendRequest("interested", _id)}
              disabled={loadingStatus !== null}
            >
              {loadingStatus === "interested" ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "♥ Interested"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
