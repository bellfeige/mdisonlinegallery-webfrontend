<template>
  <div>
    <h3 class="text-justify">My Orders</h3>
    <div class="container">
      <div v-if="myOrders.length>0">
        <div class="my-order-container">
          <b-container fluid>
            <!-- User Interface controls -->

            <!-- Main table element -->
            <b-table show-empty small stacked="md" :items="myOrders" :fields="fields">
              <template v-slot:cell(order_digital_art[0].get_title)="row">
                <b-link
                  v-on:click="gotoOrderDetail(row.item.id)"
                >{{row.item.order_digital_art[0].get_title}}</b-link>
              </template>
              <template v-slot:cell(price_in_total)="row">S${{ row.item.price_in_total }}</template>
              <template
                v-slot:cell(created_at)="row"
              >{{ row.item.created_at | moment("MMMM Do YYYY") }}</template>
              <template v-slot:cell(actions)="row">
                <b-button
                  v-if="row.item.status=='Submitted'"
                  variant="success"
                  class="btn btn-sm"
                  v-on:click="checkout(row.item.id)"
                >Checkout</b-button>
                <b-button
                  v-if="row.item.status=='Completed'"
                  class="btn btn-sm"
                  variant="info"
                  v-on:click="gotoOrderDetail(row.item.id)"
                >Go to Download</b-button>
              </template>
            </b-table>
          </b-container>
        </div>
      </div>
      <div v-else>There is no history order.</div>
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
      myOrders: {},
      items: [],
      fields: [
        {
          key: "order_digital_art[0].get_title",
          label: "Order",
          sortable: false,
          sortDirection: "desc"
        },
        {
          key: "price_in_total",
          label: "Price",
          sortable: false,
          sortDirection: "desc"
        },
        {
          key: "created_at",
          label: "Created at",
          sortable: false,
          sortDirection: "desc"
        },
        {
          key: "status",
          label: "Status",
          sortable: false,
          sortDirection: "desc"
        },

        { key: "actions", label: "Actions" }
      ],
      message: {
        text: "",
        type: ""
      }
    };
  },
  methods: {
    gotoOrderDetail(id) {
      this.$router.push({
        name: "MyOrderDetail",
        params: { id: id }
      });
    },
    checkout(id) {
      this.$router.push({
        name: "Payment",
        params: { id: id }
      });
    },
    checkoutOrder(id) {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();

      if (this.token) {
        let formData = new FormData();
        formData.append("status", "Completed");
        axios
          .patch(Service.getBackendURL() + "api/order/" + id + "/", formData, {
            headers: {
              Authorization: "Token " + this.token
            }
          })
          .then(res => {
            if (Service.isDebug) {
              console.log(res.data);
            }
            this.updateOrder(id);
          })
          .catch(err => {
            if (Service.isDebug) {
              console.log(err.response);
            }
          });
      }
    },
    // downloadFile(order) {
    //   this.message.text = null;
    //   this.message.type = null;
    //   this.token = Service.getToken();
    //   if (this.token) {
    //     console.log(order.order_digital_art);
    //     for (var i = 0; i < order.order_digital_art.length; i++) {
    //       let downloadUrl =
    //         Service.getBackendURL() +
    //         "media/" +
    //         order.order_digital_art[i].get_download_url;
    //       console.log(downloadUrl);
    //       window.open(downloadUrl, "_blank");
    //     }
    //   }
    // },
    getMyOrder() {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      if (this.token) {
        axios
          .get(Service.getBackendURL() + "api/order/", {
            headers: {
              Authorization: "Token " + this.token,
              "Content-type": "multipart/form-data"
            }
          })
          .then(res => {
            this.myOrders = res.data;
            if (Service.isDebug) {
              console.log(this.myOrders);
            }
          })
          .catch(err => {
            if (Service.isDebug) {
              console.log(err.response);
            }
          });
      } else {
        this.message = {
          text: "Please log in first",
          type: "error"
        };
        Bus.$emit("flash-message", this.message);
      }
    },

    updateOrder() {
      this.timer = setTimeout(() => {
        this.getMyOrder();
      }, 600);
    }
  },
  created() {
    this.getMyOrder();
  }
};
</script>

<style scoped>
.my-order-container {
  margin: 15px;
  padding: 15px;
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