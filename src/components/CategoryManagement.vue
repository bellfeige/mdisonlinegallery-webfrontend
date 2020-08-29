<template>
  <div class="CategoryManagement">
    <h4 class="row">Manage Categories of Digital Products</h4>
    <!-- <div class="add-and-edit">
      <div>
        <form class="form-group row">
          <div>
            <label for="newCategory" class="new-item">Add a new Category:</label>
            <input class="new-item" id="newCategory" type="text" v-model="newCategory" required />
          </div>

          <div class="new-item">
            <button v-on:click="addCategory()" class="btn btn-primary btn-sm">Add</button>
          </div>
        </form>
      </div>
      <div>
        <button
          v-if="editingEnabled==false"
          v-on:click="enableEditing()"
          class="btn btn-info btn-sm new-item"
        >Edit Categories</button>
        <button
          v-if="editingEnabled==true"
          v-on:click="enableEditing()"
          class="btn btn-warning btn-sm new-item"
        >Disable Editing</button>
      </div>
    </div>-->

    <div>
      <b-container fluid>
        <!-- User Interface controls -->
        <b-row>
          <!-- <b-col lg="6" class="my-1">
            <b-form-group
              label="Sort"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              label-for="sortBySelect"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-select
                  v-model="sortBy"
                  id="sortBySelect"
                  :options="sortOptions"
                  class="w-75"
                >
                  <template v-slot:first>
                    <option value>-- none --</option>
                  </template>
                </b-form-select>
                <b-form-select v-model="sortDesc" size="sm" :disabled="!sortBy" class="w-25">
                  <option :value="false">Asc</option>
                  <option :value="true">Desc</option>
                </b-form-select>
              </b-input-group>
            </b-form-group>
          </b-col>

          <b-col lg="6" class="my-1">
            <b-form-group
              label="Initial sort"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              label-for="initialSortSelect"
              class="mb-0"
            >
              <b-form-select
                v-model="sortDirection"
                id="initialSortSelect"
                size="sm"
                :options="['asc', 'desc', 'last']"
              ></b-form-select>
            </b-form-group>
          </b-col>-->

          <b-col lg="6" class="my-1">
            <b-form-group
              label="New Category:"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              label-for="newCategory"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                  v-model="newCategory"
                  id="newCategory"
                  placeholder="New category name"
                ></b-form-input>
                <b-input-group-append>
                  <b-button v-on:click="addCategory()" class="btn btn-info">Add</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>

          <b-col>
            <div>
              <b-button
                v-if="editingEnabled==false"
                v-on:click="enableEditing()"
                class="btn btn-info btn-sm new-item"
              >Edit Categories</b-button>
              <b-button
                v-if="editingEnabled==true"
                v-on:click="enableEditing()"
                class="btn-warning btn-sm new-item"
              >Disable Editing</b-button>
            </div>
          </b-col>

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

          <!-- <b-col lg="6" class="my-1">
            <b-form-group
              label="Filter On"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              description="Leave all unchecked to filter on all data"
              class="mb-0"
            >
              <b-form-checkbox-group v-model="filterOn" class="mt-1">
                <b-form-checkbox value="name">Name</b-form-checkbox>
                <b-form-checkbox value="age">Age</b-form-checkbox>
                <b-form-checkbox value="isActive">Active</b-form-checkbox>
              </b-form-checkbox-group>
            </b-form-group>
          </b-col>-->

          <!-- <b-col sm="5" md="6" class="my-1">
            <b-form-group
              label="Per page"
              label-cols-sm="6"
              label-cols-md="4"
              label-cols-lg="3"
              label-align-sm="right"
              label-size="sm"
              label-for="perPageSelect"
              class="mb-0"
            >
              <b-form-select v-model="perPage" id="perPageSelect" size="sm" :options="pageOptions"></b-form-select>
            </b-form-group>
          </b-col>-->

          <!-- <b-col sm="7" md="6" class="my-1">
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
          </b-col>-->
        </b-row>

        <!-- Main table element -->
        <b-table
          show-empty
          small
          stacked="md"
          :items="categories"
          :fields="fields"
          :filter="filter"
        >
          <template v-if="editingEnabled==false" v-slot:cell(name)="row">{{ row.item.name }}</template>
          <template v-if="editingEnabled==true" v-slot:cell(name)="row">
            <input type="text" v-model="row.item.name" />
          </template>

          <template v-slot:cell(actions)="row">
            <!-- <b-button
              size="sm"
              @click="info(row.item, row.index, $event.target)"
              class="mr-1"
            >Info modal</b-button>
            <b-button
              size="sm"
              @click="row.toggleDetails"
              class="mr-1"
            >{{ row.detailsShowing ? 'Hide' : 'Show' }} Details</b-button>-->

            <b-button
              size="sm"
              v-on:click="deleteCategory_confirm(row.item)"
              class="mr-1 btn-danger"
            >Delete</b-button>
          </template>

          <!-- <template v-slot:row-details="row">
            <b-card>
              <ul>
                <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
              </ul>
            </b-card>
          </template>-->
        </b-table>

        <!-- Info modal -->
        <!-- <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
          <pre>{{ infoModal.content }}</pre>
        </b-modal>-->

        <!-- <b-col sm="7" md="6" class="my-1">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
          ></b-pagination>
        </b-col>-->

        <div v-if="editingEnabled==true">
          <button v-on:click="editCategory(categories)" class="btn btn-info btn-sm">Update</button>
        </div>
      </b-container>
    </div>

    <!-- <div class="container">
      <b-container class>
        <b-row>
          <b-col>Category Name</b-col>
          <b-col>Action</b-col>
        </b-row>
        <b-row v-bind:key="category.id" v-for="category in categories">
          <b-col v-if="editingEnabled==false">{{category.name}}</b-col>
          <b-col v-if="editingEnabled==false">
            <button
              v-on:click="deleteCategory_confirm(category)"
              class="btn btn-danger btn-sm"
            >Delete</button>
          </b-col>
          <b-col v-if="editingEnabled==true">
            <input type="text" v-model="category.name" />
            <button
              v-on:click="deleteCategory_confirm(category)"
              class="btn btn-danger btn-sm"
            >Delete</button>
          </b-col>
        </b-row>
      </b-container>
      <div v-if="editingEnabled==true">
        <button v-on:click="editCategory(categories)" class="btn btn-info btn-sm">Update</button>
      </div>
    </div>-->
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import { Service } from "../storage/service";

export default {
  name: "CategoryManagement",
  components: {},
  data() {
    return {
      newCategory: "",
      categories: {},
      editingEnabled: false,
      items: [],
      fields: [
        {
          key: "name",
          label: "Category Name",
          sortable: true,
          sortDirection: "desc"
        },

        { key: "actions", label: "Actions" }
      ],
      // totalRows: 1,
      // currentPage: 1,
      // perPage: 0,
      // pageOptions: [5, 10, 15],
      // sortBy: "",
      // sortDesc: false,
      // sortDirection: "asc",
      filter: null,
      // filterOn: [],
      // infoModal: {
      //   id: "info-modal",
      //   title: "",
      //   content: ""
      // },
      message: {
        text: "",
        type: ""
      }
    };
  },
  // computed: {
  //   sortOptions() {
  //     // Create an options list from our fields
  //     return this.fields
  //       .filter(f => f.sortable)
  //       .map(f => {
  //         return { text: f.label, value: f.key };
  //       });
  //   }
  // },
  // mounted() {
  //   // Set the initial number of items
  //   this.totalRows = this.items.length;
  // },
  methods: {
    // info(item, index, button) {
    //   this.infoModal.title = `Row index: ${index}`;
    //   this.infoModal.content = JSON.stringify(item, null, 2);
    //   this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    // },
    // resetInfoModal() {
    //   this.infoModal.title = "";
    //   this.infoModal.content = "";
    // },
    // onFiltered(filteredItems) {
    //   // Trigger pagination to update the number of buttons/pages due to filtering
    //   this.totalRows = filteredItems.length;
    //   this.currentPage = 1;
    // },
    addCategory() {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      let formData = new FormData();
      if (this.token) {
        formData.append("name", this.newCategory);
        axios
          .post(Service.getBackendURL() + "api/product-categories/", formData, {
            headers: {
              Authorization: "Token " + this.token,
              "Content-type": "multipart/form-data"
            }
          })
          .then(res => {
            if (Service.isDebug) {
              console.log(res);
            }

            this.message = {
              text: "New Category [" + this.newCategory + "] is added",
              type: "success"
            };
            Bus.$emit("flash-message", this.message);
            this.updateCategories();
          })
          .catch(err => {
            if (Service.isDebug) {
              console.log(err.response);
            }
            if (err.response.data.name) {
              this.message.text = err.response.data.name[0];
            } else {
              this.message.text = err.response.data.message;
            }
            this.message.type = "error";
            Bus.$emit("flash-message", this.message);
          });
      } else {
        this.message = {
          text: "Only site admin can manage categories",
          type: "error"
        };
        Bus.$emit("flash-message", this.message);
      }
    },
    deleteCategory_confirm(category) {
      this.token = Service.getToken();
      if (this.token) {
        this.$confirm({
          message: `Are you sure to delete this category?`,
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
              this.deleteCategory(category);
            }
          }
        });
      } else {
        this.message = {
          text: "Only site admin can manage categories",
          type: "error"
        };
        Bus.$emit("flash-message", this.message);
      }
    },

    deleteCategory(category) {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();

      axios
        .delete(
          Service.getBackendURL() +
            "api/product-categories/" +
            category.id +
            "/",
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
            text: "Category [" + category.name + "] is deleted",
            type: "success"
          };
          Bus.$emit("flash-message", this.message);
          this.updateCategories();
        })
        .catch(err => {
          if (Service.isDebug) {
            console.log(err.response);
          }
          if (err.response.data.name) {
            this.message.text = err.response.data.name[0];
          } else {
            this.message.text = err.response.data.message;
          }
          this.message.type = "error";
          Bus.$emit("flash-message", this.message);
        });
    },
    enableEditing() {
      this.editingEnabled = !this.editingEnabled;
    },

    editCategory() {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      if (this.token) {
        var axiosRquests = new Array();
        // console.log(this.categories);
        for (var i = 0; i < this.categories.length; i++) {
          let url =
            Service.getBackendURL() +
            "api/product-categories/" +
            this.categories[i].id +
            "/";
          // console.log(url);
          var formData = new FormData();
          formData.append("name", this.categories[i].name);
          let request = axios.put(url, formData, {
            headers: {
              Authorization: "Token " + this.token,
              "Content-type": "multipart/form-data"
            }
          });
          axiosRquests.push(request);
        }

        axios
          .all(axiosRquests)
          .then(res => {
            if (Service.isDebug) {
              console.log(res);
            }
            this.enableEditing();
            this.updateCategories();

            this.message = {
              text: "Categories updated",
              type: "success"
            };
            Bus.$emit("flash-message", this.message);
            this.updateCategories();
          })
          .catch(err => {
            if (Service.isDebug) {
              console.log(err.response);
            }
            if (err.response.data.name) {
              this.message.text = err.response.data.name[0];
            } else {
              this.message.text = err.response.data.message;
            }
            this.message.type = "error";
            Bus.$emit("flash-message", this.message);
          });
      } else {
        this.message = {
          text: "Only site admin can manage categories",
          type: "error"
        };
        Bus.$emit("flash-message", this.message);
      }
    },

    getCategories() {
      // var item = new FormData();
      axios
        .get(Service.getBackendURL() + "api/product-categories/")
        .then(res => {
          this.categories = res.data;
          if (Service.isDebug) {
            console.log(this.categories);
          }
        })
        .catch(err => {
          if (Service.isDebug) {
            console.log(err.response);
          }
        });
    },
    updateCategories() {
      this.timer = setTimeout(() => {
        this.getCategories();
      }, 600);
    }
  },
  created() {
    this.editingEnabled = false;
    this.getCategories();
    // console.log(this.editingEnabled);
  }
};
</script>

<style scoped>
.CategoryManagement {
  margin: 0 50px 0 50px;
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.item {
  margin: 5px 0 5px 0;
  padding: 5px 0 5px 0;
}
.new-item {
  margin: 0 5px 0 5px;
}
.add-and-edit {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
