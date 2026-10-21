# Shop Admin 商城后台管理系统

基于 **Vue 3 + Vite + Element Plus** 开发的电商后台管理系统，涵盖商品、订单、用户、营销、分销、系统设置与权限管理等常见后台模块。项目结构清晰，适合作为 Vue 3 全家桶的实战学习参考。

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 核心框架 | Vue 3（`<script setup>` 组合式 API） |
| 构建工具 | Vite 7 |
| UI 组件库 | Element Plus 2 |
| 状态管理 | Vuex 4 |
| 路由 | Vue Router 4（Hash 模式） |
| 样式方案 | WindiCSS（原子化 CSS） |
| 网络请求 | Axios |
| 数据可视化 | ECharts |
| 富文本编辑器 | TinyMCE 6 |
| 其他 | NProgress（顶部加载条）、GSAP（动画）、@vueuse/core |

## 功能模块

- **后台首页**：数据统计卡片、ECharts 图表
- **商品管理**：商品列表与编辑、轮播图、SKU 规格管理
- **分类管理**：商品分类的增删改查
- **订单管理**：订单列表、订单详情、发货、导出 Excel
- **用户管理**：用户列表、会员等级
- **营销管理**：优惠券、公告、商品评论
- **图库管理**：图片分类、图片上传与选择
- **分销管理**：分销员管理、分销设置
- **系统设置**：基础配置、交易设置、物流设置
- **权限管理**：管理员、角色、菜单权限
- **登录鉴权**：登录、Token 校验、动态菜单与动态路由

## 快速开始

### 环境要求

- Node.js **20.19+** 或 **22.12+**（Vite 7 的最低要求）
- npm 10+（或 pnpm / yarn）

### 安装与启动

```bash
# 克隆仓库
git clone https://github.com/renhsssdjksgkjh/Shop-Admin.git
cd Shop-Admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

默认访问地址：`http://localhost:5173/`

### 打包构建

```bash
npm run build     # 产物输出到 dist/
npm run preview   # 本地预览构建结果
```

## 接口说明

开发环境通过 Vite 代理访问后端接口，配置见 [vite.config.js](vite.config.js)：

```js
server: {
  proxy: {
    '/api': {
      target: 'http://ceshi13.dishait.cn',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

- 前端所有请求统一使用 `/api` 前缀（见 [src/axios.js](src/axios.js)），由代理转发到目标服务器。
- 默认指向第三方课程测试接口，数据可能被重置或服务不可用，**仅用于学习演示**。
- 如需接入自己的后端，修改上面的 `target` 即可；生产环境需由 Nginx 等服务器自行转发 `/api`，Vite 代理仅在开发时生效。

> 登录账号由后端提供，请使用对应测试环境给定的演示账号。

## 目录结构

```text
shop-admin/
├── public/                  # 静态资源（含 TinyMCE 皮肤与中文语言包）
├── src/
│   ├── api/                 # 按业务模块拆分的接口定义
│   ├── components/          # 通用组件（列表头、图片/商品/SKU 选择器等）
│   ├── composables/         # 组合式函数（Token、SKU 逻辑、标签页等）
│   ├── directive/           # v-permission 权限指令
│   ├── layout/              # 后台整体布局（侧边栏、顶栏、标签页）
│   ├── pages/               # 各业务页面
│   ├── router/              # 路由表与动态路由注入
│   ├── store/               # Vuex：用户信息、菜单、权限规则
│   ├── axios.js             # Axios 实例与请求/响应拦截器
│   ├── permission.js        # 全局路由守卫
│   ├── App.vue
│   └── main.js              # 应用入口
├── index.html
├── vite.config.js           # 路径别名 ~、接口代理
└── package.json
```

## 实现要点

- **登录鉴权**：登录成功后 Token 存入 Cookie（键名 `admin-token`），Axios 请求拦截器自动在请求头携带 `token`；响应拦截器检测到“非法 token”时自动退出登录。
- **动态路由**：登录后拉取后端返回的 `menus`，再通过 `addRoutes` 将匹配的路由挂载到后台布局下，实现“菜单即权限”。
- **路由守卫**：未登录访问后台页面自动跳转登录页；已登录访问登录页会跳回上一页；页面切换时配合 NProgress 显示加载条。
- **按钮级权限**：通过自定义指令 `v-permission` 按后端返回的规则控制操作按钮的显示。
- **统一请求层**：接口按模块拆分在 `src/api/`，统一使用 `~/axios.js` 实例，响应直接返回业务 `data`，Blob 类型用于文件下载。

## 说明

本项目为课程实战练习项目，主要用于学习 Vue 3 全家桶与后台管理系统开发，未附带开源协议，欢迎交流指正。
