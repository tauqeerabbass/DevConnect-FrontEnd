import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import UserCard from "./userCard";

const ProfileEditor = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [formData, setFormData] = useState(user || {});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(null);


  useEffect(() => {
    setFormData(user || {});
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    const age = parseInt(formData.age);
    if (isNaN(age) || age <= 0) {
      newErrors.age = "Age must be a positive integer.";
    }
    if (!formData.gender) newErrors.gender = "Gender is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setErrors({});

    if (!validate()) {
      setMessage({ type: "error", text: "Please correct the errors. ❗" });
      return;
    }

    setStatus("loading");
    try {
      const { age, bio, firstName, lastName, gender } = formData;

      
      const response = await axios.patch(
        `${BASE_URL}/profile/edit`,
        { firstName, lastName, age, gender, bio },
        { withCredentials: true }
      );

      const updatedUser = response.data?.data;
      dispatch(addUser(updatedUser));
      setStatus("succeeded");
      setMessage({ type: "success", text: "Profile updated successfully! ✨" });
    } catch (err) {
      setStatus("failed");
      setMessage({
        type: "error",
        text: err.message || "An unexpected error occurred.",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4 font-sans text-white text-center">
        <p>User profile not found. Please log in to edit your profile.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4 font-sans">
      <div className="bg-gray-800 text-white rounded-xl p-8 sm:p-10 shadow-lg max-w-lg w-full transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <img
            src={user.photoUrl}
            alt="User profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-teal-500 shadow-md"
          />
          <h1 className="text-3xl font-bold text-teal-400 mt-4">
            Edit Profile
          </h1>
        </div>


        {status === "loading" && (
          <div className="p-4 rounded-lg text-sm mb-6 font-medium text-center bg-gray-700 text-gray-300">
            Updating profile...
          </div>
        )}
        {message && (
          <div
            className={`p-4 rounded-lg text-sm mb-6 font-medium text-center ${
              message.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.firstName
                    ? "border-red-500"
                    : "border-gray-600 focus:ring-teal-500"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.lastName
                    ? "border-red-500"
                    : "border-gray-600 focus:ring-teal-500"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="photoUrl"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Photo URL
            </label>
            <input
              type="text"
              id="photoUrl"
              name="photoUrl"
              value={formData.photoUrl || ""}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                errors.photoUrl
                  ? "border-red-500"
                  : "border-gray-600 focus:ring-teal-500"
              }`}
            />
            {errors.photoUrl && (
              <p className="text-red-500 text-xs mt-1">{errors.photoUrl}</p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age || ""}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.age
                    ? "border-red-500"
                    : "border-gray-600 focus:ring-teal-500"
                }`}
              />
              {errors.age && (
                <p className="text-red-500 text-xs mt-1">{errors.age}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 ${
                  errors.gender
                    ? "border-red-500"
                    : "border-gray-600 focus:ring-teal-500"
                }`}
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              About
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            className="w-full p-4 bg-teal-500 hover:bg-teal-600 text-gray-900 font-bold rounded-lg transition-colors duration-200 transform hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
      <UserCard user={user} showActions={false} />
    </div>
  );
};

export default ProfileEditor;
