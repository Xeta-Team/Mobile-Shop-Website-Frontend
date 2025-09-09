import React from 'react';

export default function UserDashboard() {
    // You can fetch user data from local storage if needed
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center">
                <h1 className="text-4xl font-bold text-gray-800">👋 Welcome, {user?.firstName || 'User'}!</h1>
                <p className="text-gray-600 mt-4 text-lg">This is your User Dashboard.</p>
            </div>
        </div>
    );
}