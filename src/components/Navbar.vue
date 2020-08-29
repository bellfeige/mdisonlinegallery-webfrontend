<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info" class="navbar-container">
      <div class="navbar-item">
        <div>
          <b-navbar-brand to="/">Home</b-navbar-brand>
        </div>
        <div>
          <b-navbar-nav>
            <b-nav-item to="/about">About</b-nav-item>
          </b-navbar-nav>
        </div>
        <div>
          <b-navbar-nav>
            <b-nav-item to="/digital-art-products">Digital Arts</b-nav-item>
          </b-navbar-nav>
        </div>
      </div>

      <!-- <div>
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-6" placeholder="Search..."></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form>
      </div>-->

      <div>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-form @submit.prevent="login" v-if="token==null">
              <b-form-input
                id="username"
                size="sm"
                class="mr-sm-2"
                v-model="username"
                placeholder="username"
                name="username"
              ></b-form-input>
              <b-form-input
                id="password"
                size="sm"
                class="mr-sm-2"
                placeholder="password"
                type="password"
                v-model="password"
                name="password"
              ></b-form-input>

              <b-button size="sm" class="my-2 my-sm-0" type="submit">Login</b-button>
            </b-nav-form>
            <div v-else-if="token !== null" class="navbar-item">
              <div>
                <b-nav-item-dropdown right>
                  <!-- Using 'button-content' slot -->
                  <template v-slot:button-content>
                    <em class="text-white">Hello, {{displayUsername}}</em>
                  </template>
                  <!-- <b-dropdown-item>
                    <div>
                      <div v-if="userType==0">
                        <div>Role: Administrator</div>
                      </div>
                      <div v-else-if="userType==1">
                        <div>Role: Designer</div>
                      </div>
                      <div v-else-if="userType==2">
                        <div>Role: Member</div>
                      </div>
                    </div>
                  </b-dropdown-item>-->

                  <div v-if="userType==0">
                    <b-dropdown-item to="/site-settings">Site Settings</b-dropdown-item>
                  </div>
                  <div v-if="userType==0 || userType==1">
                    <b-dropdown-item to="/digital-art-products/new">Post New Product</b-dropdown-item>
                    <b-dropdown-item to="/digital-art-products/my-products">My Products</b-dropdown-item>
                  </div>

                  <b-dropdown-item to="/my-order">
                    My Orders
                    <!-- <span id="my-order">5</span> -->
                  </b-dropdown-item>

                  <b-dropdown-item to="/my-account">Account</b-dropdown-item>
                  <b-dropdown-item v-on:click="logout">Log Out</b-dropdown-item>
                </b-nav-item-dropdown>
              </div>

              <b-navbar-nav>
                <b-nav-item @click.prevent="active">
                  <img alt="My Cart" src="../assets/cart.png" />
                  <!-- <span id="my-cart">{{numberInCart}}</span> -->
                </b-nav-item>
              </b-navbar-nav>
            </div>

            <b-nav-form @submit.prevent="register" v-if="token === null">
              <b-button :to="{name:'Register'}" type="submit" size="sm" class="my-2 ml-2">Register</b-button>
            </b-nav-form>
          </b-navbar-nav>
        </b-collapse>
      </div>
    </b-navbar>
    <SidebarCart ref="active"></SidebarCart>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import { Service } from "../storage/service";
import SidebarCart from "@/components/SidebarCart.vue";

export default {
  name: "Navbar",
  components: { SidebarCart },
  data() {
    return {
      username: "",
      password: "",
      token: localStorage.getItem("user-token") || null,
      displayUsername: localStorage.getItem("displayUsername") || null,
      userType: localStorage.getItem("userType") || null,
      numberInCart: 0,
      message: {
        text: "",
        type: "",
      },
    };
  },
  methods: {
    active() {
      this.$refs.active.activate();
    },

    login() {
      this.message.text = null;
      this.message.type = null;
      axios
        .post(Service.getBackendURL() + "auth/", {
          // .post("http://127.0.0.1:8000/auth/", {
          username: this.username,
          password: this.password,
        })
        .then((resp) => {
          this.token = resp.data.token;
          if (Service.isDebug()) {
            console.log(resp);
            console.log(
              resp.data.get_user_role + typeof resp.data.get_user_role
            );
          }
          localStorage.setItem("user-token", resp.data.token);
          if (this.token) {
            localStorage.setItem("userType", resp.data.get_user_role);
            if (resp.data.full_name != "") {
              this.displayUsername = resp.data.full_name;
              localStorage.setItem("displayUsername", resp.data.full_name);
            } else {
              this.displayUsername = resp.data.username;
              localStorage.setItem("displayUsername", resp.data.username);
            }

            this.userType = resp.data.get_user_role;

            this.message = {
              text: "You've logged in",
              type: "success",
            };
            Bus.$emit("flash-message", this.message);
          }
        })
        .catch((err) => {
          localStorage.removeItem("user-token");

          if (Service.isDebug) {
            console.log("Login fail");
          }
          this.message = {
            text: "Failed to login due to incorrect username or password",
            type: "error",
          };
          Bus.$emit("flash-message", this.message);
        });
    },
    logout() {
      localStorage.removeItem("user-token");
      localStorage.removeItem("displayUsername");
      localStorage.removeItem("userType");

      this.token = null;
      // this.user_info = null;
      this.displayUsername = null;
      this.userType = null;
    },
    register() {
      console.log("Router");
    },
  },
  created() {
    this.token = Service.getToken() || null;

    if (this.token) {
      console.log("has Token");
      this.displayUsername = Service.getUsername(this.token);
      this.userType = Service.getUserType(this.token);

      if (Service.isDebug) {
        console.log(this.userType + typeof this.userType);
        // console.log("numberInCart=" + Service.getNumberInCart(this.token));
      }
      let local_username = Service.getUsername(this.token);
      let local_userType = Service.getUserType(this.token);

      if (Service.isUserTypeMatch) {
        if (Service.isDebug) {
          console.log("Matched");
        }
      } else {
        if (Service.isDebug) {
          console.log("Not Match");
        }
        localStorage.setItem("userType", res.data.get_user_role);
        this.userType = res.data.get_user_role;
      }

      // this.numberInCart = Service.getNumberInCart(this.token);
      if (Service.isDebug) {
        
      }
    }
  },
};
</script>

<style scoped>
.navbar-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.navbar-item {
  display: flex;
  flex-direction: row;
  justify-content: space-start;
  align-items: center;
}
#my-cart {
  font-size: 12px;
  background: #ff0000;
  color: #fff;
  padding: 0 5px;
  vertical-align: top;
  margin-left: -10px;
}
#my-order {
  font-size: 12px;
  background: #ff0000;
  color: #fff;
  padding: 0 5px;
  vertical-align: top;
  margin-left: -3px;
}
</style>