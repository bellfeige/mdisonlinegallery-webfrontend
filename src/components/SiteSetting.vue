<template>
  <div class="sitesetting">
    <h1 class="row title">Site Settings</h1>
    <div>
      <b-tabs content-class="mt-3">
        <b-tab title="Categories">
          <CategoryManagement></CategoryManagement>
        </b-tab>
        <b-tab title="MDIS Memberships">
          <MDISMemberManagement></MDISMemberManagement>
        </b-tab>
        <b-tab title="User Management">
          <UserManagement></UserManagement>
        </b-tab>
        <!-- <b-tab title="Disabled" disabled>
          <p>I'm a disabled tab!</p>
        </b-tab>-->
      </b-tabs>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CategoryManagement from "@/components/CategoryManagement.vue";
import MDISMemberManagement from "@/components/MDISMemberManagement.vue";
import UserManagement from "@/components/UserManagement.vue";

export default {
  name: "SiteSetting",
  components: {
    CategoryManagement,
    MDISMemberManagement,
    UserManagement
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
.sitesetting {
  margin: 0 50px 0 50px;
}
.title {
  margin: 10px 0 30px 0;
}
</style>
