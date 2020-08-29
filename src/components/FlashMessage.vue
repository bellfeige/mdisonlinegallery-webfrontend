<template>
  <div class="fixed top-0 right-0 m-6">
    <div
      v-if="message"
      :class="{'alert alert-danger alert-dismissible fade show msg-text':message.type === 'error',
              'alert alert-success alert-dismissible fade show msg-text':message.type === 'success'}"
      role="alert"
    >
      <!-- <strong>{{message.type}}</strong> -->
      <strong>{{message.text}}</strong>
      
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
        v-on:click="closeMsg"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <!-- <div v-else class='"fixed top-0 right-0 m-10" alert alert-dismissible fade show'>
      
    
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: null
    };
  },
  mounted() {
    let timer;
    Bus.$on("flash-message", message => {
      clearTimeout(timer);
      this.message = message;

      console.log(this.message);
      // timer = setTimeout(() => {
      //   this.message = null;
      // }, 5000);
    });
  },
  methods: {
    closeMsg() {
      this.message = null;
    }
  }
};
</script>

<style scoped>
.msg-text{
  text-align: center;
}
</style>

