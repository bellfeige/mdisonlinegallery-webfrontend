<template>
  <div v-if="digitalArts.length>0">
    <h3 class="text-justify">Digital Arts Gallery</h3>

    <div class="container">
      <div class v-bind:key="digitalArt.id" v-for="digitalArt in digitalArts">
        <!-- <div class="container-item-image" v-on:click="gotoDigitalArtDetail(digitalArt)">
          <img :src="digitalArt.previewImgs[0].image" style="width:100%" />
        </div>
        <div>
          <button
            class="btn2link container-item-btn"
            v-on:click="gotoDigitalArtDetail(digitalArt)"
          >{{digitalArt.title}}</button>
        </div>
        <div>
          <button class="btn btn-outline-success container-item-btn">Add to Cart</button>
        </div>-->

        <div class="card">
          <img
            class="pointer"
            :src="digitalArt.previewImgs[0].image"
            v-on:click="gotoDigitalArtDetail(digitalArt)"
          />

          <a class="btn2link" v-on:click="gotoDigitalArtDetail(digitalArt)">{{digitalArt.title}}</a>
          <p class="price">S${{digitalArt.price}}</p>

          <button v-on:click="addtoCart(digitalArt)">Add to Cart</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import { Service } from "../storage/service";

export default {
  name: "DigitalArtList",
  components: {},
  data() {
    return {
      digitalArts: {},
      message: {
        text: "",
        type: "",
      },
    };
  },
  methods: {
    gotoDigitalArtDetail(digitalArt) {
      this.$router.push({
        name: "DigitalArtDetail",
        params: { id: digitalArt.id },
      });
    },
    addtoCart(digitalArt) {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      let formData = new FormData();
      if (this.token) {
        formData.append("digital_art", digitalArt.id);
        axios
          .post(Service.getBackendURL() + "api/cart/", formData, {
            headers: {
              Authorization: "Token " + this.token,
              "Content-type": "multipart/form-data",
            },
          })
          .then((res) => {
            if (Service.isDebug) {
              console.log(res);
            }

            this.message = {
              text: "[" + digitalArt.title + "] has been add to cart.",
              type: "success",
            };
            Bus.$emit("flash-message", this.message);
          })
          .catch((err) => {
            if (Service.isDebug) {
              console.log(err.response);
            }
            if (err.response.data.digital_art) {
              this.message.text = err.response.data.digital_art[0];
            } else if (err.response.status == 403) {
              this.message.text = "Only website member can purchase products";
            } else {
              this.message.text = err.response.data.message;
            }
            this.message.type = "error";
            Bus.$emit("flash-message", this.message);
          });
      } else {
        this.message = {
          text: "Please log in first",
          type: "error",
        };
        Bus.$emit("flash-message", this.message);
      }
    },
    getDigitalArts() {
      axios
        .get(Service.getBackendURL() + "api/products/")
        .then((res) => {
          this.digitalArts = res.data;
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
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
}

.btn2link {
  text-align: center;
  background-color: Transparent;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  display: inline-block;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  max-width: 300px;
  /* max-height: 100px; */
  margin: auto;
  text-align: center;
  font-family: arial;
}

.price {
  color: grey;
  font-size: 22px;
}

.card button {
  border: none;
  outline: 0;
  padding: 12px;
  color: white;
  background-color: #5bc0de;
  text-align: center;
  cursor: pointer;
  width: 100%;
  font-size: 18px;
}

.card button:hover {
  opacity: 0.7;
}
.card img:hover {
  opacity: 0.7;
}
.card img {
  width: 100%;
  height: 300px;
  object-fit: contain;
}

.pointer {
  cursor: pointer;
}
</style>