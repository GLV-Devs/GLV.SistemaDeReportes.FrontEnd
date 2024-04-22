import React from 'react'
import ReactDOM from 'react-dom/client'
import '../styles.scss'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Root from './routes/Root'
import Login from './routes/Login'
import ErrorPage from './routes/ErrorPage'
import Main from './routes/MainPage'
import Materials from './routes/Materials'
import Projects from './routes/Projects'
import Personal from './routes/Personal'
import AppContextProvider from './context/AppContextProvider'

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
        children: [{
          path: '/main/personas',
          element: <Personal />,
        },{
          path: '/main/proyectos',
          element: <Projects />,
        },{
          path: '/main/productos',
          element: <Materials />,
        }]
      }
    ],
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppContextProvider>
    <RouterProvider router={router}/>
  </AppContextProvider>
  
)
