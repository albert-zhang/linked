<template>
    <div class="drop">
        <div>Drop to add image</div>
    </div>
</template>

<script>
    export default {

    }
</script>

<style lang="scss">
    .drop {
        position: absolute;
        z-index: 10;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #eee;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        div {
            font-family: 'Avenir', Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            color: #6c7e90;
            text-shadow: 0px 2px 2px #fff;
            font-size: 40px;
            font-weight: bold;
        }
    }
</style>
