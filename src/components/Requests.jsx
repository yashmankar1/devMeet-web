import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({}); // { [requestId]: "accepted" | "rejected" }

  const reviewRequest = async (status, requestId) => {
    setActionLoading((prev) => ({ ...prev, [requestId]: status }));
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + requestId,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(requestId));
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading((prev) => {
        const updated = { ...prev };
        delete updated[requestId];
        return updated;
      });
    }
  };

  const fetchRequests = async () => {
    if (requests) return;
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto my-10 px-4 space-y-4">
        <div className="h-8 bg-base-300 rounded w-64 mx-auto animate-pulse"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-base-300 rounded-xl animate-pulse">
            <div className="w-16 h-16 rounded-full bg-base-200 shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-base-200 rounded w-1/3"></div>
              <div className="h-3 bg-base-200 rounded w-1/2"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-20 h-9 bg-base-200 rounded"></div>
              <div className="w-20 h-9 bg-base-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center my-20 gap-4 opacity-60">
        <span className="text-6xl">📭</span>
        <h2 className="text-2xl font-semibold">No pending requests</h2>
        <p className="text-sm">When someone is interested in you, they'll appear here.</p>
        <Link to="/" className="btn btn-primary btn-sm mt-2">
          Explore Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Connection Requests
        <span className="ml-2 text-lg font-normal opacity-50">({requests.length})</span>
      </h1>

      <div className="space-y-3">
        {requests.map((request) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            request.fromUserId;
          const isActing = actionLoading[request._id];

          return (
            <div
              key={request._id}
              className="flex items-center gap-4 p-4 bg-base-300 rounded-xl hover:bg-base-200 transition-colors"
            >
              <img
                className="w-14 h-14 rounded-full object-cover shrink-0 ring ring-secondary ring-offset-base-100 ring-offset-1"
                src={photoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + firstName}
                alt={firstName}
              />
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-base truncate">
                  {firstName} {lastName}
                </h2>
                {age && gender && (
                  <p className="text-xs opacity-60">{age} · {gender}</p>
                )}
                {about && (
                  <p className="text-sm opacity-70 truncate mt-0.5">{about}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  className="btn btn-outline btn-error btn-sm"
                  onClick={() => reviewRequest("rejected", request._id)}
                  disabled={!!isActing}
                >
                  {isActing === "rejected" ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Reject"
                  )}
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => reviewRequest("accepted", request._id)}
                  disabled={!!isActing}
                >
                  {isActing === "accepted" ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Accept"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
