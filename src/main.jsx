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
import AddPersonal from './routes/AddPersonal'
import EditPersonal from './routes/EditPersonal'
import ListPersonal from './routes/ListPersonal'
import AddProject from './routes/AddProject'
import EditProject from './routes/EditProject'
import ListProject from './routes/ListProject'
import AddMaterial from './routes/AddMaterial'
import EditMaterial from './routes/EditMaterial'
import ListMaterial from './routes/ListMaterial'

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
          children: [{
            path: '/main/personas/agregar',
            element: <AddPersonal/>
          },{
            path: '/main/personas/editar',
            element: <EditPersonal />
          },{
            path: '/main/personas/lista',
            element: <ListPersonal />
          }]
        },{
          path: '/main/proyectos',
          element: <Projects />,
          children: [{
            path: '/main/proyectos/agregar',
            element: <AddProject />,
          },{
            path: '/main/proyectos/editar',
            element: <EditProject />,
          },{
            path: '/main/proyectos/lista',
            element: <ListProject />,
          }]
        },{
          path: '/main/productos',
          element: <Materials />,
          children: [{
            path: '/main/productos/agregar',
            element: <AddMaterial />,
          },{
            path: '/main/productos/editar',
            element: <EditMaterial />,
          },{
            path: '/main/productos/lista',
            element: <ListMaterial />,
          }]
        }]
      }
    ],
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
