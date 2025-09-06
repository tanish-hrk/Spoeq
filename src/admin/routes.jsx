import { Route } from 'react-router-dom';
import AdminShell from './AdminShell';
import Dashboard from './screens/Dashboard';
import Products from './screens/Products';
import Categories from './screens/Categories';
import Inventory from './screens/Inventory';
import Orders from './screens/Orders';
import Coupons from './screens/Coupons';
import Promotions from './screens/Promotions';
import Reviews from './screens/Reviews';
import Customers from './screens/Customers';
import Content from './screens/Content';
import Analytics from './screens/Analytics';
import Settings from './screens/Settings';
import Access from './screens/Access';

export function adminRoutes(){
  return (
    <Route path="/admin" element={<AdminShell />}> 
      <Route index element={<Dashboard />} />
      <Route path="products" element={<Products />} />
      <Route path="categories" element={<Categories />} />
      <Route path="inventory" element={<Inventory />} />
      <Route path="orders" element={<Orders />} />
      <Route path="coupons" element={<Coupons />} />
      <Route path="promotions" element={<Promotions />} />
      <Route path="reviews" element={<Reviews />} />
      <Route path="customers" element={<Customers />} />
      <Route path="content" element={<Content />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="settings" element={<Settings />} />
      <Route path="access" element={<Access />} />
    </Route>
  );
}
