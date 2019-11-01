<template>
  <main class="view feed">

    <article class="post" v-for="post in feed" :key="post.id">
      <header class="post-user">{{ post.username }}</header>
      <section class="post-picture">
        <img :src="post.image" :alt="post.desc" class="post-image">
      </section>
      <footer class="post-desc">
        <p><strong>{{ post.username }}:</strong> {{ post.desc }}</p>
        <p class="timestamp">{{ timestampToDate(post.timestamp) }}</p>
      </footer>
    </article>

    <button @click="logout">Logout</button>
  </main>
</template>

<script>
export default {
  computed: {
    feed () {
      return this.$store.state.feed
    }
  },
  methods: {
    logout () {
      this.$store.commit('logout')
    },
    timestampToDate (timestamp) {
      timestamp = timestamp * 1
      let d = new Date(timestamp)
      let year = d.getFullYear()
      let month = d.getMonth() + 1 // starts with 0
      if (month < 10) {
        month = '0' + month
      }
      let day = d.getDate()
      if (day < 10) {
        day = '0' + day
      }
      return day + '/' + month + '/' + year
    }
  }
}
</script>
