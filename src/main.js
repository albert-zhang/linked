// window.jQuery = require('jquery')
// require('bootstrap')

import Vue from 'vue'
import App from './App.vue'

import './store'

import './components/linked-img/js'
import './components/linked-link/js'

/* eslint-disable no-new */
new Vue({
    el: '#app',
    render: h => h(App)
})

import './assets/global.scss'
import 'weui'
