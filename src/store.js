import Vue from 'vue'

/* eslint-disable no-new */
export default new Vue({
    data: {
        mFileRoot: '',
        mPaperScale: 1,
        mSvg: null,
        mSvgPoint: null
    },
    computed: {
        fileRoot() {
            return this.mFileRoot
        },
        paperScale() {
            return this.mPaperScale
        },
        svg() {
            return this.mSvg
        },
        svgPoint() {
            return this.mSvgPoint
        }
    },
    created() {
    },
    methods: {
        setFileRoot(val) {
            this.mFileRoot = val
        },
        setPaperScale(val) {
            this.mPaperScale = val
        },
        setSvg(val) {
            this.mSvg = val
        },
        setSvgPoint(val) {
            this.mSvgPoint = val
        }
    }
})
