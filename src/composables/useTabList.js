
import { ref } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import { router } from '~/router/index.js'

export function useTabList() {
    const cookie = useCookies()
    const route = useRoute()
    const activeTab = ref(route.path)
    const tabList = ref([
        {
            title: '后台首页',
            path: '/'
        }
    ])

    const handleClose = (c) => {
        if (c == 'clearOther') {
            tabList.value = tabList.value.filter(item => item.path == '/' || item.path == activeTab.value)
        } else if (c == 'clearAll') {
            activeTab.value = '/'
            tabList.value = [{
                title: '后台首页',
                path: '/'
            }]
        }
        cookie.set('tabList', tabList.value)
    }

    const addtabList = (tab) => {
        const noTab = tabList.value.findIndex((item) => item.path == tab.path) == -1
        if (noTab) {
            tabList.value.push(tab)
        }
        cookie.set('tabList', tabList.value)
    }

    function initTabList() {
        let tbs = cookie.get('tabList')
        if (tbs) {
            tabList.value = tbs
        }
    }
    initTabList()

    onBeforeRouteUpdate((to, from) => {
        activeTab.value = to.path
        addtabList({
            title: to.meta.title,
            path: to.path
        })
    })
    const changeTab = (t) => {
        activeTab.value = t
        router.push(t)
    }
    const removeTab = (t) => {
        let a = activeTab.value
        let tabs = tabList.value
        if (a == t) {
            tabs.forEach((item, index) => {
                if (item.path == t) {
                    const nextTab = tabs[index + 1] || tabs[index - 1]
                    if (nextTab) {
                        a = nextTab.path
                    }
                }
            })
        }
        changeTab(a)
        tabList.value = tabList.value.filter(item => item.path != t)
        cookie.set('tabList', tabList.value)
    }
    return {
        activeTab,
        tabList,
        changeTab,
        removeTab,
        handleClose
    }
}