// window.jQuery = require('jquery')
// require('bootstrap')

import Vue from 'vue'
import App from './App'

import './components/linked-img/js'

/* eslint-disable no-new */
new Vue({
    el: '#app',
    render: h => h(App)
})

import './assets/global.scss'
import 'weui'
