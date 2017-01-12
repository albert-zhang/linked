<template>
    <div class="desktop" @mousedown="onMousedownForDragging">
        <div ref="paper" class="paper" :style="paperStyle" @mousedown="onMousedownForDragging">
            <svg ref="svg" :width="paperWidth" :height="paperHeight">
                <linked-img v-for="img in imgs" :key="img.id" :data="img"
                            :viewport-width="viewportWidth" :viewport-height="viewportHeight"
                            @resize="onResize($event, img)" @move="onMove($event, img)"/>
            </svg>
            <div ref="center" class="center">
                <svg ref="centerSvg" width="100" height="100">
                    <line x1="0" y1="50" x2="100" y2="50" style="stroke:#aaa;stroke-width:1"/>
                    <line x1="50" y1="0" x2="50" y2="100" style="stroke:#aaa;stroke-width:1"/>
                </svg>
            </div>
        </div>
    </div>
</template>
<script>
    export {default} from './js'
</script>
<style lang="scss">
    @import "./scss";
</style>
