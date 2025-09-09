import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';

export default function UserDashboard() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Get the token from the URL
        const token = searchParams.get('token');

        if (token) {
            // 2. Save the token to local storage for future use
            console.log("Token received, saving to localStorage.");
            localStorage.setItem('authToken', token);
           // 3. (Optional but recommended) Remove the token from the URL
            // This navigates to the same page but without the query parameters.
            navigate('/user', { replace: true });
        }
    }, [searchParams, navigate]);

    // Check if the user is authenticated (e.g., by checking for the token)
    const storedToken = localStorage.getItem('authToken');
    if (!storedToken) {
        // You can redirect to login if no token is found after the check
        navigate('/login');
        return null; // Return null while redirecting
    }

    // --- Your Regular Dashboard Content Goes Here ---
    return (
        <div>
            <h1>Welcome to Your Dashboard!</h1>
            <p>You have successfully logged in. Your token is now stored securely.</p>
        </div>
    );
}