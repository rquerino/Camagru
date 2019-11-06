<template>
    <header class="header">
        <h3 class="title">Camagru</h3>
        <button class="config-btn" @click="goto('/config')" v-if="isVerified">
            <i class="material-icons">settings</i>
        </button>
        <button class="logout-btn" @click="$store.commit('logout')">
            <i class="material-icons">logout</i>
        </button>
    </header>
</template>

<script>
export default {
  data () {
    return {
      isVerified: true
    }
  },
  methods: {
    goto (path) {
      this.$router.push(path)
    }
  },
  beforeMount () {
    if (localStorage.getItem('jwt')) {
      this.isVerified = this.$store.state.user.verified
    }
  }
}
</script>
