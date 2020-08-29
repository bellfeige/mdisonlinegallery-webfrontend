<template>
  <div class="reg-container">
    <div class="login-box">
      <h4>Sign Up for Membership</h4>
      <hr />
      <p>
        Want to become a Designer and Publish Digital Arts? Start from
        <router-link :to="{name: 'RegisterDesigner'}">Here</router-link>
      </p>
      <!-- <p>Start an New Adventure of Digital Arts</p> -->
      <form class="form-group">
        <div class="input-field text-justify">
          <label for="m_username">Username*</label>
          <input id="m_username" type="text" class="form-control" v-model="m_username" />
        </div>
        <div class="input-field text-justify">
          <label for="m_email">Email*</label>
          <input id="m_email" type="email" class="form-control" v-model="m_email" />
        </div>
        <div class="input-field text-justify">
          <label for="m_password">Password*</label>
          <input id="m_password" type="password" class="form-control" v-model="m_password" />
        </div>
        <div class="input-field text-justify">
          <label for="m_password_confirm">Confirm Password*</label>
          <input
            id="m_password_confirm"
            type="password"
            class="form-control"
            v-model="m_password_confirm"
            required
          />
        </div>
        <div class="input-field text-justify">
          <div class="agree-terms">
            <input class="agree-terms-checkbox" type="checkbox" id="checkbox" v-model="m_checked" />
            <label for="checkbox">
              I have read and agreed with the MDIS
              <router-link
                :to="{name: 'FlatTextPage',hash:'#terms-and-conditions'}"
              >Terms and Conditions</router-link>and
              <router-link :to="{name: 'FlatTextPage',hash:'#privacy-policy'}">Privacy Policy</router-link>.
            </label>
          </div>

          <!-- <ul>
            <li>
              <router-link
                :to="{name: 'FlatTextPage',hash:'#terms-and-conditions'}"
              >Terms and Conditions</router-link>
            </li>
            <li>
              <router-link :to="{name: 'FlatTextPage',hash:'#privacy-policies'}">Privacy Policies</router-link>
            </li>
          </ul>-->
        </div>
        <div class="center-align">
          <hr />
          <button v-on:click="register(2)" class="btn btn-primary btn-large">Register</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Service } from "../storage/service";

export default {
  name: "Register",

  data() {
    return {
      m_username: "",
      m_email: "",
      m_password: "",
      m_password_confirm: "",
      m_checked: false,
      d_username: "",
      d_email: "",
      d_password: "",
      d_password_confirm: "",
      d_checked: false,
      message: {
        text: "",
        type: "",
      },
    };
  },
  methods: {
    gotoDocs(bookmark) {
      this.$router.push({
        name: "FlatTextPage",
        params: { bookmark: bookmark },
      });
    },
    register(userType) {
      this.message.text = null;
      this.message.type = null;
      let is_member = 0;
      let is_designer = 0;
      let username = "";
      let email = "";
      let password = "";
      let password_confirm = "";
      let checked = false;
      if (userType == 1) {
        is_member = 0;
        is_designer = 1;
        username = this.d_username;
        email = this.d_email;
        password = this.d_password;
        password_confirm = this.d_password_confirm;
        checked = this.d_checked;
      } else if (userType == 2) {
        is_member = 1;
        is_designer = 0;
        username = this.m_username;
        email = this.m_email;
        password = this.m_password;
        password_confirm = this.m_password_confirm;
        checked = this.m_checked;
      }
      username = username.replace(/\s\s+/g, " ");
      email = email.replace(/\s\s+/g, " ");
      if ((username == " ") | (username == "")) {
        this.message = {
          text: "[Username] cannot be blank",
          type: "error",
        };
        Bus.$emit("flash-message", this.message);
      } else if ((email == " ") | (email == "")) {
        this.message = {
          text: "[Email] cannot be blank",
          type: "error",
        };
        Bus.$emit("flash-message", this.message);
      } else if ((password == " ") | (password == "")) {
        this.message = {
          text: "[Password] cannot be blank",
          type: "error",
        };
        Bus.$emit("flash-message", this.message);
      } else if (password != password_confirm) {
        this.message = {
          text: "[Password] not match",
          type: "error",
        };
        Bus.$emit("flash-message", this.message);
      } else if (checked == false) {
        this.message = {
          text:
            "You need to agree to the [terms] before completing the registration",
          type: "error",
        };
        Bus.$emit("flash-message", this.message);
      } else {
        axios
          .post(Service.getBackendURL() + "api/users/", {
            username: username,
            email: email,
            password: password,
            is_member: is_member,
            is_designer: is_designer,
          })
          .then((res) => {
            if (Service.isDebug) {
              console.log(res);
            }
            if (res.status == 201) {
              this.message = {
                text:
                  "Welcome! You have successfully signed up and are able to log in",
                type: "success",
              };
              Bus.$emit("flash-message", this.message);

              this.$router.push({
                path: "/",
              });
            }
          })
          .catch((err) => {
            if (Service.isDebug) {
              console.log(err.response);
            }

            if (err.response.data.message) {
              this.message.text = err.response.data.message;
            } else if (err.response.data.username[0]) {
              this.message.text = err.response.data.username[0];
            }
            this.message.type = "error";
            Bus.$emit("flash-message", this.message);
          });
      }
    },
  },
};
</script>

<style scoped>
h4 {
  text-align: center;
  margin: 0;
  padding: 0;
  font-weight: 800;
  font-size: 18px;
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
.reg-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.input-field {
  margin-top: 10px;
}
.agree-terms {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: baseline;
}
.agree-terms-checkbox {
  margin-right: 5px;
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