import Vue from 'vue'

import './scss.scss'

Vue.component('linked-img', {
    data() {
        return {
            src: require('assets/logo.png'),
            borderColor: '#666',
            isEditing: true
        }
    },
    computed: {
        svgStyle() {
            const obj = {
                left: `34px`,
                top: `20px`,
                width: `${this.width}px`,
                height: `${this.height}px`,
                border: `2px solid ${this.borderColor}`
            }
            if (this.isEditing) {
                obj.boxShadow = '0 0 50px #666'
            }
            return obj
        },
        width() {
            return 100
        },
        height() {
            return 100
        }
    },
    methods: {
        onClick() {
            this.borderColor = '#f00'
        }
    },
    render(h) {
        return (
            <div class="img" style={this.svgStyle} onClick={this.onClick}>
    <svg width={this.width} height={this.height}>
    <image xlinkHref={this.src} x="0" y="0" width={this.width} height={this.height}/>
            </svg>
            <div style="position: absolute; bottom: -10px; right: -10px; width: 20px; height: 20px; background-color: #f00;">&nbsp;</div>
        </div>
        )
    }
})
