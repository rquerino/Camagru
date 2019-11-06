<template>
  <main class="view feed">
    <article class="post" v-for="post in feed" :key="post.id">
      <header class="post-user">{{ post.username }}</header>
      <section class="post-picture">
        <img :src="post.image" :alt="post.desc" class="post-image">
      </section>
      <div class="post-desc">
        <button class="like-btn" @click="likeFunction(post)" v-if="loggedIn">
          <i class="material-icons icn-lg" :class="(post.likes.indexOf($store.state.user._id) !== -1) ? 'liked' : 'not-liked'">favorite</i><br>
          <label>{{ post.likes.length }}</label>
        </button>
        <p class="timestamp">{{ timestampToDate(post.timestamp) }}</p>
        <p><strong>{{ post.username }}:</strong> {{ post.desc }}</p>
      </div>
      <footer class="comments" v-if="loggedIn">
        <article class="texts" v-for="item of post.comments" :key="item._id">
          <span class="span-comment"><strong>{{ item.user_id.username}}:</strong> {{ item.text }}</span>
        </article>
        <input type="text" id="commentText" name="commentText" class="comment-input" v-model="commentText" />
        <br>
        <button class="comment-btn" @click="saveComment(post)">Post comment</button>
      </footer>
    </article>
  </main>
</template>

<script>
// import Vue from 'vue'
// Vue.$forceUpdate()
import { mapState } from 'vuex'

export default {
  props: {
    post: Object
  },
  data () {
    return {
      auth_token: '',
      loggedIn: false,
      commentText: ''
    }
  },
  computed: {
    feed () {
      return this.$store.state.feed
    },
    ...mapState(['user']) // get user info from $store
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
    likeFunction (post) {
      let apiUrl = this.$store.state.api_url
      this.$http.post(apiUrl + 'post/likepost', {
        postId: post._id,
        auth_token: this.auth_token
      }).then(response => {
        let index = post.likes.indexOf(this.$store.state.user._id)
        if (response.data.liked && index === -1) {
          post.likes.push(this.$store.state.user._id)
        } else if (!response.data.liked && index !== -1) {
          post.likes.splice(index, 1)
        }
      }).catch(err => {
        throw err
      })
    },
    saveComment (post) {
      if (this.commentText === '') {
        return alert('Comment field is empty')
      }
      let apiUrl = this.$store.state.api_url
      this.$http.post(apiUrl + 'post/comment', {
        postId: post._id,
        userId: this.$store.state.user._id,
        text: this.commentText
      }).then(response => {
        post.comments.push({
          user_id: this.$store.state.user,
          text: this.commentText
        })
        this.commentText = ''
      }).catch(err => {
        throw err
      })
    }
  },
  beforeMount () {
    if (localStorage.getItem('jwt')) {
      this.loggedIn = true
      this.auth_token = localStorage.getItem('jwt')
    }
  },
  mounted () {
    this.$http.get(this.$store.state.api_url + 'post/getposts')
      .then(response => {
        this.$store.commit('getFeed', response.data)
      })
      .catch(err => {
        if (err) throw err
      })
  }
}
</script>
