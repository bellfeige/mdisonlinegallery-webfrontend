<template>
  <div v-if="digitalArts.length>0">
    <h1 class="text-justify">My Digital Arts</h1>
    <div>
      <b-container fluid>
        <!-- User Interface controls -->
        <b-row>
          <b-col lg="6" class="my-1">
            <b-form-group
              label="Filter"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              label-for="filterInput"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                  v-model="filter"
                  type="search"
                  id="filterInput"
                  placeholder="Type to Search"
                ></b-form-input>
                <b-input-group-append>
                  <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Main table element -->
        <b-table
          show-empty
          small
          stacked="md"
          :items="digitalArts"
          :fields="fields"
          :filter="filter"
        >
          <template v-slot:cell(category)="row">{{ row.item.category }}</template>
          <template v-slot:cell(category)="row">{{ row.item.category }}</template>
          <template v-slot:cell(price)="row">{{ row.item.price }}</template>
          <template v-slot:cell(created_at)="row">{{ row.item.created_at | moment("MMMM Do YYYY") }}</template>

          <template v-slot:cell(actions)="row">
            <b-button
              size="sm"
              v-on:click="gotoDigitalArtEdit(row.item)"
              class="mr-1 btn btn-info"
            >Edit</b-button>
            <b-button
              size="sm"
              v-on:click="deleteDigitalArt_confirm(row.item)"
              class="mr-1 btn btn-danger"
            >Delete</b-button>
          </template>
        </b-table>
      </b-container>
    </div>

    <!-- <div class="container">
      <div v-bind:key="digitalArt.id" v-for="digitalArt in digitalArts" style="margin-bottom:25px">
        <div class="item" v-on:click="gotoDigitalArtDetail(digitalArt)">
          <img :src="digitalArt.previewImgs[0].image" style="width:100%" />
        </div>
        <button class="btn2link" v-on:click="gotoDigitalArtDetail(digitalArt)">{{digitalArt.title}}</button>
      </div>
    </div>-->
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import { Service } from "../storage/service";

export default {
  name: "MyDigitalArtList",
  components: {},
  data() {
    return {
      digitalArts: {},
      items: [],
      fields: [
        {
          key: "title",
          label: "Title",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "category",
          label: "Category",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "price",
          label: "Price (S$)",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "created_at",
          label: "Created at",
          sortable: true,
          sortDirection: "desc"
        },

        { key: "actions", label: "Actions" }
      ],
      filter: null,
      message: {
        text: "",
        type: ""
      }
    };
  },
  methods: {
    gotoDigitalArtEdit(digitalArt) {
      this.$router.push({
        name: "DigitalArtEdit",
        params: { id: digitalArt.id }
      });
    },
    deleteDigitalArt_confirm(digitalArt) {
      this.token = Service.getToken();
      if (this.token) {
        this.$confirm({
          message: `Are you sure to delete this products?`,
          button: {
            no: "No",
            yes: "Yes"
          },
          /**
           * Callback Function
           * @param {Boolean} confirm
           */
          callback: confirm => {
            if (confirm) {
              this.deleteDigitalArt(digitalArt);
            }
          }
        });
      } else {
        this.message = {
          text: "Only site admin can manage member",
          type: "error"
        };
        Bus.$emit("flash-message", this.message);
      }
    },

    deleteDigitalArt(digitalArt) {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      console.log(digitalArt.id);

      axios
        .delete(
          Service.getBackendURL() + "api/products/" + digitalArt.id + "/",
          {
            headers: {
              Authorization: "Token " + this.token
            }
          }
        )
        .then(res => {
          if (Service.isDebug) {
            console.log(res);
          }

          this.message = {
            text: "[" + digitalArt.title + "] has been deleted",
            type: "success"
          };
          Bus.$emit("flash-message", this.message);
          this.updateDigitalArts();
        })
        .catch(err => {
          if (Service.isDebug) {
            console.log(err.response);
          }
          if (err.response.data.message) {
            this.message.text = err.response.data.message;
          }
          this.message.type = "error";
          Bus.$emit("flash-message", this.message);
        });
    },
    getDigitalArts() {
      this.token = Service.getToken();
      if (this.token) {
        axios
          .get(Service.getBackendURL() + "api/my-products/", {
            headers: {
              Authorization: "Token " + this.token,
              "Content-type": "multipart/form-data"
            }
          })
          .then(res => {
            this.digitalArts = res.data;
            if (Service.isDebug) {
              console.log(this.digitalArts);
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
    updateDigitalArts() {
      this.timer = setTimeout(() => {
        this.getDigitalArts();
      }, 600);
    }
  },
  created() {
    this.getDigitalArts();
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
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