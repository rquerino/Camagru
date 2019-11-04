<template>
    <footer class="footer">
        <button @click="goto('/')"><i class="material-icons">home</i></button>
        <button @click="goto('/newpost')"><i class="material-icons">camera_enhance</i></button>
        <button @click="goto('/profile')"><i class="material-icons">account_box</i></button>
    </footer>
</template>

<script>
export default {
  methods: {
    goto (path) {
      this.$router.push(path)
    }
  }
}
</script>
