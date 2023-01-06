import Vue from 'vue'
import App from './App.vue'

import store from './store'
import vuetify from './plugins/vuetify';
import moment from 'moment';
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import VueDraggableResizable from 'vue-draggable-resizable'
import { sync } from 'vuex-router-sync'
 
const unsync = sync(store, router) 

Vue.config.productionTip = false;
Vue.prototype.moment = moment;

Vue.filter('pretty', function(value) {
  return JSON.stringify(JSON.parse(value), null, 2);
})


import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

Vue.component('vue-draggable-resizable', VueDraggableResizable);

new Vue({
  vuetify,
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app');
