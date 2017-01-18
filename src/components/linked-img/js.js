import Vue from 'vue'
import Consts from '../../consts'
import Store from '../../store'
import fileUrl from 'file-url'
import path from 'path'

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
            startScreenX: 0,
            startScreenY: 0,
            isMousedownForResizing: false,
            isMousedownForMoving: false
        }
    },
    computed: {
        borderColor() {
            return this.data.selected ? Consts.imgBorderColorSelected : Consts.imgBorderColorNormal
        },
        rectStyle() {
            return `fill: none; stroke-width: 1; stroke: ${this.borderColor}`
        },
        resizeHandleX() {
            return this.x + this.data.width - 15
        },
        resizeHandleY() {
            return this.y + this.data.height - 15
        },
        resizeHandleStyle() {
            return 'fill:' + Consts.imgBorderColorSelected + ';fill-opacity:0.8'
        },
        x() {
            return this.data.x + (Consts.paperFullWidth - this.viewportWidth) * 0.5
        },
        y() {
            return this.data.y + (Consts.paperFullHeight - this.viewportHeight) * 0.5
        },
        imgSrc() {
            return fileUrl(path.resolve(Store.fileRoot, this.data.file))
        },
        resizeHandleVisible() {
            return this.data.selected
        }
    },
    created() {
        const self = this
    },
    methods: {
        calcLocalPosition(evt) {
            Store.svgPoint.x = evt.clientX
            Store.svgPoint.y = evt.clientY
            const p = Store.svgPoint.matrixTransform(Store.svg.getScreenCTM().inverse())
            const x = p.x / Store.paperScale - this.x
            const y = p.y / Store.paperScale - this.y
            return {x, y}
        },
        onClick() {
            this.$emit('select')
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
                this.$emit('ctrlMousedown', this.calcLocalPosition(evt))
                return
            }
            this.isMousedownForMoving = true
            this.startScreenX = evt.screenX
            this.startScreenY = evt.screenY
            document.body.addEventListener('mousemove', this.mousemove)
            document.body.addEventListener('mouseup', this.mouseup)
        },
        onImageMousemove(evt) {
            this.$emit('mousemove2', this.calcLocalPosition(evt))
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
        },
        onImageMouseover(evt) {
            this.$emit('mouseover')
        },
        onImageMouseout(evt) {
            this.$emit('mouseoout')
        }
    },
    render(h) {
        return (
            <g>
                <image xlinkHref={this.imgSrc} x={this.x} y={this.y} width={this.data.width} height={this.data.height} preserveAspectRatio="none"
                    onMousedown={this.onImageMousedown} onMousemove={this.onImageMousemove} onMouseover={this.onImageMouseover} onMouseout={this.onImageMouseout}
                    onClick={this.onClick}/>
                <rect x={this.x} y={this.y} width={this.data.width} height={this.data.height} rx="4" ry="4" style={this.rectStyle}/>
                <rect v-show={this.resizeHandleVisible} x={this.resizeHandleX} y={this.resizeHandleY} rx="2" ry="2" width="15" height="15"
                    style={this.resizeHandleStyle} onMousedown={this.onResizeHandleMousedown}/>
            </g>
        )
    }
})
