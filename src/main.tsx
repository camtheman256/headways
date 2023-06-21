import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.tsx'
import './index.css'
import NearMe from './app/NearMe.tsx';
import About from './app/About.tsx';

const router = createBrowserRouter([{
  path: "/",
  element: <App />,
  children: [{
    path: '/',
    element: <NearMe />,
    id: 'Home'
  }, {
    path: '/about',
    element: <About />
  }],
}])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
