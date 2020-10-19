import Vue from 'vue'
import App from './App.vue'
import router from './router'

import VueToastify from "vue-toastify";
import vuetify from './plugins/vuetify';
Vue.use(VueToastify);

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')


