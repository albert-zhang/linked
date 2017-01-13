
export default {
    components: {
    },
    methods: {
        onFileChange(evt) {
            const f = evt.target.files[0]
            this.$emit('addImg', f)
        }
    }
}
