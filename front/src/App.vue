<template>
  <div id="app" v-if="!fetching">
    <Header />
    <router-view/>
    <Footer v-if="isAuthenticated"/>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      fetching: true
    }
  },
  components: {
    Header,
    Footer
  },
  computed: {
    ...mapState(['isAuthenticated'])
    // isAuthenticated () {
    //   return this.$store.state.isAuthenticated
    // }
  },
  mounted () {
    if (this.isAuthenticated) {
      this.$http.post(this.$store.state.api_url + 'user/getdata', { auth_token: this.$store.state.auth_token })
        .then(response => {
          this.$store.commit('setUser', response.data.details)
        })
        .catch(() => {
          this.$store.commit('logout')
        })
        .finally(() => {
          this.fetching = false
        })
    } else {
      this.fetching = false
    }
  }
}
</script>

<style lang="scss">
  @import './assets/scss/main.scss';
</style>
