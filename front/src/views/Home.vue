<template>
  <main class="view feed">

    <article class="post" v-for="post in feed" :key="post.id">
      <header class="post-user">{{ post.username }}</header>
      <section class="post-picture">
        <img :src="post.image" :alt="post.desc" class="post-image">
      </section>
      <footer class="post-desc">
        <button class="like-btn" @click="likeFunction" v-if="loggedIn">
          <i class="material-icons icn-lg">favorite</i><br>
          <label>{{ post.likes.length }}</label>
        </button>
        <p class="timestamp">{{ timestampToDate(post.timestamp) }}</p>
        <p><strong>{{ post.username }}:</strong> {{ post.desc }}</p>
      </footer>
    </article>
  </main>
</template>

<script>
// import { mapState } from 'vuex'
// import axios from 'axios'

export default {
  props: {
    post: Object
  },
  data () {
    return {
      loggedIn: false,
      liked: false,
      user_id: ''
    }
  },
  computed: {
    feed () {
      return this.$store.state.feed
    }
  },
  methods: {
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
    },
    likeFunction () {
      let index = this.post.likes.indexOf(this.user_id)
      if (index !== -1) {
        this.post.splice(index)
        this.liked = false
      } else {
        this.post.likes.push(this.user_id)
        this.liked = true
      }
    }
  },
  mounted () {
    if (localStorage.getItem('jwt')) {
      this.user_id = localStorage.getItem('jwt')
      this.loggedIn = true
    }
  }
}
</script>
