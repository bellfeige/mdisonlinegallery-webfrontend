<template>
  <div class="home">
    <!-- <h1>Home page</h1> -->
    <div class="img-container">
      <PreviewImageSlider class="img-box" v-bind:previewImgs="images"></PreviewImageSlider>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import { Service } from "../storage/service";
import Categorybar from "@/components/Categorybar.vue";
import PreviewImageSlider from "@/components/PreviewImageSlider";

export default {
  name: "Home",
  components: {
    Categorybar,
    PreviewImageSlider,
  },
  data() {
    return {
      digitalArts: {},
      images: [],
    };
  },
  methods: {
    getDigitalArts() {
      axios
        .get(Service.getBackendURL() + "api/products/")
        .then((res) => {
          this.digitalArts = res.data;
          var s;
          if (res.data.length < 5) {
            s = res.data.length;
          } else {
            s = 5;
          }
          for (let i = 0; i <= s - 1; i++) {
            let img = res.data[i].previewImgs[0].image;
            let imgObj = { image: img };
            this.images.push(imgObj);
          }
          console.log(this.images);
          if (Service.isDebug) {
            console.log(this.digitalArts);
          }
        })
        .catch((err) => {
          if (Service.isDebug) {
            console.log(err.response);
          }
        });
    },
  },
  created() {
    this.getDigitalArts();
  },
};
</script>

<style scoped>
.img-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
/deep/ .img-box {
  width: 80%;
  object-fit: contain;
  height: 400px;
  margin: auto
  
}
</style>
