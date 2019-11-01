import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api_url: 'http://localhost:3000/',
    isAuthenticated: false
  },
  mutations: {
    // Checks on page load if user is logged in
    isAuthenticated (state) {
      if (localStorage.getItem('jwt') != null) {
        state.isAuthenticated = true
      } else {
        state.isAuthenticated = false
      }
    },
    // Complements the function login in Login.vue
    login (state, token) {
      state.isAuthenticated = true
      localStorage.setItem('jwt', token)
      router.push('/')
    },
    // Function logout in all pages (if logged in)
    logout (state) {
      state.isAuthenticated = false
      localStorage.removeItem('jwt')
      router.push('/login')
    }
  },
  actions: {
  },
  modules: {
  }
})
