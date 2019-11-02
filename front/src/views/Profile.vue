<template>
  <main class="view profile">

    <section class="profile-head">
      {{ username }}
    </section>

    <section class="posts">
      <div class="post" v-for="post in posts" :key="post._id">

        <img :src="post.image" :alt="post.desc" class="post-image" />

      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'profile',
  data () {
    return {
      username: '',
      posts: []
    }
  },
  methods: {
    getProfile () {
      this.$http.post(this.$store.state.api_url + 'user/getprofile', {
        auth_token: localStorage.getItem('jwt')
      }).then(({ data }) => {
        this.username = data.details.username
        this.posts = data.details.posts
      })
    }
  },
  beforeMount () {
    this.getProfile()
  }
}
</script>
