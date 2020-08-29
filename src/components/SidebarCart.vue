<template>
  <div>
    <!-- <b-button v-b-toggle.sidebarcart>Toggle Sidebar</b-button>
    <b-button
      :aria-expanded="visible ? 'true' : 'false'"
      aria-controls="sidebarcart"
      @click="active"
    >Show</b-button>
    {{visible}}-->

    <b-sidebar
      id="sidebarcart"
      title="My Cart"
      :backdrop-variant="variant"
      backdrop
      right
      shadow
      v-model="visible"
    >
      <div class="px-3 py-2">
        <!-- <b-form-group label="Backdrop variant" label-for="backdrop-variant">
          <b-form-select id="backdrop-variant" v-model="variant" :options="variants"></b-form-select>
        </b-form-group>-->
        <MyCart ref="update"></MyCart>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import MyCart from "@/components/MyCart.vue";

export default {
  name: "SidebarCart",
  components: {
    MyCart,
  },
  data() {
    return {
      variant: "dark",
      visible: false,
    };
  },
  methods: {
    activate() {
      this.visible = true;
      this.$refs.update.getMyCart();
    },
  },

  created() {},
};
</script>

<style>
</style>