<template>
  <div id="app">
    <vue-headful :title="title" description="" />
    <Navbar></Navbar>
    <flash-message></flash-message>
    <!-- <SidebarCart></SidebarCart> -->
    <vue-confirm-dialog></vue-confirm-dialog>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view id="body" :key="$route.fullPath"/>
    <div id="footer">
      <Footer></Footer>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
// import SidebarCart from "@/components/SidebarCart.vue";
import Footer from "@/components/Footer.vue";


export default {
  name: "App",
  components: {
    Navbar,
    // SidebarCart,
    Footer
  },
  data() {
    return {
      title: "MDIS Gallery"
    };
  },
  created() {
    // this.title = "Digital Arts Gallery";
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}

#body {
  padding: 30px;
  min-height: 800px;
}

/* #nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
} */
#footer{
  width:100%;
}
</style>
