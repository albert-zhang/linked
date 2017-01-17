<template>
    <div id="toast">
        <div class="weui-mask_transparent"></div>
        <div class="weui-toast">
            <i class="weui-icon_toast" :class="[style]"></i>
            <p class="weui-toast__content">{{label}}</p>
        </div>
    </div>
</template>
<style lang="scss">
</style>
<script>
    export default {
        props: {
            label: {
                type: String,
                required: true
            },
            /**
             * weui-icon-success-no-circle, weui-icon-success, weui-icon-info, weui-icon-warn, weui-icon-waiting
             */
            style: {
                type: String,
                default: 'weui-icon-success-no-circle'
            }
        },
        data() {
            return {
            }
        }
    }
</script>
