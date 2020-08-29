<template>
  <div>
    <!-- <vue-headful
    :html="{
    body: {id: 'order-detail'},
    script: {'src': 'https://www.paypal.com/sdk/js?client-id=ARK4TOBHdpYvb_-HLzCXC0LnLBegQgovnQE-ErqfGLM4C8cWYKK76Ybu4HZGKocAFfHcHZWLonKM1lm9'},
    }"
    :head="{
    'meta[name]': {name: 'viewport',content:'width=device-width, initial-scale=1'},
    'meta[http-equiv]': {http-equiv: 'X-UA-Compatible', content:"IE=edge"},
    }"
    /> -->
    <h3 class="text-justify">My Order</h3>
    <div class="container">
      <div v-if="myOrder">
        <div class="header-line">
          <div>Order is</div>
          <div v-if="myOrder.status=='Submitted'" class="status-submitted">{{myOrder.status}},</div>
          <div v-else-if="myOrder.status=='Completed'" class="status-completed">{{myOrder.status}},</div>
          <div v-else-if="myOrder.status=='Cancelled'" class="status-cancelled">{{myOrder.status}},</div>
          <div>created at {{myOrder.created_at | moment("MMMM Do YYYY")}}.</div>
        </div>
        <div class="my-order-container">
          <b-container fluid>
            <!-- User Interface controls -->

            <!-- Main table element -->
            <b-table
              show-empty
              small
              stacked="md"
              :items="myOrder.order_digital_art"
              :fields="fields"
            >
              <template v-slot:cell(order_digital_art.get_title)="row">
                <b-link
                  v-on:click="gotoDigitalArtDetail(row.item.digital_art)"
                >{{row.item.get_title}}</b-link>
              </template>
              <template v-slot:cell(order_digital_art.get_price)="row">S${{ row.item.get_price }}</template>

              <template v-slot:cell(actions)="row">
                <b-button
                  v-if="myOrder.status=='Completed'"
                  variant="success"
                  class="btn btn-sm"
                  v-on:click="downloadFile(row.item)"
                >Download File</b-button>
                <div v-if="myOrder.status=='Submitted'">Download Not Available</div>
              </template>
            </b-table>
          </b-container>
        </div>

        <div v-if="myOrder.status=='Submitted'" class="checkout-cancel-btn">
          <div>Totally,</div>
          <div class="price-in-all">S${{myOrder.price_in_total}}</div>

          <div>
            <button class="btn btn-primary" v-on:click="checkout(myOrder.id)">Checkout</button>
          </div>
          <div>
            <button class="btn btn-secondary" v-on:click="cancelOrder_confirm(myOrder.id)">Cancel</button>
          </div>
          <div>
            <!-- <div id="paypal-button-container"></div> -->
          </div>
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
  name: "MyOrderDetail",
  components: {},
  data() {
    return {
      myOrder: {},
      items: [],
      fields: [
        {
          key: "order_digital_art.get_title",
          label: "Product",
          sortable: false,
          sortDirection: "desc",
        },
        {
          key: "order_digital_art.get_price",
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
    checkout(id) {
      this.$router.push({
        name: "Payment",
        params: { id: id },
      });
    },

    cancelOrder_confirm(id) {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      if (this.token) {
        this.$confirm({
          message: `Are you sure to cancel it?`,
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
              this.cancelOrder(id);
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
    cancelOrder(id) {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();

      if (this.token) {
        let formData = new FormData();
        formData.append("status", "Cancelled");
        axios
          .patch(Service.getBackendURL() + "api/order/" + id + "/", formData, {
            headers: {
              Authorization: "Token " + this.token,
            },
          })
          .then((res) => {
            if (Service.isDebug) {
              console.log(res.data);
            }
            this.updateOrderDetail(id);
            this.message = {
              text: "Order Cancelled",
              type: "success",
            };
            Bus.$emit("flash-message", this.message);
          })
          .catch((err) => {
            if (Service.isDebug) {
              console.log(err.response);
            }
          });
      }
    },
    downloadFile(order) {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      if (this.token) {
        console.log(order);

        let downloadUrl =
          Service.getBackendURL() + "media/" + order.get_download_url;
        console.log(downloadUrl);
        window.open(downloadUrl, "_blank");
      }
    },
    gotoDigitalArtDetail(id) {
      this.$router.push({
        name: "DigitalArtDetail",
        params: { id: id },
      });
    },
    getOrderDetail(id) {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      if (this.token) {
        axios
          .get(Service.getBackendURL() + "api/order/" + id + "/", {
            headers: {
              Authorization: "Token " + this.token,
              "Content-type": "multipart/form-data",
            },
          })
          .then((res) => {
            this.myOrder = res.data;
            let price_total = 0;
            // for (var i = 0; i < this.myCartDigitalArts.length; i++) {
            //   price_total =
            //     price_total +
            //     Number(this.myCartDigitalArts[i].digital_art_price);
            //   // console.log(price_total);
            // }
            this.price_total = price_total;
            if (Service.isDebug) {
              console.log(this.myOrder);
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

    updateOrderDetail(id) {
      this.timer = setTimeout(() => {
        this.getOrderDetail(id);
      }, 600);
    },
  },
  created() {
    if (this.$route.params) {
      this.getOrderDetail(this.$route.params.id);
    }
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

.item {
  width: 300px;
  margin: 5px;
  flex: 0 1 calc(20% - 8px);

} */

.header-line {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 5px;
}
.header-line div {
  padding: 3px;
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
.status-submitted {
  color: green;
  font-size: 22px;
}
.status-completed {
  color: blue;
  font-size: 22px;
}
.status-cancelled {
  color: grey;
  font-size: 22px;
}
.price-in-all {
  color: grey;
  font-size: 22px;
}
.checkout-cancel-btn {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin: 5px;
}
.checkout-cancel-btn div {
  padding: 5px;
}
</style>