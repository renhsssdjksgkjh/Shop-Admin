import { createWebHashHistory, createRouter } from 'vue-router'
import login from '~/pages/login.vue'
import index from '~/pages/index.vue'
import admin from '~/layout/admin.vue'
import NotFound from '~/pages/404.vue'
import GoodList from '~/pages/goods/list.vue'
import CategoryList from '~/pages/category/list.vue'
import UserList from '~/pages/user/list.vue'
import OrderList from '~/pages/order/list.vue'
import SettingList from '~/pages/setting/base.vue'
import NoticeList from '~/pages/notice/list.vue'
import ImageList from '~/pages/image/list.vue'
import CouponList from '~/pages/coupon/list.vue'
import CommentList from '~/pages/comment/list.vue'
import ManagerList from '~/pages/manager/list.vue'
import AccessList from '~/pages/access/list.vue'
import RoleList from '~/pages/Role/list.vue'
import SkusList from '~/pages/skus/list.vue'
import LevelList from '~/pages/level/list.vue'
import SettingBuy from '~/pages/setting/buy.vue'
import SettingShip from '~/pages/setting/ship.vue'
import DistributionIndex from '~/pages/distribution/index.vue'
import DistributionSetting from '~/pages/distribution/setting.vue'


//默认路由，所有用户共享
const routes = [
    {
        path: "/",
        name: "admin",
        component: admin

    },
    {
        path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: {
            title: "404"
        }
    },
    {
        path: "/login", component: login, meta: {
            title: "登陆页"
        }
    }
]

//动态路由，用于匹配菜单动态添加路由
const asyncRoutes = [
    {
        path: '/', name: '/', component: index, meta: {
            title: "后台首页"
        }
    },
    {
        path: '/goods/list', name: '/goods/list', component: GoodList, meta: {
            title: "商品管理"
        }
    },
    {
        path: '/category/list', name: '/category/list', component: CategoryList, meta: {
            title: "分类列表"
        }
    },
    {
        path: '/user/list', name: '/user/list', component: UserList, meta: {
            title: "用户"
        }
    },
    {
        path: '/order/list', name: '/order/list', component: OrderList, meta: {
            title: "订单"
        }
    },
    {
        path: '/comment/list', name: '/comment/list', component: CommentList, meta: {
            title: "评论"
        }
    },
    {
        path: '/setting/base', name: '/setting/base', component: SettingList, meta: {
            title: "基础配置"
        }
    },
    {
        path: '/notice/list', name: '/notice/list', component: NoticeList, meta: {
            title: "公告"
        }
    },
    {
        path: '/coupon/list', name: '/coupon/list', component: CouponList, meta: {
            title: "优惠券"
        }
    },
    {
        path: '/image/list', name: '/image/list', component: ImageList, meta: {
            title: "图库"
        }
    },
    {
        path: '/manager/list', name: '/manager/list', component: ManagerList, meta: {
            title: "管理员"
        }
    },
    {
        path: '/access/list', name: '/access/list', component: AccessList, meta: {
            title: "菜单权限管理"
        }
    },
    {
        path: '/role/list', name: '/role/list', component: RoleList, meta: {
            title: "角色管理"
        }
    },
    {
        path: '/skus/list', name: '/skus/list', component: SkusList, meta: {
            title: "规格管理"
        }
    },
    {
        path: '/level/list', name: '/level/list', component: LevelList, meta: {
            title: "会员等级"
        }
    },
    {
        path: '/setting/buy', name: '/setting/buy', component: SettingBuy, meta: {
            title: "交易设置"
        }
    },
    {
        path: '/setting/ship', name: '/setting/ship', component: SettingShip, meta: {
            title: "物流设置"
        }
    },
    {
        path: '/distribution/index', name: '/distribution/index', component: DistributionIndex, meta: {
            title: "分销员管理"
        }
    },
    {
        path: '/distribution/setting', name: '/distribution/setting', component: DistributionSetting, meta: {
            title: "分销设置"
        }
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export function addRoutes(menus) {
    let hasNewRoutes = false
    const findAndAddRoutesByMenus = (arr) => {
        arr.forEach(e => {
            let item = asyncRoutes.find(o => o.path == e.frontpath)
            if (item && !router.hasRoute(item.path)) {
                router.addRoute('admin', item)
                hasNewRoutes = true
            }
            if (e.child && e.child.length > 0) {
                findAndAddRoutesByMenus(e.child)
            }
        })
    }
    findAndAddRoutesByMenus(menus)
    // console.log(router.getRoutes())
    return hasNewRoutes
}
