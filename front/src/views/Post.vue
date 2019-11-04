<template>
  <main class="view post">
    <section class="stream">
      <video ref="video" id="video" width="100%" height="300" autoplay :class="(!captured) ? 'show' : 'hide'"></video>
      <div class="post-btns">
        <button class="capture-btn" @click="capture" v-if="!captured">
          <i class="material-icons icn-lg">camera</i><br>
          <label>Take picture</label>
        </button>
        <input type="file" id="imageLoader" @change="uploadImageToCanvas" v-if="!captured"/>
        <!-- <button class="upload-btn" @click="upload" v-if="!captured">
          <i class="material-icons icn-lg">backup</i><br>
          <label>Upload image</label>
        </button> -->
        <button class="cancel-btn" @click="cancel" v-if="captured">
          <i class="material-icons icn-lg">delete</i><br>
          <label>Discard image</label>
          </button>
        <button class="post-btn" @click="save" v-if="captured">
          <i class="material-icons icn-lg">check_circle</i><br>
          <label>Post image</label>
          </button>
      </div>
    </section>
    <section class="capture" :class="(captured) ? 'show' : 'hide'">
      <canvas ref="canvas" id="canvas" width="100%" height="300"></canvas>
      <div class="field-group">
        <label for="desc">Description:</label>
        <input type="text" id="desc" name="desc" class="input-field" v-model="desc" />
      </div>
    </section>
  </main>
</template>

<script>
export default {
  data () {
    return {
      video: {},
      canvas: {},
      constraints: {},
      cap: '',
      captured: false,
      files: []
    }
  },
  methods: {
    capture () {
      this.canvas.getContext('2d').drawImage(this.video, 0, 0, this.canvas.width, this.canvas.width)
      this.cap = this.canvas.toDataURL('image/png')
      this.captured = true
    },
    cancel () {
      this.captured = false
    },
    save () {
      let apiUrl = this.$store.state.api_url
      this.$http.post(apiUrl + 'post/newpost', {
        auth_token: localStorage.getItem('jwt'),
        image: this.cap,
        desc: this.desc
      })
        .then(response => {
          this.captured = false
          this.cap = ''
          this.desc = ''
          console.log(response)
        })
    },
    uploadImageToCanvas () {
      let self = this
      // let reader = event.target.files
      let files = event.target.files
      let reader = new FileReader()
      reader.onload = (e) => {
        var img = new Image()
        img.onload = function () {
          self.drawCanvasImage(img)
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(files[0])
    },
    drawCanvasImage (img) {
      var canvas = this.canvas
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      this.cap = canvas.toDataURL('image/png')
      this.captured = true
    }
  },
  mounted () {
    this.video = this.$refs.video
    this.video.width = window.innerWidth
    this.video.height = window.innerHeight - 80
    this.constraints = {
      width: window.innerWidth,
      height: window.innerWidth
    }

    if (this.$refs.canvas) {
      this.canvas = this.$refs.canvas
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerWidth
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: this.constraints
      }).then(stream => {
        this.video.srcObject = stream
        this.video.play()
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>
