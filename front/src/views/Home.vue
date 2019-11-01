<template>
  <div class="home">
    Hello, world!
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$store.commit('logout')
    }
  }
}
</script>
