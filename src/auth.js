import { jwtDecode } from 'jwt-decode';

export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  
 
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// You can keep your existing isAdmin function
export const isAdmin = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.role === 'admin';
  } catch (error) {
    return false;
  }
};