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
        created() {
            const self = this
            setTimeout(function() {
                self.trackWidth = self.$refs.sliderInner.offsetWidth
            }, 0)
        },
        methods: {
            mousedown(evt) {
                this.isMouseDown = true
                this.startScreenX = evt.screenX
                this.startScreenY = evt.screenY
                this.startPercentStyle = this.percentStyle

                const self = this
                document.body.addEventListener('mousemove', this.mousemove)
                document.body.addEventListener('mouseup', this.mouseup)
            },
            mousemove(evt) {
                if (this.isMouseDown) {
                    const dx = evt.screenX - this.startScreenX
                    const dy = evt.screenY - this.startScreenY
                    const percent = dx / this.trackWidth
                    this.percentStyle = this.startPercentStyle + Math.round(percent * 100)
                    if (this.percentStyle > 100) {
                        this.percentStyle = 100
                    } else if (this.percentStyle < 0) {
                        this.percentStyle = 0
                    }
                }
            },
            mouseup(evt) {
                if (this.isMouseDown) {
                    this.isMouseDown = false
                    document.body.removeEventListener('mousemove', this.mousemove)
                    document.body.removeEventListener('mouseup', this.mouseup)
                }
            }
        }
    }
</script>
