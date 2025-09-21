import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest } from "../utils/request";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { FaUserCircle } from 'react-icons/fa';

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.requests);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState({});

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/user/requests/received`, { withCredentials: true });
      dispatch(addRequest(response.data.data));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!requests) {
      fetchRequests();
    }
  }, [requests]);

  const handleAccept = async (requestId) => {
    setActionStatus(prev => ({ ...prev, [requestId]: 'loading' }));
    try {
      await axios.post(`${BASE_URL}/request/review/accepted/${requestId}`, {}, { withCredentials: true });
      
      const updatedRequests = requests.filter(req => req._id !== requestId);
      dispatch(addRequest(updatedRequests));
      setActionStatus(prev => ({ ...prev, [requestId]: 'succeeded' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept request.');
      setActionStatus(prev => ({ ...prev, [requestId]: 'failed' }));
    }
  };

  
  const handleReject = async (requestId) => {
    setActionStatus(prev => ({ ...prev, [requestId]: 'loading' }));
    try {
      await axios.post(`${BASE_URL}/request/review/rejected/${requestId}`, {}, { withCredentials: true });
      
      const updatedRequests = requests.filter(req => req._id !== requestId);
      dispatch(addRequest(updatedRequests));
      setActionStatus(prev => ({ ...prev, [requestId]: 'succeeded' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject request.');
      setActionStatus(prev => ({ ...prev, [requestId]: 'failed' }));
    }
  };

  let content;

  if (loading) {
    content = <div className="text-center text-teal-400 font-medium text-lg">Loading requests...</div>;
  } else if (error) {
    content = <div className="text-center text-red-500 font-medium text-lg">{error}</div>;
  } else if (requests && requests.length > 0) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map(request => (
          <div key={request._id} className="bg-gray-800 text-white rounded-xl p-6 shadow-md">
            <div className="flex flex-col items-center text-center">
              {request.fromUserId.photoUrl ? (
                <img
                  src={request.fromUserId.photoUrl}
                  alt={`${request.fromUserId.firstName}'s profile`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-teal-500"
                />
              ) : (
                <FaUserCircle className="w-24 h-24 rounded-full object-cover border-4 border-teal-500" />
              )}
              <h3 className="mt-4 text-xl font-bold text-teal-400">
                {request.fromUserId.firstName} {request.fromUserId.lastName}
              </h3>
              {request.fromUserId.bio && (
                <p className="text-gray-400 text-sm mt-1">{request.fromUserId.bio}</p>
              )}
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => handleAccept(request._id)}
                className="p-2 px-4 bg-teal-500 hover:bg-teal-600 text-gray-900 font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={actionStatus[request._id] === 'loading'}
              >
                {actionStatus[request._id] === 'loading' ? 'Accepting...' : 'Accept'}
              </button>
              <button
                onClick={() => handleReject(request._id)}
                className="p-2 px-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={actionStatus[request._id] === 'loading'}
              >
                {actionStatus[request._id] === 'loading' ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    content = <div className="text-center text-gray-400 text-lg">No new connection requests.</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-8 font-sans">
      <h2 className="text-4xl font-extrabold text-white mb-8">
        Connection Requests
      </h2>
      <div className="w-full max-w-6xl">{content}</div>
    </div>
  );
};

export default Requests;