import Vue from 'vue'
import Consts from '../../consts'

Vue.component('linked-img', {
    props: {
        data: {
            type: Object,
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
            isEditing: false,
            startScreenX: 0,
            startScreenY: 0,
            isMousedownForResizing: false,
            isMousedownForMoving: false
        }
    },
    computed: {
        borderColor() {
            return this.isEditing ? '#f00' : '#666'
        },
        rectStyle() {
            return `fill: none; stroke-width: 4; stroke: ${this.borderColor}`
        },
        circleCx() {
            return this.data.width - 10
        },
        circleCy() {
            return this.data.height - 10
        },
        x() {
            return this.data.x + (Consts.paperFullWidth - this.viewportWidth) * 0.5
        },
        y() {
            return this.data.y + (Consts.paperFullHeight - this.viewportHeight) * 0.5
        },
        imgSrc() {
            return `static/img/${this.data.file}`
        }
    },
    methods: {
        onClick() {
            this.isEditing = !this.isEditing
        },
        onResizeHandleMousedown(evt) {
            if (evt.target !== evt.currentTarget) {
                return
            }
            this.isMousedownForResizing = true
            this.startScreenX = evt.screenX
            this.startScreenY = evt.screenY
            document.body.addEventListener('mousemove', this.mousemove)
            document.body.addEventListener('mouseup', this.mouseup)
        },
        onSvgMousedown(evt) {
            this.isMousedownForMoving = true
            this.startScreenX = evt.screenX
            this.startScreenY = evt.screenY
            document.body.addEventListener('mousemove', this.mousemove)
            document.body.addEventListener('mouseup', this.mouseup)
        },
        mousemove(evt) {
            if (this.isMousedownForResizing) {
                const dx = evt.screenX - this.startScreenX
                const dy = evt.screenY - this.startScreenY
                let dx2 = 0
                let dy2 = 0
                if (Math.abs(dx) > Math.abs(dy)) {
                    dx2 = dx
                    dy2 = dy
                } else {
                    dx2 = dy
                    dy2 = dx
                }
                this.$emit('resize', {
                    dx: dx2,
                    dy: this.data.height / this.data.width * dx2
                })
                this.startScreenX = evt.screenX
                this.startScreenY = evt.screenY

            } else if (this.isMousedownForMoving) {
                const dx = evt.screenX - this.startScreenX
                const dy = evt.screenY - this.startScreenY
                this.$emit('move', {
                    dx: dx,
                    dy: dy
                })
                this.startScreenX = evt.screenX
                this.startScreenY = evt.screenY
            }
        },
        mouseup(evt) {
            if (this.isMousedownForResizing) {
                this.isMousedownForResizing = false
                document.body.removeEventListener('mousemove', this.mousemove)
                document.body.removeEventListener('mouseup', this.mouseup)

            } else if (this.isMousedownForMoving) {
                this.isMousedownForMoving = false
                document.body.removeEventListener('mousemove', this.mousemove)
                document.body.removeEventListener('mouseup', this.mouseup)
            }
        }
    },
    render(h) {
        return (
            <svg x={this.x} y={this.y} width={this.data.width} height={this.data.height} onMousedown={this.onSvgMousedown} onClick={this.onClick}>
                <image xlinkHref={this.imgSrc} x="0" y="0" width={this.data.width} height={this.data.height} preserveAspectRatio="none"/>
                <rect width={this.data.width} height={this.data.height} rx="4" ry="4" style={this.rectStyle}/>
                <circle cx={this.circleCx} cy={this.circleCy} r="10" fill="red" onMousedown={this.onResizeHandleMousedown}/>
            </svg>
        )
    }
})
