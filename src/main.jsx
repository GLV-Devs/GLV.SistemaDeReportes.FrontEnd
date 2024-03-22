import React from 'react'
import ReactDOM from 'react-dom/client'
import '../styles.scss'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Root from './routes/Root'
import Login from './routes/Login'
import ErrorPage from './routes/ErrorPage'
import Main from './routes/MainPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/main',
        element: <Main />,
        // children: [{
        //   path: '/main/',
        //   element: < />
        // },{
        //   path: '/main/',
        //   element: < />
        // },{
        //   path: '/main/',
        //   element: < />
        // }]
      }
    ],
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
