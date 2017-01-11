<template>
    <div class="desktop">
        <div class="paper">
            <linked-img v-for="img in imgs" :key="img.id" :data="img"
                        @resize="onResize($event, img)" @move="onMove($event, img)"/>
        </div>
    </div>
</template>
<script>
    export {default} from './js'
</script>
<style lang="scss">
    @import "./scss";
</style>
