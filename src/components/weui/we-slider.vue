<template>
    <div class="weui-slider-box">
        <div class="weui-slider">
            <div ref="sliderInner" class="weui-slider__inner">
                <div ref="sliderTrack" :style="trackWidthStyle" class="weui-slider__track"></div>
                <div ref="sliderHandler" :style="handlerLeftStyle" class="weui-slider__handler" @mousedown="mousedown($event)"></div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">

</style>
<script>
    export default {
        props: {
            value: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                isMouseDown: false,
                startScreenX: 0,
                startScreenY: 0,
                startPercentStyle: 0,
                trackWidth: 0,
                percentStyle: 0
            }
        },
        components: {
        },
        computed: {
            trackWidthStyle() {
                return {width: this.percentStyle + '%'}
            },
            handlerLeftStyle() {
                return {left: this.percentStyle + '%'}
            }
        },
        watch: {
            value: function(to, from) {
                this.updatePercentStyle(to)
            }
        },
        created() {
            const self = this
            setTimeout(function() {
                self.trackWidth = self.$refs.sliderInner.offsetWidth
            }, 0)
            this.updatePercentStyle(this.value)
        },
        methods: {
            mousedown(evt) {
                this.isMouseDown = true
                this.startScreenX = evt.screenX
                this.startScreenY = evt.screenY
                this.startPercentStyle = this.percentStyle
                document.body.addEventListener('mousemove', this.mousemove)
                document.body.addEventListener('mouseup', this.mouseup)
            },
            mousemove(evt) {
                if (this.isMouseDown) {
                    const dx = evt.screenX - this.startScreenX
                    const dy = evt.screenY - this.startScreenY
                    const percent = dx / this.trackWidth
                    this.updatePercentStyle(percent)
                    this.$emit('input', this.percentStyle / 100)
                }
            },
            mouseup(evt) {
                if (this.isMouseDown) {
                    this.isMouseDown = false
                    document.body.removeEventListener('mousemove', this.mousemove)
                    document.body.removeEventListener('mouseup', this.mouseup)
                }
            },
            updatePercentStyle(val) {
                this.percentStyle = this.startPercentStyle + Math.round(val * 100)
                if (this.percentStyle > 100) {
                    this.percentStyle = 100
                } else if (this.percentStyle < 0) {
                    this.percentStyle = 0
                }
            }
        }
    }
</script>
