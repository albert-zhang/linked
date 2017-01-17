<template>
    <div id="app" class="app">
        <desktop class="app-desktop" :data="data" @save="onSave" @addImgs="onDesktopAddImgs"></desktop>
        <!--<tools class="app-tools"></tools>-->
        <transition name="fade">
            <drop v-show="showDropIndicator"></drop>
        </transition>
        <transition name="fade">
            <placeholder v-show="showPlaceholder"
                         @newFile="onPlaceholderNewFile" @openFile="onPlaceholderOpenFile"></placeholder>
        </transition>
        <transition name="fade">
            <toast v-show="showToast" :label="toastLabel"></toast>
        </transition>
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
    }
</style>
