<template>
  <div>
    <div class="price-top">
      <div>Totally,</div>
      <div class="price-in-all">S${{myOrder.price_in_total}}</div>
      <div>for payment. Enter your Card Number and click Contiune</div>
    </div>

    <VCreditCard @change="creditInfoChanged" />
    <div v-if="myOrder">
      <!-- <div>Order: {{myOrder.order_digital_art[0].get_title}} and other {{myOrder.order_digital_art.length-1}} product(s)</div> -->
      <!-- <div>{{myOrder.order_digital_art.length}} product(s) inclued in this order</div> -->

      <div class="checkout-back">
        <div>
          <button class="btn btn-primary" v-on:click="confirmPayment(myOrder.id)">Contiune</button>
        </div>
        <div>
          <button class="btn btn-secondary" v-on:click="gotoOrderDetail(myOrder.id)">Back</button>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import axios from "axios";
import { Service } from "../storage/service";
import VCreditCard from "v-credit-card";
import "v-credit-card/dist/VCreditCard.css";

export default {
  name: "Payment",
  components: { VCreditCard },
  data() {
    return {
      myOrder: {},
      creditInfo: {},
      message: {
        text: "",
        type: "",
      },
    };
  },
  methods: {
    creditInfoChanged(values) {
      this.creditInfo = values;
      console.log("Credit card fields", values);
    },
    confirmPayment(id) {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();

      if (this.token) {
        let formData = new FormData();
        formData.append("status", "Completed");
        axios
          .patch(Service.getBackendURL() + "api/order/" + id + "/", formData, {
            headers: {
              Authorization: "Token " + this.token,
            },
          })
          .then((res) => {
            if (Service.isDebug) {
              console.log(res.data);

              this.message = {
                text: "Payment completed",
                type: "success",
              };
              Bus.$emit("flash-message", this.message);
              this.gotoOrderDetail(this.myOrder.id);
            }
          })
          .catch((err) => {
            if (Service.isDebug) {
              console.log(err.response);
            }
          });
      }
    },
    gotoOrderDetail(id) {
      this.$router.push({
        name: "MyOrderDetail",
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
  },
  created() {
    if (this.$route.params) {
      this.getOrderDetail(this.$route.params.id);
    }
  },
};
</script>

<style>
.checkout-back {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 5px;
}
.checkout-back div {
  padding: 5px;
}
.price-top {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 5px;
}
.price-top  div {
  padding: 5px;
}
.price-in-all {
  color: grey;
  font-size: 22px;
}
</style>