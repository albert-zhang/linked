import FileFormat from './file-format'
import Store from './store'
import Desktop from './components/desktop/vue.vue'
import Tools from './components/tools/vue.vue'
import Drop from './components/drop/vue.vue'
import md5 from 'js-md5'

import shelljs from 'shelljs'
import path from 'path'
import fs from 'fs'

const {Menu, app, dialog} = require('electron').remote

export default {
    name: 'app',
    components: {
        Desktop,
        Tools,
        Drop
    },
    data() {
        return {
            data: FileFormat,
            showDropIndicator: false,
            paperScale: 1
        }
    },
    computed: {
    },
    created() {
        this.data = {}
        this.createAppMenu()
        this.addDropHandler()

        this.loadFile('/Users/yangzhang/Desktop/file-linked') // ///////////////////////////////////////////////////////
    },
    methods: {
        addDropHandler() {
            document.body.addEventListener('dragover', this.onDragover)
            document.body.addEventListener('drop', this.onDragdrop)
            document.body.addEventListener('dragleave', this.onDragleave)
        },
        onDragover(evt) {
            evt.preventDefault()
            if (!this.showDropIndicator) {
                evt.dataTransfer.dropEffect = 'copy'
                this.showDropIndicator = true
            }
        },
        onDragdrop(evt) {
            evt.preventDefault()
            this.showDropIndicator = false
            try {
                this.addImgs(evt.dataTransfer.files)
            } catch (ex) {
                window.alert('Error: ' + ex.message)
            }
        },
        onDragleave(evt) {
            evt.preventDefault()
            this.showDropIndicator = false
        },

        createAppMenu() {
            const self = this
            const template = [
                {
                    label: 'File',
                    submenu: [
                        {
                            label: 'Open...',
                            click() {
                                self.onOpenFileMenuAction()
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
                            role: 'undo'
                        },
                        {
                            role: 'redo'
                        },
                        {
                            type: 'separator'
                        },
                        {
                            role: 'cut'
                        },
                        {
                            role: 'copy'
                        },
                        {
                            role: 'paste'
                        },
                        {
                            role: 'pasteandmatchstyle'
                        },
                        {
                            role: 'delete'
                        },
                        {
                            role: 'selectall'
                        }
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

        onOpenFileMenuAction() {
            const r = dialog.showOpenDialog({
                properties: ['openDirectory'], // openFile
                filters: [
                    {name: 'Linked Files', extensions: ['linked']}
                ]})
            let f = null
            if ((r instanceof Array) && r.length === 1) {
                f = r[0]
            }
            if (!f) {
                return
            }
            this.loadFile(f)
        },

        loadFile(f) {
            try {
                Store.setFileRoot(f)
                const cfg = path.resolve(f, 'data.linked')
                const jsonStr = fs.readFileSync(cfg).toString()
                this.data = JSON.parse(jsonStr)
            } catch (ex) {
                window.alert(ex.message)
            }
        },

        saveFile() {
            try {
                const jsonStr = JSON.stringify(this.data, null, '  ')
                const cfg = path.resolve(Store.fileRoot, 'data.linked')
                fs.writeFileSync(cfg, jsonStr)
                console.log('File saved')
            } catch (ex) {
                window.alert('Save failed: ' + ex.message)
            }
        },

        addImgs(fileList) {
            const getFileExt = fn => {
                const dotIndex = fn.lastIndexOf('.')
                if (dotIndex === -1) {
                    return 'bin'
                }
                return fn.substring(dotIndex + 1)
            }

            const promises = []
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i]
                const promise = new Promise((resolve, reject) => {
                    const img = new window.Image()
                    img.onload = () => {
                        resolve({width: img.width, height: img.height})
                    }
                    img.onerror = () => {
                        reject('Not a valid image file: ' + file.type)
                    }
                    img.src = window.URL.createObjectURL(file)
                })
                promises.push(promise)

                promise.then((size) => {
                    let f = 0
                    if (size.width > size.height) {
                        f = 300 / size.width
                    } else {
                        f = 300 / size.height
                    }

                    const ext = getFileExt(file.name)
                    const imgName = md5(new Date().toISOString() + Math.random()) + '.' + ext
                    const imgId = md5(new Date().toISOString() + Math.random())

                    shelljs.cp(file.path, `${Store.fileRoot}${path.sep}${imgName}`)
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

        onAddImgs(fileList) {
            this.addImgs(fileList)
        },

        onSave() {
            this.saveFile()
        }
    }
}
