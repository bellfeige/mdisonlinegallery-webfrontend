<template>
<div>
    {{count}}
</div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
  mounted() {
    Bus.$on("count-in-cart", (count) => {
      this.count = count;
      console.log(this.count);
    });
  },
};
</script>

<style>
</style>