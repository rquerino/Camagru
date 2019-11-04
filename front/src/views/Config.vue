<template>
    <div class="config-page">
        <header>
            <h4>Update information</h4>
        </header>
        <main class="form-group">
            <p>Username:</p>
            <input type="text" v-model="username" :placeholder="this.previousUsername"/>
            <p>E-mail:</p>
            <input type="text" v-model="email" :placeholder="this.previousEmail"/>
            <p>Password:</p>
            <input type="password" v-model="password" placeholder="New password"/>
            <p>Would you like to receive e-mail notifications?</p>
            <input type="checkbox" v-model="notifications" id="notifications"/>
            <button class="update-btn" @click="update">Update</button>
            <div class="error_msg" v-if="hasErrors">
                {{ error }}
            </div>
        </main>
    </div>
</template>

<script>
export default {
  name: 'register',
  data () {
    return {
      auth_token: '',
      username: '',
      email: '',
      password: '',
      notifications: true,
      hasErrors: false,
      error: '',
      previousUsername: '',
      previousEmail: ''
    }
  },
  methods: {
    getData () {
      this.$http.post(this.$store.state.api_url + 'user/getdata', {
        auth_token: localStorage.getItem('jwt')
      }).then(({ data }) => {
        this.previousUsername = data.details.username
        this.previousEmail = data.details.email
      })
    },
    update () {
      // Handling errors
      if (this.password === '' && this.username === '' && this.email === '') return alert('Please fill in at least one field.')
      let apiUrl = this.$store.state.api_url
      this.$http.post(apiUrl + 'user/config', {
        auth_token: this.auth_token,
        username: this.username,
        email: this.email,
        password: this.password,
        notifications: this.notifications
      }).then(response => {
        if (response.data.auth) {
          alert('Information updated.')
        } else {
          this.error = response.data.msg
          this.hasErrors = true
        }
      }).catch(err => {
        this.error = err
        this.hasErrors = true
      })
    }
  },
  beforeMount () {
    this.getData()
    this.auth_token = localStorage.getItem('jwt')
  }
}
</script>
