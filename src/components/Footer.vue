<template>
  <div class="footer-container">
    <div class="router-link">
      <div>
        <router-link class="router-link-item" to="/about">About Us</router-link>
      </div>

      <div>
        <router-link
          class="router-link-item"
          :to="{name: 'FlatTextPage',hash:'#terms-and-conditions'}"
        >Terms and Conditions</router-link>
      </div>
      <div>
        <router-link class="router-link-item" to="/contact-us">Contact Us</router-link>
      </div>
      <div>
        <router-link
          class="router-link-item"
          :to="{name: 'FlatTextPage',hash:'#privacy-policy'}"
        >Privacy Policy</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.footer-container {
  padding: 50px;
  background-color: gray;
  width: 100%;
}
.router-link {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: baseline;
  flex-wrap: wrap;
}
.router-link div {
  flex: 0 50%;
  text-align: left;
}
.router-link-item {
  width: 100%;
  color: white;
  margin: 10px;
  padding: 10px;
}
</style>