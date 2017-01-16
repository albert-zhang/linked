import Consts from '../../consts'
import Store from '../../store'
import md5 from 'js-md5'
import Vue from 'vue'

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
            viewportHeight: 0,
            isMousedownForCreatingLinks: false,
            creatingLinksTargetImg: null,
            creatingLinksTargetImgMousePos: null,
            linkMarkerEndColorNormal: Consts.linkColorNormal,
            linkMarkerEndColorSelected: Consts.linkColorSelected,
            selectedObject: null // either a img or a link
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
        onImgResize(dt, img) {
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
        onImgMove(dt, img) {
            img.x += dt.dx / this.paperScale
            img.y += dt.dy / this.paperScale
        },
        onImgCtrlMousedown(pos, img) {
            this.isMousedownForCreatingLinks = true
            const link = {
                id: md5(new Date().toISOString()),
                isCreating: true,
                name: '',
                from: {
                    id: img.id,
                    x: pos.x,
                    y: pos.y
                },
                creatingToX: this.mouseX,
                creatingToY: this.mouseY
            }
            this.data.links.push(link)
        },
        onImgMouseover(img) {
            if (this.isMousedownForCreatingLinks) {
                this.creatingLinksTargetImg = img
            }
        },
        onImgMouseout(img) {
            if (this.isMousedownForCreatingLinks) {
                this.creatingLinksTargetImg = null
                this.creatingLinksTargetImgMousePos = null
            }
        },
        onImgMousemove(pos, img) {
            if (this.creatingLinksTargetImg) {
                this.creatingLinksTargetImgMousePos = pos
            }
        },
        onMousewheel(evt) {
            this.paperScale -= evt.wheelDelta * 0.00005
            if (this.paperScale > 3) {
                this.paperScale = 3
            } else if (this.paperScale < 0.1) {
                this.paperScale = 0.1
            }
        },
        onSvgClick(evt) {
            if (evt.target === evt.currentTarget) {
                if (this.selectedObject) {
                    Vue.set(this.selectedObject, 'selected', false)
                    delete this.selectedObject.selected
                    this.selectedObject = null
                }
            }
        },
        onSvgMousedown(evt) {
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
            if (this.isMousedownForCreatingLinks) {
                Store.svgPoint.x = evt.clientX
                Store.svgPoint.y = evt.clientY
                const p = Store.svgPoint.matrixTransform(Store.svg.getScreenCTM().inverse())
                this.mouseX = p.x / Store.paperScale
                this.mouseY = p.y / Store.paperScale
                this.data.links.forEach(link => {
                    if (link.isCreating) {
                        link.creatingToX = this.mouseX
                        link.creatingToY = this.mouseY
                    }
                })
            }
        },
        onSvgMouseup(evt) {
            if (this.isMousedownForCreatingLinks) {
                this.isMousedownForCreatingLinks = false
                this.data.links.forEach(link => {
                    if (link.isCreating) {
                        if (this.creatingLinksTargetImg && this.creatingLinksTargetImg.id !== link.from.id) {
                            link.isCreating = false
                            setTimeout(() => {
                                delete link.isCreating
                            }, 0)
                            delete link.creatingToX
                            delete link.creatingToY
                            link.to = {
                                id: this.creatingLinksTargetImg.id,
                                x: this.creatingLinksTargetImgMousePos.x,
                                y: this.creatingLinksTargetImgMousePos.y
                            }
                        } else {
                            link.__tmp_toBeDeleted = true
                        }
                    }
                })
                while (true) {
                    let hasToBeDeleted = false
                    for (const i in this.data.links) {
                        const link = this.data.links[i]
                        if (link.__tmp_toBeDeleted) {
                            hasToBeDeleted = true
                            this.data.links.splice(i, 1)
                            break
                        }
                    }
                    if (!hasToBeDeleted) {
                        break
                    }
                }
            }
        },
        onImgSelect(img) {
            if (this.selectedObject) {
                Vue.set(this.selectedObject, 'selected', false)
                delete this.selectedObject.selected
            }
            if (this.selectedObject !== img) {
                this.selectedObject = img
                Vue.set(this.selectedObject, 'selected', true)
            } else {
                this.selectedObject = null
            }
        },
        onLinkSelect(link) {
            if (this.selectedObject) {
                Vue.set(this.selectedObject, 'selected', false)
                delete this.selectedObject.selected
            }
            if (this.selectedObject !== link) {
                this.selectedObject = link
                Vue.set(this.selectedObject, 'selected', true)
            } else {
                this.selectedObject = null
            }
        }
    }
}
