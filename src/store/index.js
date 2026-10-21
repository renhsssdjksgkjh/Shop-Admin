import { createStore } from 'vuex'
import { getinfo, login } from "~/api/manager.js"
import { setToken } from '~/composables/auth.js'
import { removeToken } from '~/composables/auth.js'

const store = createStore({
    state() {
        return {
            user: {},
            asideWidth: "250px",
            menus: [],
            ruleNames: []
        }
    },
    mutations: {
        SET_USEINFO(state, user) {
            state.user = user
        },
        handleAsideWidth(state) {
            state.asideWidth = state.asideWidth == '250px' ? '64px' : '250px'       
        },
        SET_MENUS(state, menus) {
            state.menus = menus
        },
        SET_RULENAMES(state, ruleNames) {
            state.ruleNames = ruleNames
        }
    },
    actions: {
        login({ commit }, { username, password }) {
            return new Promise((resolve, reject) => {
                login(username, password).then(res => {
                    setToken(res.token)
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        getinfo({ commit }) {
            return new Promise((resolve, reject) => {
                getinfo().then(res => {
                    commit('SET_USEINFO', res)
                    commit('SET_MENUS', res.menus)
                    commit('SET_RULENAMES', res.ruleNames)
                    resolve(res)
                }).catch(err => reject(err))
            })
        },
        logout({ commit }) {
            removeToken()
            commit('SET_USEINFO', {})
        }
    }
})
export default store