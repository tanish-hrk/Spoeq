import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import Root from './shell/Root'
import Dashboard from './screens/Dashboard'
import Products from './screens/Products'
import Orders from './screens/Orders'
import OrderDetail from './screens/OrderDetail'
import Coupons from './screens/Coupons'
import Customers from './screens/Customers'
import Reviews from './screens/Reviews'
import Access from './screens/Access'
import Inventory from './screens/Inventory'
import Categories from './screens/Categories'
import Login from './screens/Login'
import NotFound from './screens/NotFound'
import { ToastProvider } from './components/Toast'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    children: [
      { index: true, element: <Dashboard/> },
      { path: 'products', element: <Products/> },
  { path: 'inventory', element: <Inventory/> },
  { path: 'categories', element: <Categories/> },
  { path: 'orders', element: <Orders/> },
  { path: 'orders/:id', element: <OrderDetail/> },
  { path: 'coupons', element: <Coupons/> },
  { path: 'customers', element: <Customers/> },
  { path: 'reviews', element: <Reviews/> },
  { path: 'access', element: <Access/> },
  { path: '*', element: <NotFound/> },
    ]
  },
  { path: '/login', element: <Login/> }
])

const qc = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
