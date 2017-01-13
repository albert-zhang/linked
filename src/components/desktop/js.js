import Consts from '../../consts'
import Store from '../../store'

export default {
    components: {
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            paperScale: 1,
            paperTx: 0,
            paperTy: 0,
            dragStartScreenX: 0,
            dragStartScreenY: 0,
            isMousedownForDragging: false,
            viewportWidth: 0,
            viewportHeight: 0
        }
    },
    computed: {
        paperStyle() {
            return {
                width: `${Consts.paperFullWidth}px`,
                height: `${Consts.paperFullHeight}px`,
                transform: `translateX(${this.paperTx}px) translateY(${this.paperTy}px) scale(${this.paperScale})`
            }
        },
        paperWidth() {
            return Consts.paperFullWidth
        },
        paperHeight() {
            return Consts.paperFullHeight
        }
    },
    watch: {
        paperScale(to, from) {
            Store.setPaperScale(to)
        }
    },
    created() {
        const self = this
        this.$nextTick(() => {
            Store.setSvg(this.$refs.svg)
            Store.setSvgPoint(this.$refs.svg.createSVGPoint())
            this.$el.addEventListener('mousewheel', this.onMousewheel)
        })
        setTimeout(() => {
            self.viewportWidth = this.$el.offsetWidth
            self.viewportHeight = this.$el.offsetHeight
            self.paperTx = -(Consts.paperFullWidth - self.viewportWidth) * 0.5
            self.paperTy = -(Consts.paperFullHeight - self.viewportHeight) * 0.5
        }, 0)
    },
    methods: {
        onResize(dt, img) {
            const orgW = img.width
            img.width += dt.dx / this.paperScale
            img.height += dt.dy / this.paperScale
            const f = img.width / orgW

            this.data.links.forEach(link => {
                if (link.from.id === img.id) {
                    link.from.x *= f
                    link.from.y *= f
                }
                if (link.to.id === img.id) {
                    link.to.x *= f
                    link.to.y *= f
                }
            })
        },
        onMove(dt, img) {
            img.x += dt.dx / this.paperScale
            img.y += dt.dy / this.paperScale
        },
        onMousewheel(evt) {
            this.paperScale -= evt.wheelDelta * 0.00005
            if (this.paperScale > 2) {
                this.paperScale = 2
            } else if (this.paperScale < 0.1) {
                this.paperScale = 0.1
            }
        },
        onMousedownForDragging(evt) {
            if (evt.target === evt.currentTarget) {
                this.dragStartScreenX = evt.screenX
                this.dragStartScreenY = evt.screenY
                this.isMousedownForDragging = true
                document.body.addEventListener('mousemove', this.mousemove)
                document.body.addEventListener('mouseup', this.mouseup)
            }
        },
        mousemove(evt) {
            if (this.isMousedownForDragging) {
                var dx = evt.screenX - this.dragStartScreenX
                var dy = evt.screenY - this.dragStartScreenY
                this.paperTx += dx
                this.paperTy += dy
                this.dragStartScreenX = evt.screenX
                this.dragStartScreenY = evt.screenY
            }
        },
        mouseup() {
            if (this.isMousedownForDragging) {
                this.isMousedownForDragging = false
                document.body.removeEventListener('mousemove', this.mousemove)
                document.body.removeEventListener('mouseup', this.mouseup)
            }
        },
        onSvgMousemove(evt) {
            Store.svgPoint.x = evt.clientX
            Store.svgPoint.y = evt.clientY
            const p = Store.svgPoint.matrixTransform(Store.svg.getScreenCTM().inverse())
            const x = p.x / Store.paperScale
            const y = p.y / Store.paperScale
            console.log(x + ', ' + y)
            // TODO: here
        }
    }
}
