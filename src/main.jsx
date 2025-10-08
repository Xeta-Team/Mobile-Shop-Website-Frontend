import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from './Actions/CartContext.jsx';
import { RecentReviewedProvider } from './Actions/RecentReviewedContext.jsx';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={clientId}>
        <CartProvider>
          <RecentReviewedProvider>
            <App/>
          </RecentReviewedProvider>
        </CartProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
