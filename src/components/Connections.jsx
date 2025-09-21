import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((state) => state.connections);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchConnections = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      dispatch(addConnection(response.data.data));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch connections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!connections) {
      fetchConnections();
    }
  }, [connections]);

  let content;

  if (loading) {
    content = (
      <div className="text-center text-teal-400 font-medium text-lg">
        Loading connections...
      </div>
    );
  } else if (error) {
    content = (
      <div className="text-center text-red-500 font-medium text-lg">
        {error}
      </div>
    );
  } else if (connections && connections.length > 0) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((connection) => (
          <div
            key={connection.id}
            className="bg-gray-800 text-white rounded-xl p-6 shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            <div className="flex flex-col items-center">
              <img
                src={connection.photoUrl}
                alt={`${connection.name}'s profile`}
                className="w-24 h-24 rounded-full object-cover border-4 border-teal-500"
              />
              <h3 className="mt-4 text-xl font-bold text-teal-400">
                {connection.firstName} {connection.lastName}
              </h3>
              <p className="text-gray-400 text-sm mt-1">{connection.bio}</p>
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    content = (
      <div className="text-center text-gray-400 text-lg">
        You don't have any connections yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-8 font-sans">
      <h2 className="text-4xl font-extrabold text-white mb-8">
        Your Connections
      </h2>
      <div className="w-full max-w-6xl">{content}</div>
    </div>
  );
};

export default Connections;