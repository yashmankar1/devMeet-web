import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useState } from "react";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);

  const verifyPremiumUser = async () => {
    const res = await axios.get(BASE_URL + "/premium/verify", {
      withCredentials: true,
    });

    if (res.data.isPremium) {
      setIsUserPremium(true);
    }
  };

  const handleByClick = async (type) => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      {
        membershipType: type,
      },
      { withCredentials: true }
    );

    const { amount, keyId, currency, notes, orderId } = order.data;

    var options = {
      key: keyId,
      amount,
      currency,
      name: "devMeet",
      description: "Connect to other developer",
      image: "https://example.com/your_logo",
      order_id: orderId,

      prefill: {
        name: notes.firstName + " " + notes.lastName,
        email: notes.emailId,
        contact: "+919876543210",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },

      handler: verifyPremiumUser,
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return isUserPremium ? (
    "Your already a Premium user"
  ) : (
    <div className="w-full flex flex-col md:flex-row gap-6 p-6">
      <div className="card bg-base-200 shadow-xl p-6 rounded-2xl flex-1 border border-gray-300">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Silver Plan</h2>
        <p className="text-gray-500 mb-4">
          Basic premium access with essential features.
        </p>

        <h3 className="text-4xl font-bold mb-4">
          ₹199<span className="text-lg font-normal">/month</span>
        </h3>

        <ul className="space-y-2 text-gray-600 mb-6">
          <li>✔Chat with other people</li>
          <li>✔ 100 connections per day</li>
          <li>✔ Blue Tick</li>
        </ul>

        <button
          onClick={() => handleByClick("silver")}
          className="btn btn-outline w-full"
        >
          Choose Silver
        </button>
      </div>

      <div className="divider md:divider-horizontal">OR</div>

      <div className="card bg-yellow-200 shadow-xl p-6 rounded-2xl flex-1 border border-yellow-400">
        <h2 className="text-2xl font-bold text-yellow-800 mb-2">Gold Plan</h2>
        <p className="text-yellow-700 mb-4">
          Full premium access with all exclusive features.
        </p>

        <h3 className="text-4xl font-bold mb-4 text-white">
          ₹399<span className="text-lg font-normal">/month</span>
        </h3>

        <ul className="space-y-2 text-yellow-500 mb-6">
          <li>✔ All event access</li>
          <li>✔ Infinite connection Requests per day</li>
          <li>✔ Advanced matchmaking</li>
          <li>✔ Special premium perks</li>
        </ul>

        <button
          onClick={() => handleByClick("gold")}
          className="btn btn-warning w-full"
        >
          Choose Gold
        </button>
      </div>
    </div>
  );
};

export default Premium;
