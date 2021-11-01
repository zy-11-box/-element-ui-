import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios"
import "./plugins/element"
import "assets/css/global.css"
import 'assets/fonts/iconfont.css'
import "./network/request"
import { VueQuillEditor } from "./plugins/vueQuillEditor"
Vue.config.productionTip = false

// 导入富文本编辑器
Vue.use(VueQuillEditor)

Vue.prototype.$http = axios
//使用treetable插件
import ZkTable from 'vue-table-with-tree-grid'


Vue.component("treeTable", ZkTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
