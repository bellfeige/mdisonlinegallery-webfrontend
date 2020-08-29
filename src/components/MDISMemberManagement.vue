<template>
  <div class="MDISMemberManagement">
    <h4 class="row">MDIS Membership Management</h4>
    <!-- <div class="add-and-edit">
      <div>
        <form class="form-group row">
          <div>
            <label class="new-item">Add a new MDIS member:</label>
            <input
              class="new-item"
              id="newMembershipId"
              type="text"
              v-model="newMember_id"
              placeholder="Member ID"
              required
            />
            <input
              class="new-item"
              id="newMembershipEmail"
              type="email"
              v-model="newMember_email"
              placeholder="Member Email"
              required
            />
          </div>
          <div class="new-item">
            <button v-on:click="addMember()" class="btn btn-primary btn-sm">Add</button>
          </div>
        </form>
      </div>
      <div>
        <button
          v-if="editingEnabled==false"
          v-on:click="enableEditing()"
          class="btn btn-info btn-sm new-item"
        >Edit Members</button>
        <button
          v-if="editingEnabled==true"
          v-on:click="enableEditing()"
          class="btn btn-warning btn-sm new-item"
        >Disable Editing</button>
      </div>
    </div>

   
    <div class="container">
      <div v-bind:key="member.id" v-for="member in members" class="item row">
        <div v-if="editingEnabled==true">
          <div>
            <input class="ml-2" type="text" placeholder="Member ID" v-model="member.member_id" />
          </div>
          <div>
            <input class="ml-2" type="text" placeholder="Member Email" v-model="member.email" />
          </div>
        </div>

        <div v-if="editingEnabled==false">
          <div class="ml-2">{{member.member_id}}</div>
          <div class="ml-2">{{member.email}}</div>
        </div>

        <button
          v-if="editingEnabled==false"
          v-on:click="deleteMember_confirm(member)"
          class="btn btn-danger btn-sm"
        >Delete</button>
      </div>
      <div v-if="editingEnabled==true">
        <button v-on:click="editMember(members)" class="btn btn-info btn-sm">Update</button>
      </div>
    </div>-->

    <div>
      <b-container fluid>
        <!-- User Interface controls -->
        <b-row>
          <b-col lg="6" class="my-1">
            <b-form-group
              label="New Member:"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              label-for="newMember"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input v-model="newMember_id" id="newMember" placeholder="Member ID"></b-form-input>
                <b-form-input
                  v-model="newMember_email"
                  type="email"
                  id="newEmail"
                  placeholder="Member Email"
                ></b-form-input>
                <b-input-group-append>
                  <b-button v-on:click="addMember()" class="btn btn-info">Add</b-button>
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
              >Edit Members</b-button>
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
        </b-row>

        <!-- Main table element -->
        <b-table show-empty small stacked="md" :items="members" :fields="fields" :filter="filter">
          <template
            v-if="editingEnabled==false"
            v-slot:cell(member_id)="row"
          >{{ row.item.member_id }}</template>
          <template v-if="editingEnabled==false" v-slot:cell(email)="row">{{ row.item.email }}</template>

          <template v-if="editingEnabled==true" v-slot:cell(member_id)="row">
            <input type="text" v-model="row.item.member_id " />
          </template>
          <template v-if="editingEnabled==true" v-slot:cell(email)="row">
            <input type="email" v-model="row.item.email " />
          </template>
          <template v-slot:cell(actions)="row">
            <b-button
              size="sm"
              v-on:click="deleteMember_confirm(row.item)"
              class="mr-1 btn-danger"
            >Delete</b-button>
          </template>
        </b-table>

        <div v-if="editingEnabled==true">
          <button v-on:click="editMember(members)" class="btn btn-info btn-sm">Update</button>
        </div>
      </b-container>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import Category from '@/components/Category.vue'
import axios from "axios";
import { Service } from "../storage/service";

export default {
  name: "MDISMemberManagement",
  components: {},
  data() {
    return {
      newMember_id: "",
      newMember_email: "",
      members: {},
      editingEnabled: false,
      items: [],
      fields: [
        {
          key: "member_id",
          label: "MDIS Member ID",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "email",
          label: "Email",
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
    addMember() {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      let formData = new FormData();
      if (this.token) {
        formData.append("member_id", this.newMember_id);
        formData.append("email", this.newMember_email);
        // console.log(formData);
        axios
          .post(Service.getBackendURL() + "api/mdis-members/", formData, {
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
              text: "New MDIS member [" + this.newMember_id + "] is added",
              type: "success"
            };
            Bus.$emit("flash-message", this.message);
            this.updateMembers();
          })
          .catch(err => {
            if (Service.isDebug) {
              console.log(err.response);
            }
            if (err.response.data.member_id) {
              this.message.text = err.response.data.member_id[0];
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
          text: "Only site admin can manage membership",
          type: "error"
        };
        Bus.$emit("flash-message", this.message);
      }
    },
    deleteMember_confirm(member) {
      this.token = Service.getToken();
      if (this.token) {
        this.$confirm({
          message: `Are you sure to delete this member?`,
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
              this.deleteMember(member);
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

    deleteMember(member) {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      console.log(member.id);

      axios
        .delete(
          Service.getBackendURL() + "api/mdis-members/" + member.id + "/",
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
            text: "MDIS Member [" + member.member_id + "] is deleted",
            type: "success"
          };
          Bus.$emit("flash-message", this.message);
          this.updateMembers();
        })
        .catch(err => {
          if (Service.isDebug) {
            console.log(err.response);
          }
          if (err.response.data.member_id) {
            this.message.text = err.response.data.member_id[0];
          } else if (err.response.data.email) {
            this.message.text = err.response.data.email[0];
          } else {
            this.message.text = err.response.data.message;
          }
          this.message.type = "error";
          Bus.$emit("flash-message", this.message);
        });
    },
    enableEditing() {
      this.editingEnabled = !this.editingEnabled;
      console.log(this.editingEnabled);
    },

    editMember() {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      if (this.token) {
        var axiosRquests = new Array();
        console.log(this.members);
        for (var i = 0; i < this.members.length; i++) {
          let url =
            Service.getBackendURL() +
            "api/mdis-members/" +
            this.members[i].id +
            "/";
          // console.log(url);
          var formData = new FormData();
          formData.append("member_id", this.members[i].member_id);
          formData.append("email", this.members[i].email);
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
            this.updateMembers();

            this.message = {
              text: "MDIS Members updated",
              type: "success"
            };
            Bus.$emit("flash-message", this.message);
            this.updateMembers();
          })
          .catch(err => {
            if (Service.isDebug) {
              console.log(err.response);
            }
            if (err.response.data.member_id) {
              this.message.text = err.response.data.member_id[0];
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
          text: "Only site admin can manage membership",
          type: "error"
        };
        Bus.$emit("flash-message", this.message);
      }
    },

    getMembers() {
      this.token = Service.getToken();
      if (this.token) {
        axios
          .get(Service.getBackendURL() + "api/mdis-members/", {
            headers: {
              Authorization: "Token " + this.token
            }
          })
          .then(res => {
            this.members = res.data;
            if (Service.isDebug) {
              console.log(this.members);
            }
          })
          .catch(err => {
            if (Service.isDebug) {
              console.log(err.response);
            }
          });
      }
    },
    updateMembers() {
      this.timer = setTimeout(() => {
        this.getMembers();
      }, 600);
    }
  },
  created() {
    this.editingEnabled = false;
    this.getMembers();

    // console.log(this.editingEnabled);
  }
};
</script>

<style scoped>
.MDISMemberManagement {
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
