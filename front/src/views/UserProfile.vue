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
  name: 'userProfile',
  data () {
    return {
      username: '',
      posts: []
    }
  },
  methods: {
    getUserProfile (username) {
      this.$http.post(this.$store.state.api_url + 'user/getuserprofile', {
        username: username
      }).then(({ data }) => {
        this.username = data.details.username
        this.posts = data.details.posts
      })
    }
  },
  beforeMount () {
    let params = new URLSearchParams(location.search)
    this.username = params.get('username')
    this.getUserProfile(this.username)
  }
}
</script>
