import React from 'react';

const UserCard = ({ user, onAccept, onIgnore, showActions = true }) => {
<<<<<<< HEAD
    const { firstName, lastName, bio, age, gender, photoUrl } = user;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 font-sans p-4">
            <div className="bg-gray-800 text-white rounded-xl p-6 sm:p-8 shadow-lg max-w-sm w-full transform transition-all duration-300 hover:shadow-2xl">
                {/* 🚀 CRITICAL FIX: Added flex and justify-center to center the image */}
                <figure className="mb-4 flex justify-center"> 
                    <img
                        // 🚀 CRITICAL FIX: Changed classes for a circular image: 
                        // w-40 for equal width, rounded-full for the circle, and a border for style.
                        className="h-40 w-40 object-cover rounded-full border-4 border-teal-500" 
                        src={photoUrl}
                        alt={`${firstName}'s profile photo`}
                    />
                </figure>
                <div className="card-body px-2 sm:px-4 text-center">
                    <h2 className="text-2xl font-bold text-teal-400 mb-2">
                        {firstName} {lastName}
                    </h2>
                    {age && gender && (
                        <p className="text-gray-400 text-sm mb-2">
                            {age} years old • {gender}
                        </p>
                    )}
                    <p className="text-gray-300 text-base mb-4">{bio}</p>
                    {showActions && (
                        <div className="flex justify-center space-x-4">
                            <button
                                className="bg-gray-700 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                                onClick={onIgnore}
                            >
                                Ignore
                            </button>
                            <button
                                className="bg-teal-500 hover:bg-teal-600 text-gray-900 font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                                onClick={onAccept}
                            >
                                Interested
                            </button>
                        </div>
                    )}
                </div>
            </div>
=======
  const { firstName, lastName, bio, age, gender, photoUrl } = user;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 font-sans p-4">
      <div className="bg-gray-800 text-white rounded-xl p-6 sm:p-8 shadow-lg max-w-sm w-full transform transition-all duration-300 hover:shadow-2xl">
        <figure className="mb-4">
          <img
            className="h-40 w-full object-cover rounded-t-xl"
            src={photoUrl}
            alt={`${firstName}'s profile photo`}
          />
        </figure>
        <div className="card-body px-2 sm:px-4 text-center">
          <h2 className="text-2xl font-bold text-teal-400 mb-2">
            {firstName} {lastName}
          </h2>
          {age && gender && (
            <p className="text-gray-400 text-sm mb-2">
              {age} years old • {gender}
            </p>
          )}
          <p className="text-gray-300 text-base mb-4">{bio}</p>
          {showActions && (
            <div className="flex justify-center space-x-4">
              <button
                className="bg-gray-700 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                onClick={onIgnore}
              >
                Ignore
              </button>
              <button
                className="bg-teal-500 hover:bg-teal-600 text-gray-900 font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                onClick={onAccept}
              >
                Interested
              </button>
            </div>
          )}
>>>>>>> 442589e19eabbe294172619f67a9b00e739852d8
        </div>
    );
};

export default UserCard;