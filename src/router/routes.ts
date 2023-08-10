// 常量路由
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      show: false,
      icon: 'Plus',
    },
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    meta: {
      title: '',
      show: false,
      icon: '',
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          show: true,
          icon: 'House',
        },
      },
    ],
  },
  {
    path: '/screen',
    name: 'Screen',
    component: () => import('@/views/screen/index.vue'),
    meta: {
      title: '数据大屏',
      show: true,
      icon: 'Monitor',
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404',
      show: false,
    },
  },
]

// 异步路由
export const asyncRoute = [
  {
    path: '/acl',
    name: 'Acl',
    component: () => import('@/layout/index.vue'),
    redirect: '/acl/user',
    meta: {
      title: '权限管理',
      show: true,
      icon: 'Lock',
    },
    children: [
      {
        path: '/acl/user',
        name: 'User',
        component: () => import('@/views/acl/user/index.vue'),
        meta: {
          title: '用户管理',
          show: true,
          icon: 'User',
        },
      },
      {
        path: '/acl/role',
        name: 'Role',
        component: () => import('@/views/acl/role/index.vue'),
        meta: {
          title: '角色管理',
          show: true,
          icon: 'UserFilled',
        },
      },
      {
        path: '/acl/permission',
        name: 'Permission',
        component: () => import('@/views/acl/permission/index.vue'),
        meta: {
          title: '菜单管理',
          show: true,
          icon: 'SwitchFilled',
        },
      },
    ],
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '商品管理',
      show: true,
      icon: 'Goods',
    },
    children: [
      {
        path: '/product/trademark',
        name: 'Trademark',
        component: () => import('@/views/product/trademark/index.vue'),
        meta: {
          title: '品牌管理',
          show: true,
          icon: 'ShoppingCart',
        },
      },
      {
        path: '/product/attr',
        name: 'Attr',
        component: () => import('@/views/product/attr/index.vue'),
        meta: {
          title: '属性管理',
          show: true,
          icon: 'ShoppingBag',
        },
      },
      {
        path: '/product/spu',
        name: 'Spu',
        component: () => import('@/views/product/spu/index.vue'),
        meta: {
          title: 'SPU管理',
          show: true,
          icon: 'Handbag',
        },
      },
      {
        path: '/product/sku',
        name: 'Sku',
        component: () => import('@/views/product/sku/index.vue'),
        meta: {
          title: 'SKU管理',
          show: true,
          icon: 'GoodsFilled',
        },
      },
    ],
  },
]

// 任意路由
export const anyRoute = [
  {
    path: '/:pathMatch(.*)*',
    name: 'Any',
    redirect: '/404',
    meta: {
      title: '任意路由',
      show: false,
    },
  },
]
