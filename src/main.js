import Vue from 'vue'
import vueHeadful from 'vue-headful';
import VueConfirmDialog from 'vue-confirm-dialog';
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin, BContainer, LayoutPlugin } from 'bootstrap-vue'
import VueScrollTo from 'vue-scrollto'
import VueSocialSharing from 'vue-social-sharing'


window.Bus = new Vue();

Vue.component('vue-confirm-dialog', VueConfirmDialog.default)
Vue.component('vue-headful', vueHeadful);
Vue.component('flash-message', require('./components/FlashMessage.vue').default);
// Vue.component('count-in-cart', require('./components/CountInCart.vue').default);
Vue.component('b-container', BContainer)

Vue.config.productionTip = false

Vue.use(VueConfirmDialog)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(LayoutPlugin)
Vue.use(require('vue-moment'));
Vue.use(VueScrollTo)
Vue.use(VueSocialSharing);

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
