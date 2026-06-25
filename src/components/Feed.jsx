import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./userCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(!feed); // true if feed not yet loaded

  const getFeed = async () => {
    if (feed) return;
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center my-16">
        <div className="card bg-base-300 w-80 sm:w-96 shadow-xl animate-pulse">
          <div className="h-72 bg-base-200 rounded-t-xl"></div>
          <div className="card-body gap-3">
            <div className="h-6 bg-base-200 rounded w-2/3"></div>
            <div className="h-4 bg-base-200 rounded w-full"></div>
            <div className="h-4 bg-base-200 rounded w-4/5"></div>
            <div className="flex gap-4 mt-2">
              <div className="h-10 bg-base-200 rounded flex-1"></div>
              <div className="h-10 bg-base-200 rounded flex-1"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!feed || feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center my-20 gap-4 opacity-60">
        <span className="text-6xl">🎉</span>
        <h2 className="text-2xl font-semibold">You're all caught up!</h2>
        <p className="text-sm">No new developers to explore right now.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;
