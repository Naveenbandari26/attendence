import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from './components/login';
import Classes from './components/classes';
import Attendance from './components/attendance';


const r=createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  },
  {
    path: "/classes",
    element: <Classes/>
  },
  {
    path:'/attendance/:className',
    element:<Attendance/>
  },
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={r} />
  </React.StrictMode>,
)

reportWebVitals();
