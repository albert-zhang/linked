<template>
    <div class="weui-uploader">
        <div class="weui-uploader__bd">
            <div class="weui-uploader__input-box">
                <input class="weui-uploader__input" type="file" accept="image/*" @change="onFileChange($event)" multiple>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
</style>
<script>
    export default {
        data() {
            return {
            }
        },
        methods: {
            onFileChange(evt) {
                this.$emit('change', evt)
            }
        }
    }
</script>
