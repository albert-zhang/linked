<template>
    <div id="app" class="app">
        <desktop class="app-desktop"></desktop>
        <tools class="app-tools"></tools>
    </div>
</template>

<script>
    import Desktop from './components/desktop/vue.vue'
    import Tools from './components/tools/vue.vue'
    export default {
        name: 'app',
        components: {
            Desktop,
            Tools
        }
    }
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
        flex-flow: row nowrap;
    }
    .app-desktop {
        flex: 1;
        margin: 10px 5px 10px 10px;
        box-shadow: 1px 1px 5px #ccc;
        border-radius: 4px;
    }
    .app-tools {
        width: 200px;
        margin: 10px 10px 10px 5px;
        box-shadow: 1px 1px 5px #ccc;
        border-radius: 4px;
    }
</style>
