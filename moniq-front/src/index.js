import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import './index.css';
import Dashboard from './Dashboard';
import Users from './Users';


// Define the router with paths and corresponding elements
const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,  // Main homepage
  },
  {
    path: "/Users",
    element: <Users />,  // This component will render for /products
  },
  
]);


// Render the app with the RouterProvider to enable routing
ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
