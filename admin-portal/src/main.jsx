import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import Root from './shell/Root'
import Dashboard from './screens/Dashboard'
import Products from './screens/Products'
import Orders from './screens/Orders'
import Login from './screens/Login'
import NotFound from './screens/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    children: [
      { index: true, element: <Dashboard/> },
      { path: 'products', element: <Products/> },
  { path: 'orders', element: <Orders/> },
  { path: '*', element: <NotFound/> },
    ]
  },
  { path: '/login', element: <Login/> }
])

const qc = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
