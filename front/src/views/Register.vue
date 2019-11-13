<template>
    <div class="register-page">
        <header>
            <h3>Register</h3>
        </header>
        <form class="form-group" @submit="register">
            <input type="text" v-model="username" placeholder="Username"/>
            <input type="text" v-model="email" placeholder="E-mail"/>
            <input type="password" v-model="password" placeholder="Password"/>
            <button class="register-btn" :fn="register">Register</button>
            <div class="error_msg" v-if="hasErrors">
                {{ error }}
            </div>
        </form>
        <footer>
            <p>
                Already registered? <router-link class="link" to="/login">Sign in</router-link>.
            </p>
        </footer>
    </div>
</template>

<script>
import router from '../router'

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
    register (e) {
      e.preventDefault()
      let apiUrl = this.$store.state.api_url
      if (this.username === '' || this.email === '' || this.password === '') return alert('Please fill in all fields')
      this.$http.post(apiUrl + 'user/register', {
        username: this.username,
        email: this.email,
        password: this.password
      }).then(response => {
        if (response.data.auth) {
          this.$store.commit('login', response.data)
        } else {
          this.error = response.data.msg
          this.hasErrors = true
        }
      }).catch(err => {
        console.log('catched an error here')
        this.error = err
        this.hasErrors = true
      })
    }
  },
  beforeMount () {
    if (localStorage.getItem('jwt')) {
      router.push('/')
    }
  }
}
</script>
