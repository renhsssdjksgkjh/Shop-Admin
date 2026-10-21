import { router, addRoutes } from '~/router'
import { getToken } from '~/composables/auth.js'
import { toast, showFullLoading, hideFullLoading } from '~/composables/utils.js'
import store from './store'
let hasGetInfo = false
router.beforeEach(async (to, from, next) => {
    document.title = (to.meta.title ? to.meta.title : '') + "--商城后台管理"
    showFullLoading()
    const token = getToken()
    if (!token && to.path != "/login") {
        toast('请先登录!', 'error')
        return next({ path: "/login" })
    }
    if (token && to.path == '/login') {
        return next({ path: from.path ? from.path : '/' })
    }

    let hasNewRoutes = false
    if (token && !hasGetInfo) {
        let { menus } = await store.dispatch('getinfo')
        hasGetInfo = true
        hasNewRoutes = addRoutes(menus)
    }
    hasNewRoutes ? next(to.fullPath) : next()
})
router.afterEach((to, from) => {
    hideFullLoading()
})
