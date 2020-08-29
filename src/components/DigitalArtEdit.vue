<template>
  <div>
    <div class="login-box">
      <h4 class="text-justify">Update Digital Art: {{digitalArt['title']}}</h4>
      <hr />
      <form class="form-group" id @submit.prevent="digitalArtEdit(id)">
        <div class="input-field text-justify form-group-item">
          <label for="title">Title* (Up to 20 characters)</label>
          <div>
            <input
              class="form-control"
              type="text"
              name="title"
              id="title"
              v-model="digitalArt['title']"
            />
          </div>
        </div>

        <div class="input-field text-justify form-group-item">
          <label for="description">Description*</label>
          <div>
            <textarea
              class="form-control"
              rows="4"
              type="textarea"
              name="description"
              id="description"
              v-model="digitalArt['description']"
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
              v-model="digitalArt['price']"
              @keypress="isNumber($event)"
            />
          </div>
        </div>

        <div class="input-field text-justify form-group-item">
          <label for="categories">Category*</label>
          <div>
            <!-- <option value="0" selected>Select a Category</option> -->
            <select class="form-control" v-model="categoryToSubmit" id="category">
              <!-- <option value="categorySelectedObj.name" selected>{{categorySelectedObj.name}}</option> -->
              <option v-for="c in categories" v-bind:key="c.id" :value="c.id">{{c.name}}</option>
            </select>
            <!-- <div>{{categoryToSubmit}}</div> -->
          </div>
        </div>

        <!-- <div>
          <label for="ccc">ccc</label>
          <div>
            <select v-model="selected.category">
              <option value="0" disabled selected>SELECT</option>
              <option value="1">A</option>
              <option value="2">B</option>
              <option value="3">C</option>
              <option
                v-for="c in categories"
                v-bind:key="c.id"
                :value="c.id"
              >{{c.name}}</option>
            </select>
            <div>{{selected.category}}</div>
            
          </div>
        </div>-->

        <div class="input-field text-justify form-group-item">
          <label for>Replace Prview images (Up to 6 images)</label>
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
          <label>Replace Digital Art file (For multiple files, zip into a ZIP file and upload.)</label>
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
  name: "DigitalArtEdit",
  data() {
    return {
      id: "",
      digitalArt: {},
      fileChanged: false,
      categories: {},
      categoryToSubmit: "",
      previewImgsChanged: false,
      previewImgs: [],
      message: {
        text: "",
        type: "",
      },
    };
  },
  methods: {
    handleFileUpload() {
      this.digitalArt["file"] = this.$refs.file.files[0];
      this.fileChanged = true;
    },
    handlePreviewImgsUpload() {
      this.previewImgs = this.$refs.previewImgs.files;
      this.previewImgsChanged = true;
    },
    download() {
      window.open(this.digitalArt.file, "_blank");
    },
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
    digitalArtEdit(id) {
      this.token = Service.getToken();
      if (this.token) {
        if (id) {
          this.digitalArt["title"] = this.digitalArt["title"].replace(
            /\s\s+/g,
            " "
          );
          this.digitalArt["description"] = this.digitalArt[
            "description"
          ].replace(/\s\s+/g, " ");
          if (
            this.digitalArt["title"] == " " ||
            this.digitalArt["title"] == ""
          ) {
            this.message = {
              text: "[Title] is required",
              type: "error",
            };
            Bus.$emit("flash-message", this.message);
          } else if (this.digitalArt["title"] > 20) {
            this.message = {
              text: "[Title] is limited to 20 characters",
              type: "error",
            };
            Bus.$emit("flash-message", this.message);
          } else if (
            this.digitalArt["description"] == " " ||
            this.digitalArt["description"] == ""
          ) {
            this.message = {
              text: "[Description] is required",
              type: "error",
            };
            Bus.$emit("flash-message", this.message);
          } else if (
            this.digitalArt["price"] == " " ||
            this.digitalArt["price"] == ""
          ) {
            this.message = {
              text: "[Price] field required",
              type: "error",
            };
            Bus.$emit("flash-message", this.message);
          } else if (this.digitalArt["price"] <= 0) {
            this.message = {
              text: "[Price] cannot be lower than S$0",
              type: "error",
            };
            Bus.$emit("flash-message", this.message);
          } else {
            let formData = new FormData();
            var previewImgsCount = 0;
            if (this.previewImgsChanged == true) {
              for (var i = 0; i < this.previewImgs.length; i++) {
                let previewImg = this.previewImgs[i];
                formData.append("previewImg" + i, previewImg);
                previewImgsCount++;
              }
            }
            formData.append("previewImgsCount", previewImgsCount);
            if (this.fileChanged == true) {
              formData.append("file", this.digitalArt["file"]);
            }
            formData.append("title", this.digitalArt["title"]);
            formData.append("description", this.digitalArt["description"]);
            formData.append("price", this.digitalArt["price"]);
            formData.append("category", this.categoryToSubmit);

            axios
              .patch(
                Service.getBackendURL() + "api/products/" + id + "/",
                formData,
                {
                  headers: {
                    Authorization: "Token " + this.token,
                    // "Content-Type": "multipart/form-data"
                  },
                }
              )
              .then((res) => {
                console.log(res);
                this.message = {
                  text: "Product Updated",
                  type: "success",
                };
                Bus.$emit("flash-message", this.message);
                this.$router.push({
                  name: "DigitalArtDetail",
                  params: { id: id },
                });
              })
              .catch((res) => {
                console.log(res.response);
                this.message = {
                  text: "Failed to update",
                  type: "error",
                };
                Bus.$emit("flash-message", this.message);
                // this.$router.push({ name: "Details", params: { id: id } });
              });
          }
        }
      }
    },
    getDigitalArtDetail(id) {
      axios
        .get(Service.getBackendURL() + "api/products/" + this.id + "/")
        .then((res) => {
          this.digitalArt = res.data;

          if (Service.isDebug) {
            console.log(this.digitalArt);
          }
          this.getCategories();
        })
        .catch((err) => {
          if (Service.isDebug) {
            console.log(err);
          }
        });
    },
    getCategories() {
      axios
        .get(Service.getBackendURL() + "api/product-categories/")
        .then((res) => {
          this.categories = res.data;
          //   this.categories.push({ id: 0, name: "Select Category", default: true})
          if (this.categories.length > 0) {
            // this.categoryToSubmit = this.categorySelectedObj.id;
            this.categorySelected(this.digitalArt, this.categories);
          }
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
    categorySelected(digitalArt, categories) {
      //   console.log(this.categories);
      //   console.log(this.digitalArt.category);
      for (var i = 0; i < categories.length; i++) {
        // console.log(categories[i].name);
        // console.log(digitalArt.category);
        if (categories[i].name == digitalArt.category) {
          //   console.log(categories[i].id + " " + categories[i].name);
          this.categoryToSubmit = categories[i].id;
          //   this.categorySelectedObj = {
          //     id: categories[i].id,
          //     name: categories[i].name
          //   };
          console.log(this.categorySelectedObj);
        }
      }
    },
    updateMembers() {
      this.timer = setTimeout(() => {
        // this.getMembers();
      }, 600);
    },
  },
  created() {
    if (this.$route.params) {
      this.id = this.$route.params.id;
      console.log(this.id);
      if (this.id) {
        this.getDigitalArtDetail(this.id);
        // this.getCategories();
        // if (this.categories && this.digitalArt) {
        //   this.categorySelected(this.digitalArt, this.categories);
        // }
      }
    }
  },
};
</script>

<style>
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