<template>
    <header class="header">
        <router-link style="text-decoration: none;" to="/"><h3 class="title">Camagru</h3></router-link>
        <button class="config-btn" @click="goto('/config')" v-if="isVerified">
            <i class="material-icons">settings</i>
        </button>
        <button v-if="this.isLogged" class="logout-btn" @click="$store.commit('logout')">
            <i class="material-icons">logout</i>
        </button>
        <button v-if="!this.isLogged" class="login-btn" @click="goto('/login')">
            <i class="material-icons">account_circle</i>
        </button>
    </header>
</template>

<script>
export default {
  data () {
    return {
      isVerified: false,
      isLogged: false
    }
  },
  methods: {
    goto (path) {
      this.$router.push(path).catch((e) => e)
    }
  },
  beforeMount () {
    if (localStorage.getItem('jwt')) {
      this.isVerified = this.$store.state.user.verified
      this.isLogged = true
    }
  }
}
</script>
