import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { resolveUserPerms, PERMS } from './permissions';

const nav = [
  { label: 'Dashboard', to: '/admin', perm: null },
  { label: 'Products', to: '/admin/products', perm: PERMS.products_read },
  { label: 'Categories', to: '/admin/categories', perm: PERMS.categories_manage },
  { label: 'Inventory', to: '/admin/inventory', perm: PERMS.inventory_manage },
  { label: 'Orders', to: '/admin/orders', perm: PERMS.orders_read },
  { label: 'Coupons', to: '/admin/coupons', perm: PERMS.coupons_manage },
  { label: 'Promotions', to: '/admin/promotions', perm: PERMS.promotions_manage },
  { label: 'Reviews', to: '/admin/reviews', perm: PERMS.reviews_moderate },
  { label: 'Customers', to: '/admin/customers', perm: PERMS.customers_read },
  { label: 'Content', to: '/admin/content', perm: PERMS.content_manage },
  { label: 'Analytics', to: '/admin/analytics', perm: PERMS.analytics_view },
  { label: 'Settings', to: '/admin/settings', perm: PERMS.settings_manage },
  { label: 'Access Control', to: '/admin/access', perm: PERMS.roles_manage }
];

export default function AdminShell(){
  const user = useAuthStore(s=> s.user);
  const perms = resolveUserPerms(user);
  const loc = useLocation();
  return (
    <div className="min-h-[70vh] max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
      <aside className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3">
        <div className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Admin</div>
        <nav className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar">
          {nav.filter(i=> !i.perm || perms.has(i.perm)).map(i=> (
            <Link key={i.to} to={i.to}
              className={"px-3 py-2 rounded-lg text-sm whitespace-nowrap "+(loc.pathname===i.to? 'bg-eco-fern/60 text-neutral-900 dark:text-white':'hover:bg-neutral-100 dark:hover:bg-neutral-800')}>{i.label}</Link>
          ))}
        </nav>
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  );
}
