import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './style.css'
import {router} from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store'
import './permission.js'
import 'nprogress/nprogress.css'
import permission from '~/directive/permission.js'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(store)
app.use(ElementPlus)
app.mount('#app')

app.use(permission)
import 'virtual:windi.css'
