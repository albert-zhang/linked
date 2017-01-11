import Vue from 'vue'

import './scss.scss'

Vue.component('linked-img', {
    props: {
        data: {
            type: Object,
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
        containerStyle() {
            const obj = {
                left: `${this.data.x}px`,
                top: `${this.data.y}px`,
                width: `${this.data.width}px`,
                height: `${this.data.height}px`,
                border: `2px solid ${this.borderColor}`
            }
            if (this.isEditing) {
                obj.boxShadow = '0 0 50px #666'
            }
            return obj
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
                this.$emit('resize', {
                    dx: dx,
                    dy: dy
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
            <div class="img" style={this.containerStyle} onClick={this.onClick}>
            <svg width={this.data.width} height={this.data.height} onMousedown={this.onSvgMousedown}>
                <image xlinkHref={this.imgSrc} x="0" y="0" width={this.data.width} height={this.data.height} preserveAspectRatio="none"/>
            </svg>
            <div class="resize-handle" onMousedown={this.onResizeHandleMousedown}>&nbsp;</div>
        </div>
        )
    }
})
