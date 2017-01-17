<template>
    <div class="placeholder">
        <button @click="onNew">New File</button>
        <button @click="onOpen">Open File</button>
    </div>
</template>

<script>
    export default {
        methods: {
            onNew() {
                this.$emit('newFile')
            },
            onOpen() {
                this.$emit('openFile')
            }
        }
    }
</script>

<style lang="scss">
    .placeholder {
        position: absolute;
        z-index: 9;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #eee;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        button {
            font-family: 'Avenir', Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            color: #6c7e90;
            padding: 10px 40px;
            margin: 20px;
            text-shadow: 0px 2px 2px #fff;
            font-size: 20px;
            font-weight: bold;
            background-color: #f5f5f5;
            border: 1px solid #aaa;
            border-radius: 10px;
            outline: none;
            &:active {
                background-color: #ddd;
            }
        }
    }
</style>
