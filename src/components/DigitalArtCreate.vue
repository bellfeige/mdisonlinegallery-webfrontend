<template>
  <div>
    <div class="login-box">
      <h4 class="text-justify">Post a New Digital Product</h4>
      <hr />
      <form class="form-group" @submit.prevent="createDigitalArt()">
        <div class="input-field text-justify form-group-item">
          <label for="title">Title* (Up to 20 characters)</label>
          <div>
            <input
              class="form-control"
              type="text"
              name="title"
              id="title"
              v-model="title"
              placeholder="Add title..."
            />
          </div>
        </div>

        <div class="input-field text-justify form-group-item">
          <label for="description">Description*</label>
          <div>
            <textarea
              class="form-control description"
              rows="4"
              type="textarea"
              name="description"
              id="description"
              v-model="description"
              placeholder="Add description..."
            ></textarea>
          </div>
        </div>
        <div class="input-field text-justify form-group-item">
          <label for="price">Price S$*</label>
          <div>
            <input
              class="form-control"
              type="text"
              name="price"
              id="price"
              v-model="price"
              @keypress="isNumber($event)"
              placeholder="Set Price..."
            />
          </div>
        </div>

        <div class="input-field text-justify form-group-item">
          <label for="categories">Category*</label>
          <div>
            <!-- <option value="0" selected>Select a Category</option> -->
            <select class="form-control" v-model="category" id="category">
              <option disabled value="0">--Select a Category--</option>
              <option v-for="c in categories" v-bind:key="c.id" :value="c.id">{{c.name}}</option>
            </select>
          </div>
        </div>

        <div class="input-field text-justify form-group-item">
          <label for>Upload Prview images* (Up to 6 images)</label>
          <div>
            <input
              type="file"
              id="previewImgs"
              ref="previewImgs"
              multiple
              v-on:change="handlePreviewImgsUpload()"
            />
          </div>
        </div>

        <div class="input-field text-justify form-group-item">
          <label>Upload Digital Art* (For multiple files, zip into a ZIP file and upload.)</label>
          <div>
            <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
          </div>
        </div>
        <div class="form-group-item">
          <input class="btn btn-primary btn-large" type="submit" value="Submit" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Service } from "../storage/service";

export default {
  name: "DigitalArtCreate",
  components: {},
  data() {
    return {
      title: "",
      description: "",
      category: "0",
      categories: {},
      price: "",
      file: "",
      previewImgs: [],
      message: {
        text: "",
        type: "",
      },
    };
  },
  methods: {
    isNumber: function (evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },

    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    handlePreviewImgsUpload() {
      this.previewImgs = this.$refs.previewImgs.files;
    },
    createDigitalArt() {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      if (this.token) {
        this.title = this.title.replace(/\s\s+/g, " ");
        this.description = this.description.replace(/\s\s+/g, " ");
        if (this.title == " " || this.title == "") {
          this.message = {
            text: "[Title] is required",
            type: "error",
          };
          Bus.$emit("flash-message", this.message);
        } else if (this.title.length > 20) {
          this.message = {
            text: "[Title] is limited to 20 characters",
            type: "error",
          };
          Bus.$emit("flash-message", this.message);
        } else if (this.description == " " || this.description == "") {
          this.message = {
            text: "[Description] is required",
            type: "error",
          };
          Bus.$emit("flash-message", this.message);
        } else if (this.price == " " || this.price == "") {
          this.message = {
            text: "[Price] is required",
            type: "error",
          };
          Bus.$emit("flash-message", this.message);
        } else if (this.price <= 0) {
          this.message = {
            text: "[Price] cannot be lower than S$0",
            type: "error",
          };
          Bus.$emit("flash-message", this.message);
        } else if (this.category == "0" || "") {
          this.message = {
            text: "[Category] is required",
            type: "error",
          };
          Bus.$emit("flash-message", this.message);
        } else if (this.previewImgs.length == 0) {
          this.message = {
            text: "Preview Images field required",
            type: "error",
          };
          Bus.$emit("flash-message", this.message);
        } else if (this.file.length == 0) {
          this.message = {
            text: "Digitial Product uploading required",
            type: "error",
          };
          Bus.$emit("flash-message", this.message);
        } else if (this.previewImgs.length > 6) {
          this.message = {
            text: "Preview Images up to 6",
            type: "error",
          };
          Bus.$emit("flash-message", this.message);
        } else {
          let formData = new FormData();
          console.log(formData);
          var previewImgsCount = 0;
          for (var i = 0; i < this.previewImgs.length; i++) {
            let previewImg = this.previewImgs[i];
            formData.append("previewImg" + i, previewImg);
            previewImgsCount++;
          }
          formData.append("previewImgsCount", previewImgsCount);
          // console.log("this.previewImgs.length: " + previewImgsCount);
          formData.append("file", this.file);
          formData.append("title", this.title);
          formData.append("description", this.description);
          formData.append("price", this.price);
          formData.append("category", this.category);
          console.log(formData.get("category"));
          axios
            .post(Service.getBackendURL() + "api/products/", formData, {
              headers: {
                Authorization: "Token " + this.token,
                "Content-type": "multipart/form-data",
              },
            })
            .then((res) => {
              console.log(res.data);
              this.message = {
                text:
                  "New Digital Product [" + this.title + "] has beem created",
                type: "success",
              };
              Bus.$emit("flash-message", this.message);
              this.gotoDigitalArtDetail(res.data.data);
            })
            .catch((res) => {
              console.log(res.response);
              this.message = {
                text: res.response.message,
                type: "success",
              };
              Bus.$emit("flash-message", this.message);
            });
        }
      } else {
        this.message = {
          text: "Please log in first",
          type: "error",
        };
        Bus.$emit("flash-message", this.message);
      }
    },
    gotoDigitalArtDetail(digitalArt) {
      this.$router.push({
        name: "DigitalArtDetail",
        params: { id: digitalArt.id },
      });
    },
    getCategories() {
      axios
        .get(Service.getBackendURL() + "api/product-categories/")
        .then((res) => {
          this.categories = res.data;
          //   this.categories.push({ id: 0, name: "Select Category", default: true})
          if (Service.isDebug) {
            console.log(this.categories);
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
    this.getCategories();
  },
};
</script>

<style scoped>
.login-box {
  width: 700px;
  height: auto;
  background-color: white;
  margin-top: 15px;
  border-radius: 5px;
  padding: 15px;
  margin: auto;
  border: 1px solid #e4e6e7;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.4);
}
.form-group-item {
  margin: 5px;
  padding: 5px;
}
</style>