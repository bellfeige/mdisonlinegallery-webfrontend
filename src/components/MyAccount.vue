<template>
  <div v-if="me">
    <h3 class="text-justify">My Account Information</h3>

    <div class="login-box">
      <h5>My Profile</h5>
      <hr />
      <div class="input-field text-justify form-group-item">
        <label for>Username:</label>
        <label>{{username}}</label>
      </div>
      <form class="form-group" id="formaccount" @submit.prevent="updateAccount(me[0].id)">
        <div class="input-field text-justify form-group-item">
          <label for="firstname">First Name</label>
          <input
            class="form-control"
            type="text"
            name="firstname"
            id="firstname"
            v-model="firstName"
          />
        </div>
        <div class="input-field text-justify form-group-item">
          <label for="lastname">Last Name</label>
          <input class="form-control" type="text" name="lastname" id="lastname" v-model="lastName" />
        </div>
        <div class="input-field text-justify form-group-item">
          <label for="email">Email</label>
          <input class="form-control" type="email" name="email" id="email" v-model="email" />
        </div>
        <div class="input-field text-justify form-group-item">
          <input class="btn btn-primary" type="submit" value="Update" />
        </div>
      </form>
    </div>
    <br />
    <div class="login-box">
      <h5>Reset Password</h5>
      <hr />
      <form class="form-group" id="formpassword" @submit.prevent="updatePassword(me[0].id)">
        <div class="input-field text-justify form-group-item">
          <label for="newPassword">Enter New Password</label>
          <input
          class="form-control"
            type="password"
            name="newPassword"
            id="newPassword"
            v-model="newPassword"
            placeholder="New Password"
          />
        </div>
        <div class="input-field text-justify form-group-item">
          <label for="newPassword_confirm">Confirm New Password</label>
          <input
          class="form-control"
            type="password"
            name="newPassword_confirm"
            id="newPassword_confirm"
            v-model="newPassword_confirm"
            placeholder="Confirm Password"
          />
        </div>
        <div class="input-field text-justify form-group-item">
          <input class="btn btn-primary" type="submit" value="Reset" />
        </div>
      </form>
    </div>
  </div>
</template>



<script>
// @ is an alias to /src
import axios from "axios";
import { Service } from "../storage/service";

export default {
  name: "MyAccount",
  components: {},
  data() {
    return {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      newPassword: "",
      newPassword_confirm: "",
      me: {},
      message: {
        text: "",
        type: "",
      },
    };
  },
  methods: {
    updateAccount(id) {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      let formData = new FormData();
      if (this.token) {
        formData.append("first_name", this.firstName);
        formData.append("last_name", this.lastName);
        formData.append("email", this.email);
        axios
          .patch(
            Service.getBackendURL() + "api/my-profile/" + id + "/",
            formData,
            {
              headers: {
                Authorization: "Token " + this.token,
                "Content-type": "multipart/form-data",
              },
            }
          )
          .then((res) => {
            if (Service.isDebug) {
              console.log(res);
            }

            this.message = {
              text: "Account information updated",
              type: "success",
            };
            Bus.$emit("flash-message", this.message);
            if (res.data.get_full_name != "") {
              this.displayUsername = res.data.full_name;
              localStorage.setItem("displayUsername", res.data.get_full_name);
            } else {
              this.displayUsername = res.data.username;
              localStorage.setItem("displayUsername", res.data.username);
            }
          })
          .catch((err) => {
            if (Service.isDebug) {
              console.log(err.response);
            }
            if (err.response.data.first_name) {
              this.message.text = err.response.data.first_name[0];
            } else if (err.response.data.last_name) {
              this.message.text = err.response.data.last_name[0];
            } else if (err.response.data.email) {
              this.message.text = err.response.data.email[0];
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
    updatePassword(id) {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      let formData = new FormData();
      if (this.token) {
        this.newPassword = this.newPassword.replace(/\s\s+/g, " ");
        this.newPassword_confirm = this.newPassword_confirm.replace(/\s\s+/g, " ");
        if (this.newPassword == "" || this.newPassword_confirm == "") {
          this.message = {
            text: "[Passowrd] cannot be blank",
            type: "error",
          };
          Bus.$emit("flash-message", this.message);
        } else if (this.newPassword != this.newPassword_confirm) {
          this.message = {
            text: "[Passowrds] not match",
            type: "error",
          };
          Bus.$emit("flash-message", this.message);
        } else {
          formData.append("password", this.newPassword);
          // formData.append("last_name", this.lastName);
          // formData.append("email", this.email);

          axios
            .patch(
              Service.getBackendURL() + "api/users/" + id + "/",
              formData,
              {
                headers: {
                  Authorization: "Token " + this.token,
                  // "Content-Type": "multipart/form-data"
                },
              }
            )
            .then((res) => {
              if (Service.isDebug) {
                console.log(res);
              }

              this.message = {
                text: "Passowrd updated",
                type: "success",
              };
              Bus.$emit("flash-message", this.message);
            })
            .catch((err) => {
              if (Service.isDebug) {
                console.log(err.response);
              }
              if (err.response.data.password) {
                this.message.text = err.response.data.password[0];
              } else {
                this.message.text = err.response.data.message;
              }
              this.message.type = "error";
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
    getMe() {
      this.token = Service.getToken();
      axios
        .get(Service.getBackendURL() + "api/my-profile/", {
          headers: {
            Authorization: "Token " + this.token,
          },
        })
        .then((res) => {
          this.me = res.data;
          this.username = res.data[0].username;
          this.firstName = res.data[0].first_name;
          this.lastName = res.data[0].last_name;
          this.email = res.data[0].email;
          if (Service.isDebug) {
            console.log(this.me);
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
    this.getMe();
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

.item {
  width: 300px;
  margin: 5px;
  flex: 0 1 calc(20% - 8px);
  /* margin-right: 10px;
  padding-left: 30px; */
}
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
</style>