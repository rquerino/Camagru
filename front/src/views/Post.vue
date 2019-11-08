<template>
  <main class="view post">
    <section class="stream">
      <video ref="video" id="video" autoplay :class="[(!captured) ? 'show' : 'hide', filter]"></video>
      <div class="filter-btns" :class="(!captured) ? '' : 'hide'">
        <button class="normal-filter-btn" @click="applyNormalFilter" :class="(this.normal) ? 'selected' : 'not-selected'">
          Normal
        </button>
        <button class="grayscale-filter-btn" @click="applyGrayFilter" :class="(this.grayscale) ? 'selected' : 'not-selected'">
          Grayscale
        </button>
        <button class="sepia-filter-btn" @click="applySepiaFilter" :class="(this.sepia) ? 'selected' : 'not-selected'">
          Sepia
        </button>
      </div>
      <div class="before-btns">
        <button class="capture-btn" @click="capture" v-if="!captured">
          <i class="material-icons icn-lg">camera</i><br>
          <label>Take picture</label>
        </button>
        <input class="input-file" type="file" id="imageLoader" @change="uploadImageToCanvas" v-if="!captured"/>
        <!-- <button class="upload-btn" @click="upload" v-if="!captured">
          <i class="material-icons icn-lg">backup</i><br>
          <label>Upload image</label>
        </button> -->
      </div>
    </section>
    <section class="capture" :class="(captured) ? 'show' : 'hide'">
      <canvas ref="canvas" id="canvas"></canvas>
      <div class="after-btns">
        <button class="cancel-btn" @click="cancel">
          <i class="material-icons icn-lg">delete</i><br>
          <label>Discard image</label>
          </button>
        <button class="post-btn" @click="save">
          <i class="material-icons icn-lg">check_circle</i><br>
          <label>Post image</label>
          </button>
      </div>
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
      files: [],
      filter: null,
      desc: '',
      normal: true,
      grayscale: false,
      sepia: false
    }
  },
  methods: {
    capture () {
      this.drawCanvasImage(this.video,
        this.video.videoWidth, this.video.videoHeight)
    },
    cancel () {
      this.captured = false
    },
    save () {
      this.cap = this.canvas.toDataURL('image/png')
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
        })
    },
    uploadImageToCanvas () {
      // let reader = event.target.files
      let files = event.target.files
      let reader = new FileReader()
      reader.onload = (e) => {
        var img = new Image()
        img.onload = () => {
          this.drawCanvasImage(img, img.width, img.height)
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(files[0])
    },
    drawCanvasImage (source, width, height) {
      let ctx = this.canvas.getContext('2d')
      if (this.filter === null) {
        ctx.filter = 'none'
      } else if (this.filter === 'gray') {
        ctx.filter = 'grayscale(1)'
      } else if (this.filter === 'sepia') {
        ctx.filter = 'sepia(1)'
      }
      this.canvas.width = width
      this.canvas.height = height
      ctx.drawImage(source, 0, 0, width, height)
      this.captured = true
      ctx.filter = 'none' // Clear filter after drawing
    },
    applyNormalFilter () {
      this.normal = true
      this.grayscale = false
      this.sepia = false
      this.filter = null
    },
    applyGrayFilter () {
      this.normal = false
      this.grayscale = true
      this.sepia = false
      this.filter = 'gray'
    },
    applySepiaFilter () {
      this.normal = false
      this.grayscale = false
      this.sepia = true
      this.filter = 'sepia'
    }
  },
  mounted () {
    this.video = this.$refs.video
    // this.video.width = window.innerWidth
    // this.video.height = window.innerHeight - 80
    // this.constraints = {
    //   width: window.innerWidth,
    //   height: window.innerWidth
    // }

    if (this.$refs.canvas) {
      this.canvas = this.$refs.canvas
    //   this.canvas.width = window.innerWidth
    //   this.canvas.height = window.innerWidth
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: this.constraints
      }).then(stream => {
        this.video.srcObject = stream
        this.video.play()
      }).catch(err => {
        throw err
      })
    }
  }
}
</script>
