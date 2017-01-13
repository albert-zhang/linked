import Vue from 'vue'
import Consts from '../../consts'
import Store from '../../store'

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
            return this.x + this.data.width - 10
        },
        circleCy() {
            return this.y + this.data.height - 10
        },
        x() {
            return this.data.x + (Consts.paperFullWidth - this.viewportWidth) * 0.5
        },
        y() {
            return this.data.y + (Consts.paperFullHeight - this.viewportHeight) * 0.5
        },
        imgSrc() {
            return `file://${Store.fileRoot}/${this.data.file}`
        }
    },
    created() {
        const self = this
    },
    methods: {
        onClick() {
            this.isEditing = !this.isEditing
        },
        onResizeHandleMousedown(evt) {
            this.isMousedownForResizing = true
            this.startScreenX = evt.screenX
            this.startScreenY = evt.screenY
            document.body.addEventListener('mousemove', this.mousemove)
            document.body.addEventListener('mouseup', this.mouseup)
        },
        onImageMousedown(evt) {
            if (evt.ctrlKey) {
                Store.svgPoint.x = evt.clientX
                Store.svgPoint.y = evt.clientY
                const p = Store.svgPoint.matrixTransform(Store.svg.getScreenCTM().inverse())
                const x = p.x / Store.paperScale - this.x
                const y = p.y / Store.paperScale - this.y
                console.log(x + ', ' + y)
                // TODO: here
                return
            }
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
            <g>
                <image xlinkHref={this.imgSrc} x={this.x} y={this.y} width={this.data.width} height={this.data.height} preserveAspectRatio="none"
                    onMousedown={this.onImageMousedown}/>
                <rect x={this.x} y={this.y} width={this.data.width} height={this.data.height} rx="4" ry="4" style={this.rectStyle}/>
                <circle cx={this.circleCx} cy={this.circleCy} r="10" fill="red" onMousedown={this.onResizeHandleMousedown}/>
            </g>
        )
    }
})
