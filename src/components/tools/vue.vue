<template>
    <div class="tools">
        <we-file @change="onFileChange($event)"></we-file>
        <!--<we-slider class="tools-slider" v-model="sliderValue"></we-slider>-->
    </div>
</template>
<script>
    export {default} from './js'
</script>
<style lang="scss">
    @import "./scss";
</style>
