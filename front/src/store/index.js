import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api_url: 'http://localhost:3000/',
    isAuthenticated: localStorage.getItem('jwt') != null,
    feed: [],
    auth_token: localStorage.getItem('jwt'),
    user: JSON.parse(localStorage.getItem('user') || null)
  },
  mutations: {
    // Checks on page load if user is logged in
    // isAuthenticated (state) {
    //   if (localStorage.getItem('jwt') != null) {
    //     state.isAuthenticated = true
    //   } else {
    //     state.isAuthenticated = false
    //   }
    // },
    // Complements the function login in Login.vue
    login (state, data) {
      state.isAuthenticated = true
      state.user = data.user
      localStorage.setItem('jwt', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/')
    },
    // Function logout in all pages (if logged in)
    logout (state) {
      state.isAuthenticated = false
      state.user = null
      localStorage.removeItem('jwt')
      localStorage.removeItem('user')
      router.push('/login')
    },
    getFeed (state, feed) {
      feed = feed.sort(function (a, b) {
        return b.timestamp - a.timestamp
      })
      state.feed = feed
    },
    setUser (state, data) {
      state.user = data
      if (data) {
        localStorage.setItem('user', JSON.stringify(data))
      } else {
        localStorage.removeItem('user')
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
