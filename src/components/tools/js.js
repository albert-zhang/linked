import WeSlider from '../weui/we-slider.vue'
import WeFile from '../weui/we-file.vue'
import Consts from '../../consts'

export default {
    components: {
        WeSlider,
        WeFile
    },
    data() {
    },
    computed: {
    },
    watch: {
    },
    created() {
    },
    methods: {
        onFileChange(evt) {
            this.$emit('addImgs', evt.target.files)
        }
    }
}
