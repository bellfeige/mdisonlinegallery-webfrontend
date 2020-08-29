import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from '../components/Register.vue'
import RegisterDesigner from '../components/RegisterDesigner.vue'
import Home from '../views/Home.vue'
import ContactUs from '../views/ContactUs.vue'
import SiteSetting from '../components/SiteSetting.vue'
import DigitalArtList from '../components/DigitalArtList.vue'
import DigitalArtDetail from '../components/DigitalArtDetail.vue'
import MyOrder from '../components/MyOrder.vue'
import MyOrderDetail from '../components/MyOrderDetail.vue'
import MyAccount from '../components/MyAccount.vue'
import DigitalArtCreate from '../components/DigitalArtCreate.vue'
import Payment from '@/components/Payment.vue'
import MyDigitalArtList from '../components/MyDigitalArtList.vue'
import DigitalArtEdit from '../components/DigitalArtEdit.vue'
import FlatTextPage from '../components/FlatTextPage.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/contact-us',
    name: 'ContactUs',
    component: ContactUs
  },
  {
    path: '/register/member',
    name: 'Register',
    component: Register
  },
  {
    path: '/register/designer',
    name: 'RegisterDesigner',
    component: RegisterDesigner
  },
  {
    path: '/documents',
    name: 'FlatTextPage',
    component: FlatTextPage
  },
  {
    path: '/digital-art-products',
    name: 'DigitalArtList',
    component: DigitalArtList
  },
  {
    path: '/digital-art-products/details/:id',
    name: 'DigitalArtDetail',
    component: DigitalArtDetail
  },
  {
    path: '/digital-art-products/my-products',
    name: 'MyDigitalArtList',
    component: MyDigitalArtList
  },
  {
    path: '/digital-art-products/new',
    name: 'DigitalArtCreate',
    component: DigitalArtCreate
  },
  {
    path: '/digital-art-products/edit/:id',
    name: 'DigitalArtEdit',
    component: DigitalArtEdit
  },
  {
    path: '/digital-art-products/:id/checkout',
    name: 'Payment',
    component: Payment
  },

  {
    path: '/my-order',
    name: 'MyOrder',
    component: MyOrder
  },
  {
    path: '/my-order/details/:id',
    name: 'MyOrderDetail',
    component: MyOrderDetail
  },
  {
    path: '/my-account',
    name: 'MyAccount',
    component: MyAccount
  },
  {
    path: '/site-settings',
    name: 'SiteSetting',
    component: SiteSetting
  },
]


const router = new VueRouter({
  routes,
  scrollBehavior: function (to) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    }
  },
})

export default router
