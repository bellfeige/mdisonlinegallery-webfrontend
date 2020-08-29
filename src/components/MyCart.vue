<template>
  <div>
    <!-- <h1 class="text-justify">My Cart</h1> -->
    <div class>
      <div v-if="myCartDigitalArts.length>0">
        <div class="cart-container">
          <b-container fluid>
            <!-- User Interface controls -->

            <!-- Main table element -->
            <b-table show-empty small stacked="md" :items="myCartDigitalArts" :fields="fields">
              <template v-slot:cell(digital_art)="row">
                <!-- <b-link 
                  v-on:click="gotoDigitalArtDetail(row.item.digital_art_id)"
                >{{row.item.digital_art}}</b-link>-->
                <router-link
                  :to="{ name: 'DigitalArtDetail', params: { id: row.item.digital_art_id } }"
                >{{row.item.digital_art}}</router-link>
              </template>
              <template v-slot:cell(digital_art_price)="row">S${{ row.item.digital_art_price }}</template>

              <template v-slot:cell(actions)="row">
                <b-link v-on:click="removeFromCart_confirm(row.item.id)">
                  <img src="../assets/remove.png" width="20px" />
                </b-link>
              </template>
            </b-table>
          </b-container>
        </div>

        <div class="price-in-all-place-order">
          <div class="price-in-all price-in-all-place-order-item">S${{price_total}}</div>
          <div>
            <button
              class="btn btn-lg btn-info price-in-all-place-order-item"
              v-on:click="placeOrder()"
            >Place Order</button>
          </div>
        </div>
      </div>
      <div v-else>Your cart is empty.</div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import { Service } from "../storage/service";

export default {
  name: "MyCart",
  components: {},
  data() {
    return {
      myCartDigitalArts: {},
      price_total: 0,
      items: [],
      fields: [
        {
          key: "digital_art",
          label: "Products",
          sortable: false,
          sortDirection: "desc",
        },
        {
          key: "digital_art_price",
          label: "Price",
          sortable: false,
          sortDirection: "desc",
        },

        { key: "actions", label: "Actions" },
      ],
      message: {
        text: "",
        type: "",
      },
    };
  },
  methods: {
    placeOrder() {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      if (this.token) {
        axios
          .post(
            Service.getBackendURL() + "api/order/",
            {},
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
              text: "Order has been placed",
              type: "success",
            };
            Bus.$emit("flash-message", this.message);
            this.gotoOrderDetail(res.data.result.id);
            // this.updateCart();
          })
          .catch((err) => {
            if (Service.isDebug) {
              console.log(err.response);
            }
            if (err.response.data.detail) {
              this.message.text = err.response.data.detail;
            } else {
              this.message.text = err.response.data.message;
            }

            this.message.type = "error";
            Bus.$emit("flash-message", this.message);
          });
      }
    },
    gotoOrderDetail(id) {
      this.$router.push({
        name: "MyOrderDetail",
        params: { id: id },
      });
    },
    removeFromCart_confirm(id) {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      if (this.token) {
        this.$confirm({
          message: `Are you sure to remove it from cart?`,
          button: {
            no: "No",
            yes: "Yes",
          },
          /**
           * Callback Function
           * @param {Boolean} confirm
           */
          callback: (confirm) => {
            if (confirm) {
              this.removeFromCart(id);
            }
          },
        });
      } else {
        this.message = {
          text: "Please log in first",
          type: "error",
        };
        Bus.$emit("flash-message", this.message);
      }
    },
    removeFromCart(id) {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      console.log(id);

      axios
        .delete(Service.getBackendURL() + "api/cart/" + id + "/", {
          headers: {
            Authorization: "Token " + this.token,
          },
        })
        .then((res) => {
          if (Service.isDebug) {
            console.log(res);
          }

          this.message = {
            text: "Removed from cart",
            type: "success",
          };
          Bus.$emit("flash-message", this.message);
          this.updateCart();
        })
        .catch((err) => {
          if (Service.isDebug) {
            console.log(err.response);
          }

          this.message.text = err.response.data.message;
          this.message.type = "error";
          Bus.$emit("flash-message", this.message);
        });
    },
    gotoDigitalArtDetail(id) {
      this.$router.push({
        name: "DigitalArtDetail",
        params: { id: id },
      });
    },
    getMyCart() {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      if (this.token) {
        axios
          .get(Service.getBackendURL() + "api/cart/", {
            headers: {
              Authorization: "Token " + this.token,
              "Content-type": "multipart/form-data",
            },
          })
          .then((res) => {
            this.myCartDigitalArts = res.data;
            // Bus.$emit("count-in-cart", this.myCartDigitalArts.length);
            let price_total = 0;
            for (var i = 0; i < this.myCartDigitalArts.length; i++) {
              price_total =
                price_total +
                Number(this.myCartDigitalArts[i].digital_art_price);
              // console.log(price_total);
            }
            this.price_total = price_total;
            if (Service.isDebug) {
              console.log(this.myCartDigitalArts);
            }
          })
          .catch((err) => {
            if (Service.isDebug) {
              console.log(err.response);
            }
          });
      } else {
        this.message = {
          text: "Please log in first",
          type: "error",
        };
        Bus.$emit("flash-message", this.message);
      }
    },

    updateCart() {
      this.timer = setTimeout(() => {
        this.getMyCart();
      }, 600);
    },
  },
  created() {
    this.getMyCart();
  },
};
</script>

<style scoped>
/* .container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
}
*/
/* .cart-container {
  margin: 5px;
  padding: 5px;
} */
.price-in-all-place-order {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.price-in-all-place-order-item {
  margin: 5px;
  padding: 5px;
}

.price-in-all {
  color: grey;
  font-size: 22px;
}
</style>