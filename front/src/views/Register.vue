<template>
    <div class="register-page">
        <header>
            <h3>Camagru</h3>
            <h4>Register</h4>
        </header>
        <main class="form-group">
            <input type="text" v-model="username" placeholder="Username"/>
            <input type="text" v-model="email" placeholder="E-mail"/>
            <input type="password" v-model="password" placeholder="Password"/>
            <button class="register-btn" @click="register">Register</button>
            <div class="error_msg" v-if="hasErrors">
                {{ error }}
            </div>
        </main>
        <footer>
            <p>
                Already registered? <router-link class="link" to="/login">Sign in</router-link>.
            </p>
        </footer>
    </div>
</template>

<script>
export default {
  name: 'register',
  data () {
    return {
      username: '',
      email: '',
      password: '',
      hasErrors: false,
      error: ''
    }
  },
  methods: {
    register () {
      let apiUrl = this.$store.state.api_url
      if (this.username === '' || this.email === '' || this.password === '') return alert('Please fill in all fields')
      this.$http.post(apiUrl + 'user/register', {
        username: this.username,
        email: this.email,
        password: this.password
      }).then(response => {
        // Now it login automatically, but I have to add the email verification before and push it to the Verify.vue
        if (response.data.auth) {
          this.$store.commit('login', response.data.token)
        } else {
          this.error = response.data.msg
          this.hasErrors = true
        }
      }).catch(err => {
        this.error = err
        this.hasErrors = true
      })
    }
  }
}
</script>
