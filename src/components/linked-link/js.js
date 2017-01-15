import Vue from 'vue'
import Consts from '../../consts'

Vue.component('linked-link', {
    props: {
        data: {
            type: Object,
            required: true
        },
        disableMouse: {
            type: Boolean,
            default: false
        },
        imgs: {
            type: Array,
            required: true
        },
        viewportWidth: {
            type: Number,
            required: true
        },
        viewportHeight: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
        }
    },
    computed: {
        fromImg() {
            let toReturn = null
            this.imgs.some(img => {
                if (img.id === this.data.from.id) {
                    toReturn = img
                    return true
                }
                return false
            })
            return toReturn
        },
        toImg() {
            let toReturn = null
            this.imgs.some(img => {
                if (img.id === this.data.to.id) {
                    toReturn = img
                    return true
                }
                return false
            })
            return toReturn
        },
        x1() {
            return this.fromImg.x + this.data.from.x + (Consts.paperFullWidth - this.viewportWidth) * 0.5
        },
        y1() {
            return this.fromImg.y + this.data.from.y + (Consts.paperFullHeight - this.viewportHeight) * 0.5
        },
        x2() {
            if (this.data.isCreating) {
                return this.data.creatingToX
            } else {
                return this.toImg.x + this.data.to.x + (Consts.paperFullWidth - this.viewportWidth) * 0.5
            }
        },
        y2() {
            if (this.data.isCreating) {
                return this.data.creatingToY
            } else {
                return this.toImg.y + this.data.to.y + (Consts.paperFullHeight - this.viewportHeight) * 0.5
            }
        },
        style() {
            let str = 'stroke:#d00; stroke-width:2;'
            if (this.disableMouse) {
                str += 'pointer-events: none;'
            }
            return str
        }
    },
    methods: {
        onSvgMousedown() {

        },
        onClick() {

        }
    },
    render(h) {
        return (
            <line x1={this.x1} y1={this.y1} x2={this.x2} y2={this.y2}
                marker-end="url(#triangle)" style={this.style}
                onMousedown={this.onSvgMousedown} onClick={this.onClick}/>
        )
    }
})
