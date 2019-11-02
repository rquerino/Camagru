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

<style lang="scss">
.profile {
  display: flex;
  flex-direction: column;

  .profile-head {
    background: #FFF;
    padding: 15px;
    box-sizing: border-box;
  }

  .posts {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: min-content;
    grid-gap: 5px;

    .post {
      padding: 0;

      .post-image {
        width: 100%;
        display: block;
      }
    }
  }
}
</style>
