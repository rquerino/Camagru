<template>
  <main class="view feed">
    <div class="verify-alert" v-if="user && !isVerified">Please verify your e-mail before using Camagru</div>
    <article class="post" v-for="post in feed" :key="post.id">
      <header class="post-user">
      <button class="username-btn" @click="goToProfile(post.username)"> {{ post.username }}</button>
      <button class="delete-btn" v-if="user && checkOwner(post)" @click="deletePost(post)"><i class="material-icons">delete</i></button>
      </header>
      <section class="post-picture">
        <img :src="post.image" :alt="post.desc" class="post-image">
      </section>
      <div class="post-desc">
        <button class="like-btn" @click="likeFunction(post)" v-if="isVerified">
          <i v-if="user" class="material-icons icn-lg" :class="(post.likes.indexOf($store.state.user._id) !== -1) ? 'liked' : 'not-liked'">favorite</i><br>
          <label>{{ post.likes.length }}</label>
        </button>
        <p class="timestamp">{{ timestampToDate(post.timestamp) }}</p>
        <p><strong>{{ post.username }}:</strong> {{ post.desc }}</p>
      </div>
      <footer class="comments" v-if="isVerified">
        <article class="texts" v-for="item of post.comments" :key="item._id">
          <span class="span-comment"><strong>{{ item.user_id.username}}:</strong> {{ item.text }}</span>
        </article>
        <input type="text" id="commentText" name="commentText" class="comment-input" v-model="commentText" />
        <br>
        <button class="comment-btn" @click="saveComment(post)">Post comment</button>
      </footer>
    </article>
    <!-- <v-icon v-if="loading" name="circle-notch" spin scale="2"/> -->
    <center><p v-if="end">You reached the end 8^)</p></center>
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
      isVerified: false,
      commentText: '',
      offset: 0,
      end: false
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
        // Send e-mail to post owner
        if (post.user_id !== this.$store.state.user._id && this.$store.state.user.notifications) {
          this.$http.post(apiUrl + 'user/notification', {
            id: post.user_id
          })
        }
      }).catch(err => {
        throw err
      })
    },
    checkOwner (post) {
      if (post.user_id === this.$store.state.user._id) {
        return true
      } else {
        return false
      }
    },
    deletePost (post) {
      let apiUrl = this.$store.state.api_url
      this.$http.post(apiUrl + 'post/delete', {
        id: post._id
      }).then(response => {
        if (response.data.success) {
          window.location.reload()
          return alert('Post deleted.')
        } else {
          return alert('An internal error has occurred')
        }
      }).catch(err => {
        throw err
      })
    },
    goToProfile (username) {
      this.$router.push('/userprofile' + '?username=' + username)
    },
    atBottom () {
      return Math.ceil(window.pageYOffset + window.innerHeight) >=
        document.documentElement.offsetHeight
    },
    onScroll () {
      if (this.atBottom()) {
        this.fetchPosts()
      }
    },
    fetchPosts () {
      // Skip if reached end
      if (this.end) {
        return
      }
      this.$http.post(this.$store.state.api_url + 'post/getposts', {
        offset: this.offset
      })
        .then(response => {
          this.$store.commit('getFeed', response.data)
          this.offset += 10
          if (response.data.length < 10) {
            this.end = true
          }
        })
        .catch(err => {
          if (err) throw err
        })
    }
  },
  beforeMount () {
    if (localStorage.getItem('jwt')) {
      this.auth_token = localStorage.getItem('jwt')
      this.isVerified = this.$store.state.user.verified
    }
  },
  mounted () {
    this.$http.post(this.$store.state.api_url + 'post/getposts', {
      offset: this.offset
    })
      .then(response => {
        this.$store.commit('getFeed', response.data)
        this.offset += 10
      })
      .catch(err => {
        if (err) throw err
      })
    window.onscroll = this.onScroll
  }
}
</script>
