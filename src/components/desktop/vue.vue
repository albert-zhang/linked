<template>
    <div class="desktop">
        <div ref="paper" class="paper" :style="paperStyle">
            <div ref="center" class="center">
                <svg ref="centerSvg" width="100" height="100">
                    <line x1="0" y1="50" x2="100" y2="50" style="stroke:#aaa;stroke-width:1"/>
                    <line x1="50" y1="0" x2="50" y2="100" style="stroke:#aaa;stroke-width:1"/>
                </svg>
            </div>
            <svg ref="svg" :width="paperWidth" :height="paperHeight" @mousedown="onMousedownForDragging" @mousemove="onSvgMousemove($event)">
                <marker id="triangle"
                        viewBox="0 0 10 10" refX="0" refY="5"
                        markerUnits="strokeWidth"
                        markerWidth="4" markerHeight="3"
                        orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#f00"/>
                </marker>
                <linked-img v-for="img in data.imgs" :key="img.id" :data="img"
                            :viewport-width="viewportWidth" :viewport-height="viewportHeight"
                            @resize="onResize($event, img)" @move="onMove($event, img)"/>
                <linked-link v-for="link in data.links" :key="link.id" :data="link" :imgs="data.imgs"
                            :viewport-width="viewportWidth" :viewport-height="viewportHeight"/>
            </svg>
        </div>
    </div>
</template>
<script>
    export {default} from './js'
</script>
<style lang="scss">
    @import "./scss";
</style>
