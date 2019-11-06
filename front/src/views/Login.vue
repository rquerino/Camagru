<template>
    <div class="login-page">
        <header>
            <h3>Camagru</h3>
            <h4>Login</h4>
        </header>
        <main class="form-group">
            <input type="text" v-model="username" placeholder="Username"/>
            <input type="password" v-model="password" placeholder="Password"/>
            <button class="login-btn" @click="login">Log in</button>
            <br>
            <p>
              Forget your password? <router-link class="link" to="/password">Click here</router-link>.
            </p>
            <div class="error_msg" v-if="hasErrors">
                {{ error }}
            </div>
        </main>
        <footer>
            <p>
                Don't have an account? <router-link class="link" to="/register">Sign up</router-link>.
            </p>
        </footer>
    </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
      hasErrors: false,
      error: ''
    }
  },
  methods: {
    login () {
      let apiUrl = this.$store.state.api_url
      if (this.username === '' || this.password === '') return alert('Please fill in all fields')

      this.$http.post(apiUrl + 'user/login', {
        username: this.username,
        password: this.password
      }).then(response => {
        if (response.data.auth) {
          this.$store.commit('login', response.data)
        } else {
          this.error = response.data.msg
          this.hasErrors = true
        }
      }).catch(err => {
        throw err
      })
    }
  }
}
</script>
