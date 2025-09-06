// Simple front-end permission mapping. Backend should enforce these too.
export const PERMS = {
  products_read: 'products:read',
  products_write: 'products:write',
  categories_manage: 'categories:manage',
  inventory_manage: 'inventory:manage',
  orders_read: 'orders:read',
  orders_manage: 'orders:manage',
  refunds_manage: 'refunds:manage',
  coupons_manage: 'coupons:manage',
  promotions_manage: 'promotions:manage',
  reviews_moderate: 'reviews:moderate',
  customers_read: 'customers:read',
  users_manage: 'users:manage',
  roles_manage: 'roles:manage',
  content_manage: 'content:manage',
  settings_manage: 'settings:manage',
  analytics_view: 'analytics:view'
};

// Default role → perms. Owner is the master admin.
export const ROLE_PERMS = {
  owner: Object.values(PERMS),
  admin: Object.values(PERMS).filter(p => p !== PERMS.roles_manage),
  manager: [
    PERMS.products_read, PERMS.products_write, PERMS.categories_manage, PERMS.inventory_manage,
    PERMS.orders_read, PERMS.orders_manage, PERMS.refunds_manage,
    PERMS.coupons_manage, PERMS.promotions_manage,
    PERMS.reviews_moderate, PERMS.analytics_view
  ],
  support: [PERMS.orders_read, PERMS.refunds_manage, PERMS.customers_read, PERMS.reviews_moderate],
  editor: [PERMS.content_manage, PERMS.categories_manage, PERMS.promotions_manage],
  analyst: [PERMS.analytics_view]
};

export function resolveUserPerms(user){
  if(!user) return new Set();
  const fromToken = user.perms || [];
  const fromRoles = (user.roles||[]).flatMap(r => ROLE_PERMS[r] || []);
  return new Set([ ...fromRoles, ...fromToken ]);
}

export function hasPerm(user, perm){
  return resolveUserPerms(user).has(perm);
}
