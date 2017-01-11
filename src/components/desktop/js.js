// import LinkedImg from '../img/js'

import FileFormat from '../../file-format'

export default {
    components: {
        // LinkedImg
    },
    data() {
        return {
            imgs: []
        }
    },
    created() {
        this.imgs = FileFormat.imgs
    },
    methods: {
        onResize(dt, img) {
            img.width += dt.dx
            img.height += dt.dy
        },
        onMove(dt, img) {
            img.x += dt.dx
            img.y += dt.dy
        }
    }
}
