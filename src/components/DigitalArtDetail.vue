<template>
  <div v-if="digitalArt">
    <div class="container">
      <div class="item1">
        <div>
          <PreviewImageSlider class="img-box" v-bind:previewImgs="digitalArt.previewImgs"></PreviewImageSlider>
        </div>
        <div>Art by: {{digitalArt.owner}}, uploaded at: {{digitalArt.created_at | moment("MMMM Do YYYY")}}</div>
        <!-- <div class="items1-social">
          <div>Share this:</div>
          <div>
            <ShareNetwork
              network="facebook"
              :url="url"
              :title="digitalArt.title"
              :description="digitalArt.description"
              :quote="digitalArt.title"
            >
              <img alt="Share On Facebook" height="24" src="../assets/SocialMediaIcon/facebook.png" />
            </ShareNetwork>
          </div>
          <div>
            <ShareNetwork network="Twitter" :url="url" :title="digitalArt.title">
              <img alt="Share On Twitter" height="24" src="../assets/SocialMediaIcon/twitter.png" />
            </ShareNetwork>
          </div>
          <div>
            <ShareNetwork network="Reddit" :url="url" :title="digitalArt.title">
              <img alt="Share On Reddit" height="24" src="../assets/SocialMediaIcon/reddit.png" />
            </ShareNetwork>
          </div>
          <div>
            <ShareNetwork network="WhatsApp" :url="url" :title="digitalArt.title">
              <img alt="Share On WhatsApp" height="24" src="../assets/SocialMediaIcon/whatsapp.png" />
            </ShareNetwork>
          </div>
        </div>-->
      </div>
      <div class="item2">
        <!-- <div>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
          />

          <span class="fa fa-star checked"></span>
          <span class="fa fa-star checked"></span>
          <span class="fa fa-star checked"></span>
          <span class="fa fa-star checked"></span>
          <span class="fa fa-star"></span>
        </div>-->
        <!-- <div>Rating {{digitalArt.rating_average}}</div> -->
        <h5 class="text-justify">{{digitalArt.title}}</h5>
        <div class="price">S${{digitalArt.price}}</div>

        <div>
          <p class="description">{{digitalArt.description}}</p>
        </div>
        <div>Category: {{digitalArt.category}}</div>

        <div class="my-btn">
          <button class="btn btn-lg btn-info" v-on:click="addtoCart(digitalArt.id)">Add to Cart</button>
          <button class="btn btn-lg btn-warning" v-on:click="buyNow(digitalArt.id)">Buy Now</button>
        </div>
      </div>
    </div>
    <!-- <div v-if="digitalArt.comments_list.length>0">{{digitalArt.comments_list}}</div>
    <div v-else>No commet yet</div>-->
  </div>
</template>

<script src="/dist/vue-social-sharing.js"></script>
<script>
// @ is an alias to /src
import axios from "axios";
import { Service } from "../storage/service";
import PreviewImageSlider from "./PreviewImageSlider";

export default {
  name: "DigitalArtDetail",
  components: {
    PreviewImageSlider,
  },
  data() {
    return {
      id: null,
      url: "",
      digitalArt: { comments_list: [] },
      message: {
        text: "",
        type: "",
      },
    };
  },
  methods: {
    buyNow(id) {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      let formData = new FormData();
      if (this.token) {
        formData.append("digital_art", id);
        axios
          .post(Service.getBackendURL() + "api/order/", formData, {
            headers: {
              Authorization: "Token " + this.token,
              "Content-type": "multipart/form-data",
            },
          })
          .then((res) => {
            if (Service.isDebug) {
              console.log(res);
            }
            this.gotoOrderDetail(res.data.result.id);
            this.message = {
              text: "[" + this.digitalArt.title + "] has been placed in order.",
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
    addtoCart(id) {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      let formData = new FormData();
      if (this.token) {
        formData.append("digital_art", id);
        axios
          .post(Service.getBackendURL() + "api/cart/", formData, {
            headers: {
              Authorization: "Token " + this.token,
              "Content-type": "multipart/form-data",
            },
          })
          .then((res) => {
            if (Service.isDebug) {
              console.log(res.data);
            }

            this.message = {
              text: "[" + this.digitalArt.title + "] has been add to cart.",
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
    gotoOrderDetail(id) {
      this.$router.push({
        name: "MyOrderDetail",
        params: { id: id },
      });
    },
    getDigitalArtDetail(id) {
      axios
        .get(Service.getBackendURL() + "api/products/" + this.id + "/")
        .then((res) => {
          this.digitalArt = res.data;

          if (Service.isDebug) {
            console.log(this.digitalArt);
            console.log(this.digitalArt.previewImgs);
          }
        })
        .catch((err) => {
          if (Service.isDebug) {
            console.log(err);
          }
        });
    },
  },
  created() {
    if (this.$route.params) {
      this.id = this.$route.params.id;
      console.log(this.id);
      if (this.id) {
        this.getDigitalArtDetail(this.id);
        this.url =
          Service.getBackendURL() + "api/products/details/" + this.id + "/";
      }
    }
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px;
  margin: 15px;
}

.item1 div {
  font-size: 14px;
}
.item2 {
  margin: 0 10px 10px 20px;
  padding: 0 10px 10px 20px;
  width: 55%;
  text-align: left;
}

.item2 div {
  margin: 3px;
  padding: 3px;
  font-size: 19px;
}
.items1-social {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.items1-social div {
  padding: 2px;
  margin: 2px;
}
/* .container div {
  flex: 1% 49%;
  text-align: left;
} */

/* .container div div {
  margin: 5px;
  flex: 0 1 calc(20% - 8px);
  margin-right: 10px;
  padding-left: 30px;
} */
.btn2link {
  /* border-color: transparent;
    border-width: 0; */
  text-align: center;
  background-color: Transparent;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  display: inline-block;
}
.description {
  font-size: 14px;
}
.price {
  color: grey;
  font-size: 25px;
}
.checked {
  color: orange;
}

.my-btn button {
  margin: 15px;
}
 /deep/ .img-box {
  height: 400px;
  width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>