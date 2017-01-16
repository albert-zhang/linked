<template>
    <div id="app" class="app">
        <desktop class="app-desktop" :data="data"></desktop>
        <tools class="app-tools"></tools>
    </div>
</template>

<script>
    export {default} from './App.js'
</script>

<style lang="scss">
    html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        width: 100%;
        height: 100%;
    }
    .app {
        display: flex;
        flex-flow: column nowrap;
    }
    .app-desktop {
        flex: 1;
        border: 1px solid #eee;
    }
    .app-tools {
        box-sizing: border-box;
        padding: 10px;
        height: 100px;
    }
</style>
