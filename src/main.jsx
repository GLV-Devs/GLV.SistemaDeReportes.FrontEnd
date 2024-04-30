import React from 'react'
import ReactDOM from 'react-dom/client'
import '../styles.scss'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Root from './routes/Root'
import Login from './routes/Login'
import ErrorPage from './routes/ErrorPage'
import Main from './routes/MainPage'
import Products from './routes/Products'
import Projects from './routes/Projects'
import Personal from './routes/Personal'
import IdTypes from './routes/IdTypes'
import SiteStates from './routes/SiteStates'
import ProjectRoles from './routes/ProjectRoles'
import ProjectStates from './routes/ProjectStates'
import AppContextProvider from './context/AppContextProvider'
import ReportLinesCategory from './routes/ReportLineCategory'

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
          element: <Products />,
        },{
          path: '/main/ManageIdTypes',
          element: <IdTypes/>,
        },{
          path: '/main/SiteStates',
          element: <SiteStates/>,
        },{
          path: '/main/ProjectRoles',
          element: <ProjectRoles/>,
        },{
          path: '/main/ProjectStates',
          element: <ProjectStates/>,
        },{
          path: '/main/reportlinescategories',
          element: <ReportLinesCategory/>
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
