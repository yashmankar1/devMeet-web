import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(!connections);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto my-10 px-4 space-y-4">
        <div className="h-8 bg-base-300 rounded w-48 mx-auto animate-pulse"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-base-300 rounded-xl animate-pulse">
            <div className="w-16 h-16 rounded-full bg-base-200 shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-base-200 rounded w-1/3"></div>
              <div className="h-3 bg-base-200 rounded w-1/2"></div>
            </div>
            <div className="w-16 h-9 bg-base-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center my-20 gap-4 opacity-60">
        <span className="text-6xl">🤝</span>
        <h2 className="text-2xl font-semibold">No connections yet</h2>
        <p className="text-sm">Go to the feed and connect with developers!</p>
        <Link to="/" className="btn btn-primary btn-sm mt-2">
          Explore Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        My Connections
        <span className="ml-2 text-lg font-normal opacity-50">({connections.length})</span>
      </h1>

      <div className="space-y-3">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } = connection;
          return (
            <div
              key={_id}
              className="flex items-center gap-4 p-4 bg-base-300 rounded-xl hover:bg-base-200 transition-colors"
            >
              <img
                className="w-14 h-14 rounded-full object-cover shrink-0 ring ring-primary ring-offset-base-100 ring-offset-1"
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
              <Link to={"/chat/" + _id} className="shrink-0">
                <button className="btn btn-primary btn-sm">💬 Chat</button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
