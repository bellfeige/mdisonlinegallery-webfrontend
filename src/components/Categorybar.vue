<template>
  <div class="category-container">
    <div v-bind:key="category.id" v-for="category in categories" class="category-item">
        {{category.name}}
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import { Service } from "../storage/service";

export default {
  name: "Categorybar",
  components: {},
  data() {
    return {
      categories: null
    };
  },
  methods: {},
  created() {
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
  }
};
</script>

<style scoped>
.category-container {
  display: flex;
  flex-direction: row;
  justify-content: space-start;
}

.category-item{
    margin-left: 30px;
    margin-right: 10px;
    padding-left: 30px;
}
</style>