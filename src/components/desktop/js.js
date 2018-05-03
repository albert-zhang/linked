import Consts from '../../consts'
import Store from '../../store'
import md5 from 'js-md5'
import Vue from 'vue'
import path from 'path'
import fs from 'fs'
import util from '../../util'

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
                transformOrigin: `${this.paperTCx}px ${this.paperTCy}px`,
                transform: `translateX(${this.paperTx}px) translateY(${this.paperTy}px) scale(${this.paperScale})`
            }
        },
        initialPaperTx() {
            return -(Consts.paperFullWidth - this.viewportWidth) * 0.5
        },
        initialPaperTy() {
            return -(Consts.paperFullHeight - this.viewportHeight) * 0.5
        },
        paperWidth() {
            return Consts.paperFullWidth
        },
        paperHeight() {
            return Consts.paperFullHeight
        },
        viewportWidthHalf() {
            return this.viewportWidth * 0.5
        },
        viewportHeightHalf() {
            return this.viewportHeight * 0.5
        },
        paperTCx() {
            return this.viewportWidthHalf - this.paperTx
        },
        paperTCy() {
            return this.viewportHeightHalf - this.paperTy
        }
    },
    watch: {
        paperScale(to, from) {
            Store.setPaperScale(to)
        }
    },
    created() {
        document.body.addEventListener('keydown', this.onBodyKeydown)
        const self = this
        this.$nextTick(() => {
            Store.setSvg(this.$refs.svg)
            Store.setSvgPoint(this.$refs.svg.createSVGPoint())
            this.$el.addEventListener('mousewheel', this.onMousewheel)
        })
        setTimeout(() => {
            self.viewportWidth = self.$el.offsetWidth
            self.viewportHeight = self.$el.offsetHeight
            self.paperTx = self.initialPaperTx
            self.paperTy = self.initialPaperTy
        }, 0)
    },
    methods: {
        onBodyKeydown(evt) {
            if (evt.keyCode === 8) { // backspace
                this.deleteSelectedObject(evt)
            } else if (evt.keyCode === 32) { // space
                this.quickView(evt)
            } else if (evt.keyCode === 83) { // s
                this.save(evt)
            }
        },

        deleteSelectedObject(evt) {
            if (this.selectedObject) {
                if (this.selectedObject.from) {
                    if (!window.confirm('Are you sure to delete？')) {
                        return
                    }
                } else {
                    if (!window.confirm('The related image file will be deleted permanently.\n\nAre you sure to delete？')) {
                        return
                    }
                }
                if (this.selectedObject.from) {
                    this.deleteLink(this.selectedObject)
                } else {
                    this.deleteImg(this.selectedObject)
                }
                this.selectedObject = null
            }
        },

        save(evt) {
            if (process.platform === 'darwin') {
                if (evt.metaKey) {
                    this.$emit('save')
                }
            } else {
                if (evt.ctrlKey) {
                    this.$emit('save')
                }
            }
        },

        quickView(evt) {
            if (this.paperScale === 1) {
                this.paperTx = this.initialPaperTx
                this.paperTy = this.initialPaperTy
                this.paperScale = 0.1
            } else {
                this.paperTx = this.initialPaperTx
                this.paperTy = this.initialPaperTy
                this.paperScale = 1
            }
        },

        deleteImg(img) {
            const index = this.data.imgs.indexOf(img)
            this.data.imgs.splice(index, 1)
            while (true) {
                let foundLinkIndex = -1
                for (const i in this.data.links) {
                    const link = this.data.links[i]
                    if (link.to.id === img.id || link.from.id === img.id) {
                        foundLinkIndex = i
                        break
                    }
                }
                if (foundLinkIndex >= 0) {
                    this.data.links.splice(foundLinkIndex, 1)
                } else {
                    break
                }
            }
            const fp = path.resolve(Store.fileRoot, img.file)
            fs.unlinkSync(fp) // TODO: not really delete for Undo support
            // util.moveFileToTrash(fp)
        },

        deleteLink(link) {
            const index = this.data.links.indexOf(link)
            this.data.links.splice(index, 1)
        },

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
                id: md5(new Date().toISOString() + Math.random()),
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
            this.paperScale -= evt.wheelDelta * 0.0001
            if (this.paperScale > Consts.maxPaperScale) {
                this.paperScale = Consts.maxPaperScale
            } else if (this.paperScale < Consts.minPaperScale) {
                this.paperScale = Consts.minPaperScale
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
        onSvgDbclick(evt) {
            if (evt.target === evt.currentTarget) {
                this.$emit('addImgs')
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
                dx /= this.paperScale
                dy /= this.paperScale
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
            this.handleSelectNewObject(img)
        },
        onLinkSelect(link) {
            this.handleSelectNewObject(link)
        },
        handleSelectNewObject(obj) {
            if (this.selectedObject) {
                Vue.set(this.selectedObject, 'selected', false)
                delete this.selectedObject.selected
            }
            if (this.selectedObject !== obj) {
                this.selectedObject = obj
                Vue.set(this.selectedObject, 'selected', true)
            } else {
                this.selectedObject = null
            }
        }
    }
}
