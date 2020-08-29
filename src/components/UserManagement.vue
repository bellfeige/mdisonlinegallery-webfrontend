<template>
  <div class="UserManagement">
    <h4 class="row">User Management</h4>
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
              label="New Administrator:"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              label-for="newUsername"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input v-model="newUsername" id="newUsername" placeholder="Username"></b-form-input>
                <!-- <b-form-input
                  v-model="newEmail"
                  type="email"
                  id="newEmail"
                  placeholder="Email"
                ></b-form-input>-->
                <b-form-input
                  v-model="newPassword"
                  type="password"
                  id="newPassword"
                  placeholder="Password"
                ></b-form-input>
                <b-form-input
                  v-model="newPassword_confirm"
                  type="password"
                  id="newPassword_confirm"
                  placeholder="Confirm Password"
                ></b-form-input>
                <b-input-group-append>
                  <b-button v-on:click="addAdmin()" class="btn btn-info">Add</b-button>
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
              >Edit Users</b-button>
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
        <b-table show-empty small stacked="md" :items="users" :fields="fields" :filter="filter">
          <template v-if="editingEnabled==false" v-slot:cell(username)="row">{{ row.item.username }}</template>
          <template v-if="editingEnabled==false" v-slot:cell(email)="row">{{ row.item.email }}</template>
          <template
            v-if="editingEnabled==false"
            v-slot:cell(Name)="row"
          >{{ row.item.get_full_name }}</template>
          <template
            v-if="editingEnabled==false"
            v-slot:cell(role)="row"
          >{{ row.item.get_user_role_str }}</template>

          <!-- <template v-if="editingEnabled==true" v-slot:cell(username)="row">
            <input type="text" v-model="row.item.username " />
          </template>-->
          <template v-if="editingEnabled==true" v-slot:cell(email)="row">
            <input type="email" v-model="row.item.email " />
          </template>
          <template v-slot:cell(actions)="row">
            <b-button
              v-if="row.item.id!=myId"
              size="sm"
              v-on:click="deleteUser_confirm(row.item)"
              class="mr-1 btn-danger"
            >Delete</b-button>
            <b-button
              v-else-if="row.item.id==myId"
              size="sm"
              class="mr-1 btn-disabled"
              disabled=""
            >This is You</b-button>
          </template>
        </b-table>

        <div v-if="editingEnabled==true">
          <button v-on:click="editUser(users)" class="btn btn-info btn-sm">Update</button>
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
  name: "UserManagement",
  components: {},
  data() {
    return {
      newUsername: "",
      //   newEmail: null,
      newPassword: "",
      newPassword_confirm: "",
      users: {},
      myId: "",
      items: [],
      editingEnabled: false,
      fields: [
        {
          key: "username",
          label: "Username",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "email",
          label: "Email",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "get_full_name",
          label: "Name",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "get_user_role_str",
          label: "Role",
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
    addAdmin() {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      let formData = new FormData();
      if (this.token) {
        if (this.newUsername == "") {
          this.message = {
            text: "Username cannot be blank",
            type: "error"
          };
          Bus.$emit("flash-message", this.message);
        } else if (this.newPassword != this.newPassword_confirm) {
          this.message = {
            text: "Passwords not match",
            type: "error"
          };
          Bus.$emit("flash-message", this.message);
        } else if (this.newPassword == "" || this.newPassword_confirm == "") {
          this.message = {
            text: "Password required",
            type: "error"
          };
          Bus.$emit("flash-message", this.message);
        } else {
          formData.append("username", this.newUsername);
          formData.append("password", this.newPassword);
          formData.append("is_superuser", 1);
          axios
            .post(Service.getBackendURL() + "api/users/", formData, {
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
                text: "New Administrator [" + this.newUsername + "] is added",
                type: "success"
              };
              Bus.$emit("flash-message", this.message);
              this.updateUsers();
            })
            .catch(err => {
              if (Service.isDebug) {
                console.log(err.response);
              }
              if (err.response.data.username) {
                this.message.text = err.response.data.username[0];
              } else if (err.response.data.email) {
                this.message.text = err.response.data.email[0];
              } else {
                this.message.text = err.response.data.message;
              }
              this.message.type = "error";
              Bus.$emit("flash-message", this.message);
            });
        }
      } else {
        this.message = {
          text: "Only site admin can manage users",
          type: "error"
        };
        Bus.$emit("flash-message", this.message);
      }
    },
    deleteUser_confirm(user) {
      this.token = Service.getToken();
      if (this.token) {
        this.$confirm({
          message: `Are you sure to delete this user?`,
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
              this.deleteUser(user);
            }
          }
        });
      } else {
        this.message = {
          text: "Only site admin can manage user",
          type: "error"
        };
        Bus.$emit("flash-message", this.message);
      }
    },

    deleteUser(user) {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      console.log(user.id);

      axios
        .delete(Service.getBackendURL() + "api/users/" + user.id + "/", {
          headers: {
            Authorization: "Token " + this.token
          }
        })
        .then(res => {
          if (Service.isDebug) {
            console.log(res);
          }

          this.message = {
            text: "User [" + user.username + "] has been deleted",
            type: "success"
          };
          Bus.$emit("flash-message", this.message);
          this.updateUsers();
        })
        .catch(err => {
          if (Service.isDebug) {
            console.log(err.response);
          }
          if (err.response.data.username) {
            this.message.text = err.response.data.username[0];
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

    editUser() {
      this.message.text = null;
      this.message.type = null;
      this.token = Service.getToken();
      if (this.token) {
        var axiosRquests = new Array();
        console.log(this.users);
        for (var i = 0; i < this.users.length; i++) {
          let url =
            Service.getBackendURL() + "api/users/" + this.users[i].id + "/";
          // console.log(url);
          var formData = new FormData();

          formData.append("email", this.users[i].email);
          let request = axios.patch(url, formData, {
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
            this.message = {
              text: "User updated",
              type: "success"
            };
            Bus.$emit("flash-message", this.message);
            this.updateUsers();
          })
          .catch(err => {
            if (Service.isDebug) {
              console.log(err);
            }
            if (err.response.data.email) {
              this.message.text = err.response.data.email[0];
            } else {
              this.message.text = err.response.data.message;
            }
            this.message.type = "error";
            Bus.$emit("flash-message", this.message);
          });
      } else {
        this.message = {
          text: "Only site admin can manage users",
          type: "error"
        };
        Bus.$emit("flash-message", this.message);
      }
    },

    getUsers() {
      this.token = Service.getToken();
      if (this.token) {
        axios
          .get(Service.getBackendURL() + "api/users/", {
            headers: {
              Authorization: "Token " + this.token
            }
          })
          .then(res => {
            this.users = res.data;
            if (Service.isDebug) {
              console.log(this.users);
            }
          })
          .catch(err => {
            if (Service.isDebug) {
              console.log(err.response);
            }
          });
      }
    },
    updateUsers() {
      this.timer = setTimeout(() => {
        this.getUsers();
      }, 600);
    },
    getMyId() {
      this.token = Service.getToken();
      if (this.token) {
        axios
          .get(Service.getBackendURL() + "api/me", {
            headers: {
              Authorization: "Token " + this.token
            }
          })
          .then(res => {
            this.myId = res.data.id;
            if (Service.isDebug) {
              console.log(this.myId);
            }
          })
          .catch(err => {
            if (Service.isDebug) {
              console.log(err.response);
            }
          });
      }
    }
  },
  created() {
    this.editingEnabled = false;
    this.getUsers();
    this.getMyId();

    // console.log(this.editingEnabled);
  }
};
</script>

<style scoped>
.UserManagement {
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
