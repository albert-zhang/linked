import FileFormat from './file-format'
import Store from './store'
import Desktop from './components/desktop/vue.vue'
import Tools from './components/tools/vue.vue'
import Drop from './components/drop/vue.vue'
import Placeholder from './components/placeholder/vue.vue'
import Toast from './components/weui/we-toast.vue'
import md5 from 'js-md5'
import fileUrl from 'file-url'
import path from 'path'
import fs from 'fs'
import util from './util'

const {Menu, app, dialog} = require('electron').remote

export default {
    name: 'app',
    components: {
        Desktop,
        Tools,
        Drop,
        Placeholder,
        Toast
    },
    data() {
        return {
            data: FileFormat,
            dataOriginal: null,
            showDropIndicator: false,
            showPlaceholder: true,
            paperScale: 1,
            toastLabel: '',
            showToast: false
        }
    },
    computed: {
    },
    created() {
        window.addEventListener('beforeunload', this.onBeforeunload)

        this.data = {}
        this.createAppMenu()
        this.addDropHandler()

        // this.loadFile('/Users/yangzhang/Desktop/sample.linked') // ///////////////////////////////////////////////////////
    },
    methods: {
        toast(str) {
            this.toastLabel = str
            this.showToast = true
            const self = this
            setTimeout(() => {
                self.showToast = false
            }, 1000)
        },
        createAppMenu() {
            const self = this
            const template = [
                {
                    label: 'File',
                    submenu: [
                        {
                            label: 'New',
                            click() {
                                self.newFileAction()
                            }
                        },
                        {
                            label: 'Open...',
                            click() {
                                self.openFileAction()
                            }
                        },
                        {
                            label: 'Save',
                            click() {
                                self.saveFile()
                            }
                        }
                    ]
                },
                {
                    label: 'Edit',
                    submenu: [
                        {
                            label: 'Add Image...',
                            click() {
                                self.addImageAction()
                            }
                        },
                        {
                            type: 'separator'
                        },
                        // {
                        //     role: 'undo'
                        // },
                        // {
                        //     role: 'redo'
                        // },
                        // {
                        //     type: 'separator'
                        // },
                        {
                            role: 'cut'
                        },
                        {
                            role: 'copy'
                        },
                        {
                            role: 'paste'
                        }
                        // {
                        //     role: 'pasteandmatchstyle'
                        // },
                        // {
                        //     role: 'delete'
                        // },
                        // {
                        //     role: 'selectall'
                        // }
                    ]
                }
            ]
            if (process.platform === 'darwin') {
                template.unshift({
                    label: app.getName(),
                    submenu: [
                        {
                            role: 'about'
                        },
                        {
                            type: 'separator'
                        },
                        {
                            role: 'hide'
                        },
                        {
                            role: 'hideothers'
                        },
                        {
                            role: 'unhide'
                        },
                        {
                            type: 'separator'
                        },
                        {
                            role: 'quit'
                        }
                    ]
                })
            }

            const menu = Menu.buildFromTemplate(template)
            Menu.setApplicationMenu(menu)
        },

        addDropHandler() {
            document.body.addEventListener('dragover', this.onDragover)
            document.body.addEventListener('drop', this.onDragdrop)
            document.body.addEventListener('dragleave', this.onDragleave)
        },
        onDragover(evt) {
            evt.preventDefault()
            if (!Store.fileRoot) {
                return
            }
            if (!this.showDropIndicator) {
                evt.dataTransfer.dropEffect = 'copy'
                this.showDropIndicator = true
            }
        },
        onDragdrop(evt) {
            evt.preventDefault()
            this.showDropIndicator = false
            if (!Store.fileRoot) {
                return
            }
            try {
                this.addImgs(evt.dataTransfer.files)
            } catch (ex) {
                window.alert('Error: ' + ex.message)
            }
        },
        onDragleave(evt) {
            evt.preventDefault()
            if (!Store.fileRoot) {
                return
            }
            this.showDropIndicator = false
        },

        chooseDirectory(buttonLabel) {
            const opts = {
                properties: ['openDirectory', 'openFile'],
                filters: [
                    {name: 'Linked Files', extensions: ['linked']}
                ]
            }
            if (buttonLabel) {
                opts.buttonLabel = buttonLabel
            }
            const r = dialog.showOpenDialog(opts)
            let f = null
            if ((r instanceof Array) && r.length === 1) {
                f = r[0]
            }
            if (f && !fs.statSync(f).isDirectory()) {
                window.alert('Not a linked folder')
                return null
            }
            return f
        },

        newFileAction() {
            this.closeFile().then(() => {
                const f = this.chooseDirectory('Create')
                if (f) {
                    this.newFile(f)
                }
            })
        },

        openFileAction() {
            this.closeFile().then(() => {
                const f = this.chooseDirectory()
                if (f) {
                    this.loadFile(f)
                }
            })
        },

        addImageAction() {
            const r = dialog.showOpenDialog({
                properties: ['openFile', 'multiSelections', 'createDirectory'],
                filters: [
                    {name: 'Image Files', extensions: ['jpg', 'jpeg', 'png']}
                ]})
            if (r instanceof Array) {
                const fileList = {
                    length: r.length
                }
                r.forEach((v, i) => {
                    fileList[i] = {
                        path: v
                    }
                })
                this.addImgs(fileList)
            }
        },

        onPlaceholderNewFile() {
            this.newFileAction()
        },

        onPlaceholderOpenFile() {
            this.openFileAction()
        },

        checkUnsaved() {
            return this.dataOriginal &&
                this.data &&
                JSON.stringify(this.dataOriginal) !== JSON.stringify(this.data)
        },

        onBeforeunload(evt) {
            if (this.checkUnsaved()) {
                const r = window.confirm('Some changes not saved yet, are you sure to close?')
                if (!r) {
                    evt.preventDefault()
                    evt.returnValue = 'o/'
                    return 'o/'
                }
            }
        },

        closeFile() {
            if (Store.fileRoot) {
                if (this.checkUnsaved()) {
                    const r = window.confirm('Some changes not saved yet, are you sure to close?')
                    if (r) {
                        return Promise.resolve('')
                    } else {
                        return Promise.reject('')
                    }
                }
            }
            this.data = {}
            Store.setFileRoot(null)
            this.showPlaceholder = true
            return Promise.resolve('')
        },

        loadFile(f) {
            try {
                const dataFile = path.resolve(f, 'data.linked')
                const jsonStr = fs.readFileSync(dataFile).toString()
                this.data = JSON.parse(jsonStr)
                this.dataOriginal = JSON.parse(jsonStr)
                Store.setFileRoot(f)
                this.showPlaceholder = false
            } catch (ex) {
                window.alert(ex.message)
            }
        },

        newFile(f) {
            try {
                const dataFile = path.resolve(f, 'data.linked')
                if (fs.existsSync(dataFile)) {
                    throw new Error('File already exist')
                }
                const data = JSON.parse(JSON.stringify(FileFormat))
                data.imgs = []
                data.links = []
                const jsonStr = JSON.stringify(data, null, '  ')
                fs.writeFileSync(dataFile, jsonStr)
                this.data = data
                Store.setFileRoot(f)
                this.showPlaceholder = false
            } catch (ex) {
                window.alert(ex.message)
            }
        },

        saveFile() {
            try {
                if (Store.fileRoot) {
                    const jsonStr = JSON.stringify(this.data, null, '  ')
                    const dataFile = path.resolve(Store.fileRoot, 'data.linked')
                    fs.writeFileSync(dataFile, jsonStr)
                    this.dataOriginal = JSON.parse(jsonStr)
                    console.log('saved')
                    this.toast('Saved')
                }
            } catch (ex) {
                window.alert('Save failed: ' + ex.message)
            }
        },

        addImgs(fileList) {
            const promises = []
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i]
                const promise = new Promise((resolve, reject) => {
                    const img = new window.Image()
                    img.onload = () => {
                        resolve({width: img.width, height: img.height})
                    }
                    img.onerror = () => {
                        reject('Not a valid image file: ' + file.path)
                    }
                    img.src = fileUrl(file.path)
                })
                promises.push(promise)

                promise.then((size) => {
                    let f = 0
                    if (size.width > size.height) {
                        f = 300 / size.width
                    } else {
                        f = 300 / size.height
                    }

                    const imgName = md5(new Date().toISOString() + Math.random()) + path.extname(file.path)
                    const imgId = md5(new Date().toISOString() + Math.random())

                    util.copyFile(file.path, path.resolve(Store.fileRoot, imgName))
                    this.data.imgs.push({
                        id: imgId,
                        file: imgName,
                        x: 0,
                        y: 0,
                        width: Math.round(size.width * f),
                        height: Math.round(size.height * f)
                    })
                    return Promise.resolve('')
                }).catch(err => {
                    return Promise.reject(err)
                })
            }
            Promise.all(promises).catch((err) => {
                window.alert('Error: ' + err)
            })
        },

        onDesktopAddImgs() {
            this.addImageAction()
        },

        onSave() {
            this.saveFile()
        }
    }
}
