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
      <div class="sticker-btns">
        <span>Add a sticker to your image:</span><br>
        <button class="sticker" v-for="sticker of stickerList"
            :key="sticker.name"
            :style="{ 'background-image': `url(${sticker.pic})` }"
            @click="insertSticker(sticker)"
          />
          <button class="cancel-sticker" @click="removeSticker">
            <i class="material-icons">not_interested</i>
          </button>
        <br>
        <span>Choose a position to put the sticker in the picture:</span><br>
      </div>
      <div class="position-btns">
        <div class="row1">
          <button class="top-left-btn" @click="choosePosition('top-left')" >Top left</button>
          <button class="top-right-btn" @click="choosePosition('top-right')" >Top right</button>
        </div>
        <div class="row2">
          <button class="center-btn" @click="choosePosition('center')" >Center</button>
        </div>
        <div class="row3">
          <button class="bottom-left-btn" @click="choosePosition('bottom-left')" >Bottom left</button>
          <button class="bottom-right-btn" @click="choosePosition('bottom-right')" >Bottom right</button>
        </div>
      </div>
      <div class="field-group">
        <label for="desc">Description:</label>
        <input type="text" id="desc" name="desc" class="input-field" v-model="desc" />
      </div>
    </section>
    <center><p class="previous-p" v-if="!captured">Previous pictures:</p></center>
    <section class="previous-pics" v-if="!captured">
      <div class="post" v-for="post in posts" :key="post._id">

        <img :src="post.image" :alt="post.desc" class="post-image" />

      </div>
    </section>
  </main>
</template>

<script>
import stickerList from '../modules/stickerlist'

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
      sepia: false,
      sticker: {},
      stickerList,
      previousImage: null,
      posts: []
    }
  },
  methods: {
    capture () {
      this.drawCanvasImage(this.video,
        this.video.videoWidth, this.video.videoHeight)
    },
    cancel () {
      this.captured = false
      this.stickers = []
      this.previousImage = null
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
      this.canvas.width = width
      this.canvas.height = height
      ctx.drawImage(source, 0, 0, width, height)
      this.captured = true
      // Filter only works when rendering the 2nd time
      if (this.filter === null) {
        ctx.filter = 'none'
      } else if (this.filter === 'gray') {
        ctx.filter = 'grayscale(1)'
      } else if (this.filter === 'sepia') {
        ctx.filter = 'sepia(1)'
      }
      ctx.drawImage(source, 0, 0, width, height)
      this.previousImage = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
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
    },
    insertSticker (sticker) {
      this.sticker = sticker
      // this.stickerSelected = true
      // this.drawSticker()
    },
    choosePosition (pos) {
      let imSize = this.canvas.width / 4
      if (pos === 'top-left') {
        this.drawSticker(0, 0)
      } else if (pos === 'top-right') {
        this.drawSticker(this.canvas.width - imSize, 0)
      } else if (pos === 'bottom-left') {
        this.drawSticker(0, this.canvas.height - imSize)
      } else if (pos === 'bottom-right') {
        this.drawSticker(this.canvas.width - imSize, this.canvas.height - imSize)
      } else if (pos === 'center') {
        this.drawSticker((this.canvas.width - imSize) / 2, (this.canvas.height - imSize) / 2)
      }
    },
    drawSticker (x, y) {
      let stickerImage = new Image()
      stickerImage.src = this.sticker.pic
      let ctx = this.canvas.getContext('2d')
      // ctx.putImageData(this.previousImage, 0, 0)
      // ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height)
      ctx.drawImage(stickerImage, x, y, this.canvas.width / 4, this.canvas.width / 4)
      this.sticker = null
    },
    removeSticker () {
      let ctx = this.canvas.getContext('2d')
      ctx.putImageData(this.previousImage, 0, 0)
      ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height)
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

    this.$http.post(this.$store.state.api_url + 'user/getprofile', {
      auth_token: localStorage.getItem('jwt')
    }).then(({ data }) => {
      this.posts = data.details.posts
    })
  }
}
</script>
