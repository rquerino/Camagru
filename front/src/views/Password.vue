<template>
    <div class="login-page">
        <header>
            <h3>Reset Password</h3>
        </header>
        <main class="form-group">
            <p>
                You will receive a new password in your e-mail:
            </p><br>
            <input type="text" v-model="email" placeholder="E-mail"/>
            <button class="reset-btn" @click="resetPassword">Reset password</button>
            <br>
            <p>
              Remembered your password? Go to login page <router-link class="link" to="/login">clicking here</router-link>.
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
      email: '',
      password: '',
      hasErrors: false,
      error: ''
    }
  },
  methods: {
    resetPassword () {
      let apiUrl = this.$store.state.api_url

      if (this.email === '' || !/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email)) {
        this.hasErrors = true
        this.error = 'Please enter a valid e-mail.'
        return
      }

      this.$http.post(apiUrl + 'user/resetpassword', {
        email: this.email
      }).then(response => {
        if (response.data.success) {
          alert('You will receive your new password in your e-mail. Don\'t forget to change it later.')
          this.$router.push('Login')
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
